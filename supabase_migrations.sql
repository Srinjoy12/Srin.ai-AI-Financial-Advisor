-- Create budget_alerts table
CREATE TABLE IF NOT EXISTS budget_alerts (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    current_spending DECIMAL(12,2) NOT NULL,
    budget_limit DECIMAL(12,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('warning', 'danger', 'exceeded')),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_goals table
CREATE TABLE IF NOT EXISTS financial_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_name TEXT NOT NULL,
    target_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) DEFAULT 0,
    target_date DATE NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'emergency_fund', 'house_down_payment', 'retirement', 'vacation', 
        'education', 'debt_payoff', 'investment', 'other'
    )),
    priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    monthly_contribution DECIMAL(12,2) DEFAULT 0,
    auto_contribute BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'paused', 'cancelled')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goal_contributions table
CREATE TABLE IF NOT EXISTS goal_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID REFERENCES financial_goals(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    contribution_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type TEXT NOT NULL CHECK (type IN ('manual', 'automatic', 'bonus')) DEFAULT 'manual',
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_budget_alerts_user_id ON budget_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_alerts_created_at ON budget_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_budget_alerts_is_read ON budget_alerts(is_read);

CREATE INDEX IF NOT EXISTS idx_financial_goals_user_id ON financial_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_goals_status ON financial_goals(status);
CREATE INDEX IF NOT EXISTS idx_financial_goals_target_date ON financial_goals(target_date);

CREATE INDEX IF NOT EXISTS idx_goal_contributions_goal_id ON goal_contributions(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_contributions_date ON goal_contributions(contribution_date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE budget_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_contributions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for budget_alerts
CREATE POLICY "Users can view their own budget alerts" ON budget_alerts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budget alerts" ON budget_alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget alerts" ON budget_alerts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budget alerts" ON budget_alerts
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for financial_goals
CREATE POLICY "Users can view their own financial goals" ON financial_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own financial goals" ON financial_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own financial goals" ON financial_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financial goals" ON financial_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for goal_contributions
CREATE POLICY "Users can view contributions for their goals" ON goal_contributions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM financial_goals 
            WHERE financial_goals.id = goal_contributions.goal_id 
            AND financial_goals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert contributions for their goals" ON goal_contributions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM financial_goals 
            WHERE financial_goals.id = goal_contributions.goal_id 
            AND financial_goals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update contributions for their goals" ON goal_contributions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM financial_goals 
            WHERE financial_goals.id = goal_contributions.goal_id 
            AND financial_goals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete contributions for their goals" ON goal_contributions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM financial_goals 
            WHERE financial_goals.id = goal_contributions.goal_id 
            AND financial_goals.user_id = auth.uid()
        )
    );

-- Create triggers to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_budget_alerts_updated_at 
    BEFORE UPDATE ON budget_alerts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_goals_updated_at 
    BEFORE UPDATE ON financial_goals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 