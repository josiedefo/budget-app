-- Budget App Database Schema

-- Create enum for budget categories
CREATE TYPE budget_category AS ENUM ('income', 'expenses');

-- Create enum for months
CREATE TYPE month_name AS ENUM (
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
);

-- Create users table (for future multi-user support)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create budget_items table
CREATE TABLE budget_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category budget_category NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category, item_name)
);

-- Create budget_amounts table for planned and actual values
CREATE TABLE budget_amounts (
    id SERIAL PRIMARY KEY,
    budget_item_id INTEGER REFERENCES budget_items(id) ON DELETE CASCADE,
    month month_name NOT NULL,
    planned_amount DECIMAL(10,2) DEFAULT 0.00,
    actual_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(budget_item_id, month)
);

-- Create indexes for better performance
CREATE INDEX idx_budget_items_user_category ON budget_items(user_id, category);
CREATE INDEX idx_budget_amounts_item_month ON budget_amounts(budget_item_id, month);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_items_updated_at BEFORE UPDATE ON budget_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_amounts_updated_at BEFORE UPDATE ON budget_amounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default user for single-user mode
INSERT INTO users (email, name) VALUES ('user@budgetapp.com', 'Default User');

-- Insert default budget items for the default user
WITH default_user AS (
    SELECT id FROM users WHERE email = 'user@budgetapp.com'
),
income_items AS (
    INSERT INTO budget_items (user_id, category, item_name)
    SELECT id, 'income', item_name
    FROM default_user,
    UNNEST(ARRAY['Salary', 'Freelance', 'Other Income']) AS item_name
    RETURNING id, item_name
),
expense_items AS (
    INSERT INTO budget_items (user_id, category, item_name)
    SELECT id, 'expenses', item_name
    FROM default_user,
    UNNEST(ARRAY[
        'Rent/Mortgage', 'Utilities', 'Groceries', 'Transportation',
        'Entertainment', 'Healthcare', 'Insurance', 'Savings',
        'Debt Payment', 'Miscellaneous'
    ]) AS item_name
    RETURNING id, item_name
)
-- Insert default budget amounts
INSERT INTO budget_amounts (budget_item_id, month, planned_amount, actual_amount)
SELECT 
    bi.id,
    month_name,
    CASE 
        WHEN bi.item_name = 'Salary' THEN 5000.00
        WHEN bi.item_name = 'Freelance' THEN 500.00
        WHEN bi.item_name = 'Other Income' THEN 0.00
        WHEN bi.item_name = 'Rent/Mortgage' THEN 1200.00
        WHEN bi.item_name = 'Utilities' THEN 150.00
        WHEN bi.item_name = 'Groceries' THEN 400.00
        WHEN bi.item_name = 'Transportation' THEN 200.00
        WHEN bi.item_name = 'Entertainment' THEN 300.00
        WHEN bi.item_name = 'Healthcare' THEN 100.00
        WHEN bi.item_name = 'Insurance' THEN 250.00
        WHEN bi.item_name = 'Savings' THEN 500.00
        WHEN bi.item_name = 'Debt Payment' THEN 300.00
        WHEN bi.item_name = 'Miscellaneous' THEN 200.00
        ELSE 0.00
    END as planned,
    CASE 
        -- Add some variance to actual amounts for demonstration
        WHEN bi.item_name = 'Salary' AND month_name IN ('Jan', 'Jul') THEN 5000.00 + (RANDOM() * 400 - 200)
        WHEN bi.item_name = 'Salary' THEN 5000.00 + (RANDOM() * 200 - 100)
        WHEN bi.item_name = 'Freelance' THEN 500.00 + (RANDOM() * 400 - 200)
        WHEN bi.item_name = 'Other Income' AND month_name IN ('Jan', 'Mar') THEN RANDOM() * 150
        WHEN bi.item_name = 'Other Income' THEN 0.00
        WHEN bi.item_name = 'Rent/Mortgage' THEN 1200.00
        WHEN bi.item_name = 'Utilities' THEN 150.00 + (RANDOM() * 80 - 40)
        WHEN bi.item_name = 'Groceries' THEN 400.00 + (RANDOM() * 100 - 50)
        WHEN bi.item_name = 'Transportation' THEN 200.00 + (RANDOM() * 100 - 50)
        WHEN bi.item_name = 'Entertainment' THEN 300.00 + (RANDOM() * 200 - 100)
        WHEN bi.item_name = 'Healthcare' THEN 100.00 + (RANDOM() * 100 - 50)
        WHEN bi.item_name = 'Insurance' THEN 250.00
        WHEN bi.item_name = 'Savings' THEN 500.00 + (RANDOM() * 200 - 100)
        WHEN bi.item_name = 'Debt Payment' THEN 300.00
        WHEN bi.item_name = 'Miscellaneous' THEN 200.00 + (RANDOM() * 100 - 50)
        ELSE 0.00
    END as actual
FROM budget_items bi
CROSS JOIN (
    SELECT unnest(enum_range(NULL::month_name)) AS month_name
) months
WHERE bi.user_id = (SELECT id FROM users WHERE email = 'user@budgetapp.com');