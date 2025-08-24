import { NextRequest, NextResponse } from 'next/server';
import { groq } from '@/lib/groq';
import { supabase } from '@/lib/supabaseClient';
import pdf from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const bankStatement = formData.get('bank-statement') as File;
    const salarySlip = formData.get('salary-slip') as File;

    if (!bankStatement) {
      return NextResponse.json({ success: false, message: 'Bank statement is required.' }, { status: 400 });
    }

    // Extract text from bank statement
    const buffer = await bankStatement.arrayBuffer();
    const { text: bankText } = await pdf(buffer);

    // Extract text from salary slip if provided
    let salaryText = '';
    if (salarySlip) {
      const salaryBuffer = await salarySlip.arrayBuffer();
      const { text } = await pdf(salaryBuffer);
      salaryText = text;
    }

    // Get authenticated user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ success: false, message: 'Invalid authentication.' }, { status: 401 });
    }

    // 1. Transaction Analysis
    const transactionAnalysis = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Analyze the following bank statement and provide detailed transaction analysis. Focus on Indian Rupees (₹) and categorize spending patterns. Return a JSON object with the following structure:
          {
            "totalIncome": number,
            "totalExpenses": number,
            "netSavings": number,
            "spendingCategories": {
              "groceries": { "amount": number, "percentage": number },
              "entertainment": { "amount": number, "percentage": number },
              "utilities": { "amount": number, "percentage": number },
              "transportation": { "amount": number, "percentage": number },
              "healthcare": { "amount": number, "percentage": number },
              "shopping": { "amount": number, "percentage": number },
              "dining": { "amount": number, "percentage": number },
              "others": { "amount": number, "percentage": number }
            },
            "recurringExpenses": [
              { "category": string, "amount": number, "frequency": string }
            ],
            "monthlyAverages": {
              "income": number,
              "expenses": number,
              "savings": number
            },
            "transactions": [
              { "date": string, "description": string, "amount": number, "category": string, "type": "income"|"expense" }
            ]
          }
          
          Bank Statement: ${bankText}`
        },
      ],
      model: 'llama3-70b-8192',
    });

    // 2. Budget Calculation
    const budgetAnalysis = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Based on the following financial data, provide AI-powered budget recommendations for an Indian user. Consider the 50/30/20 rule and Indian financial context. Return a JSON object:
          {
            "recommendedBudget": {
              "needs": { "amount": number, "percentage": 50 },
              "wants": { "amount": number, "percentage": 30 },
              "savings": { "amount": number, "percentage": 20 }
            },
            "spendingLimits": {
              "groceries": number,
              "entertainment": number,
              "utilities": number,
              "transportation": number,
              "healthcare": number,
              "shopping": number,
              "dining": number
            },
            "savingsGoals": [
              { "goal": string, "targetAmount": number, "monthlyContribution": number, "timeline": string }
            ],
            "budgetAdjustments": [
              { "category": string, "currentSpending": number, "recommendedLimit": number, "suggestion": string }
            ]
          }
          
          Financial Data: ${JSON.stringify(transactionAnalysis.choices[0]?.message?.content)}
          Salary Information: ${salaryText}`
        },
      ],
      model: 'llama3-70b-8192',
    });

    // 3. Investment Planning
    const investmentAnalysis = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Provide comprehensive investment recommendations for an Indian investor based on the financial profile. Consider Indian market conditions, tax benefits, and risk profiles. Return a JSON object:
          {
            "riskAssessment": {
              "riskProfile": "conservative"|"moderate"|"aggressive",
              "riskScore": number,
              "factors": [string]
            },
            "stockRecommendations": [
              {
                "symbol": string,
                "name": string,
                "sector": string,
                "allocation": number,
                "reasoning": string,
                "riskLevel": string
              }
            ],
            "mutualFundRecommendations": [
              {
                "name": string,
                "type": string,
                "allocation": number,
                "expectedReturn": number,
                "riskLevel": string,
                "reasoning": string
              }
            ],
            "fixedDepositStrategy": {
              "recommendedAmount": number,
              "tenure": string,
              "expectedReturn": number,
              "banks": [string]
            },
            "portfolioDiversification": {
              "equity": number,
              "debt": number,
              "gold": number,
              "realEstate": number,
              "emergencyFund": number
            },
            "taxOptimization": [
              { "instrument": string, "taxBenefit": string, "recommendedAmount": number }
            ]
          }
          
          Financial Profile: ${JSON.stringify(transactionAnalysis.choices[0]?.message?.content)}
          Budget Analysis: ${JSON.stringify(budgetAnalysis.choices[0]?.message?.content)}`
        },
      ],
      model: 'llama3-70b-8192',
    });

    // Parse AI responses
    const transactionData = JSON.parse(transactionAnalysis.choices[0]?.message?.content || '{}');
    const budgetData = JSON.parse(budgetAnalysis.choices[0]?.message?.content || '{}');
    const investmentData = JSON.parse(investmentAnalysis.choices[0]?.message?.content || '{}');

    // Store comprehensive analysis in database
    const { data, error } = await supabase
      .from('ai_analysis')
      .insert([
        { 
          user_id: user.id, 
          analysis_type: 'comprehensive_analysis', 
          recommendations: {
            transactionAnalysis: transactionData,
            budgetAnalysis: budgetData,
            investmentAnalysis: investmentData,
            timestamp: new Date().toISOString()
          }
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ success: false, message: 'Failed to store AI analysis.' }, { status: 500 });
    }

    // Store transactions in transactions table
    if (transactionData.transactions) {
      const transactions = transactionData.transactions.map((tx: any) => ({
        user_id: user.id,
        amount: tx.amount,
        category: tx.category,
        description: tx.description,
        transaction_date: tx.date,
        type: tx.type
      }));

      await supabase.from('transactions').insert(transactions);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Financial analysis completed successfully! Your personalized insights are ready.',
      data: {
        transactionAnalysis: transactionData,
        budgetAnalysis: budgetData,
        investmentAnalysis: investmentData
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
  }
} 