import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ success: false, message: 'Invalid authentication.' }, { status: 401 });
    }

    console.log('Fetching analysis for user:', user.id);

    // Fetch the latest analysis for the user
    const { data: analysis, error } = await supabase
      .from('ai_analysis')
      .select('*')
      .eq('user_id', user.id)
      .eq('analysis_type', 'comprehensive_analysis')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Supabase error fetching analysis:', error);
      
      // If no rows found, return a more specific message
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          success: false, 
          message: 'No analysis found. Please upload your financial documents first.',
          code: 'NO_ANALYSIS'
        }, { status: 404 });
      }
      
      return NextResponse.json({ success: false, message: 'Failed to fetch analysis.' }, { status: 500 });
    }

    if (!analysis) {
      return NextResponse.json({ 
        success: false, 
        message: 'No analysis found. Please upload your financial documents first.',
        code: 'NO_ANALYSIS'
      }, { status: 404 });
    }

    console.log('Analysis found:', analysis.id);

    return NextResponse.json({ 
      success: true, 
      data: analysis.recommendations 
    });

  } catch (error) {
    console.error('Analysis fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'An unexpected error occurred while fetching analysis.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 