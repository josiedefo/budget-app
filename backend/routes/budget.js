const express = require('express');
const Joi = require('joi');
const pool = require('../database');
const router = express.Router();

// Validation schemas
const updateAmountSchema = Joi.object({
  planned_amount: Joi.number().min(0).optional(),
  actual_amount: Joi.number().min(0).optional()
});

const createItemSchema = Joi.object({
  category: Joi.string().valid('income', 'expenses').required(),
  item_name: Joi.string().min(1).max(255).required()
});

// GET /api/budget - Get all budget data
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        bi.id,
        bi.category,
        bi.item_name,
        ba.month,
        ba.planned_amount,
        ba.actual_amount
      FROM budget_items bi
      LEFT JOIN budget_amounts ba ON bi.id = ba.budget_item_id
      WHERE bi.user_id = 1
      ORDER BY 
        bi.category,
        bi.item_name,
        CASE ba.month
          WHEN 'Jan' THEN 1
          WHEN 'Feb' THEN 2
          WHEN 'Mar' THEN 3
          WHEN 'Apr' THEN 4
          WHEN 'May' THEN 5
          WHEN 'Jun' THEN 6
          WHEN 'Jul' THEN 7
          WHEN 'Aug' THEN 8
          WHEN 'Sep' THEN 9
          WHEN 'Oct' THEN 10
          WHEN 'Nov' THEN 11
          WHEN 'Dec' THEN 12
        END
    `;
    
    const result = await pool.query(query);
    
    // Transform data to match frontend format
    const budgetData = { income: {}, expenses: {} };
    
    result.rows.forEach(row => {
      const { category, item_name, month, planned_amount, actual_amount } = row;
      
      if (!budgetData[category][item_name]) {
        budgetData[category][item_name] = {};
      }
      
      budgetData[category][item_name][month] = {
        planned: parseFloat(planned_amount) || 0,
        actual: parseFloat(actual_amount) || 0
      };
    });
    
    res.json(budgetData);
  } catch (error) {
    console.error('Error fetching budget data:', error);
    res.status(500).json({ error: 'Failed to fetch budget data' });
  }
});

// PUT /api/budget/:category/:itemName/:month - Update planned or actual amount
router.put('/:category/:itemName/:month', async (req, res) => {
  try {
    const { category, itemName, month } = req.params;
    
    // Validate input
    const { error, value } = updateAmountSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    const { planned_amount, actual_amount } = value;
    
    // First, get the budget item ID
    const itemQuery = `
      SELECT id FROM budget_items 
      WHERE user_id = 1 AND category = $1 AND item_name = $2
    `;
    const itemResult = await pool.query(itemQuery, [category, itemName]);
    
    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Budget item not found' });
    }
    
    const budgetItemId = itemResult.rows[0].id;
    
    // Build update query dynamically
    const updateFields = [];
    const values = [];
    let valueIndex = 1;
    
    if (planned_amount !== undefined) {
      updateFields.push(`planned_amount = $${valueIndex}`);
      values.push(planned_amount);
      valueIndex++;
    }
    
    if (actual_amount !== undefined) {
      updateFields.push(`actual_amount = $${valueIndex}`);
      values.push(actual_amount);
      valueIndex++;
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No amount provided to update' });
    }
    
    values.push(budgetItemId, month);
    
    const updateQuery = `
      UPDATE budget_amounts 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE budget_item_id = $${valueIndex} AND month = $${valueIndex + 1}
      RETURNING planned_amount, actual_amount
    `;
    
    const updateResult = await pool.query(updateQuery, values);
    
    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Budget amount record not found' });
    }
    
    const updated = updateResult.rows[0];
    res.json({
      planned: parseFloat(updated.planned_amount),
      actual: parseFloat(updated.actual_amount)
    });
    
  } catch (error) {
    console.error('Error updating budget amount:', error);
    res.status(500).json({ error: 'Failed to update budget amount' });
  }
});

// POST /api/budget/items - Create new budget item
router.post('/items', async (req, res) => {
  try {
    const { error, value } = createItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    const { category, item_name } = value;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert budget item
      const itemQuery = `
        INSERT INTO budget_items (user_id, category, item_name)
        VALUES (1, $1, $2)
        RETURNING id
      `;
      const itemResult = await client.query(itemQuery, [category, item_name]);
      const budgetItemId = itemResult.rows[0].id;
      
      // Insert default amounts for all months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const amountQuery = `
        INSERT INTO budget_amounts (budget_item_id, month, planned_amount, actual_amount)
        VALUES ($1, $2, 0.00, 0.00)
      `;
      
      for (const month of months) {
        await client.query(amountQuery, [budgetItemId, month]);
      }
      
      await client.query('COMMIT');
      
      res.status(201).json({ 
        id: budgetItemId,
        category, 
        item_name,
        message: 'Budget item created successfully' 
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error creating budget item:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(409).json({ error: 'Budget item already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create budget item' });
    }
  }
});

// DELETE /api/budget/items/:category/:itemName - Delete budget item
router.delete('/items/:category/:itemName', async (req, res) => {
  try {
    const { category, itemName } = req.params;
    
    const deleteQuery = `
      DELETE FROM budget_items 
      WHERE user_id = 1 AND category = $1 AND item_name = $2
      RETURNING id
    `;
    
    const result = await pool.query(deleteQuery, [category, itemName]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Budget item not found' });
    }
    
    res.json({ message: 'Budget item deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting budget item:', error);
    res.status(500).json({ error: 'Failed to delete budget item' });
  }
});

// GET /api/budget/summary - Get budget summary statistics
router.get('/summary', async (req, res) => {
  try {
    const query = `
      SELECT 
        bi.category,
        SUM(ba.planned_amount) as total_planned,
        SUM(ba.actual_amount) as total_actual,
        SUM(ba.actual_amount - ba.planned_amount) as variance
      FROM budget_items bi
      JOIN budget_amounts ba ON bi.id = ba.budget_item_id
      WHERE bi.user_id = 1
      GROUP BY bi.category
    `;
    
    const result = await pool.query(query);
    
    const summary = {
      income: { planned: 0, actual: 0, variance: 0 },
      expenses: { planned: 0, actual: 0, variance: 0 },
      net: { planned: 0, actual: 0, variance: 0 }
    };
    
    result.rows.forEach(row => {
      summary[row.category] = {
        planned: parseFloat(row.total_planned),
        actual: parseFloat(row.total_actual),
        variance: parseFloat(row.variance)
      };
    });
    
    // Calculate net income
    summary.net = {
      planned: summary.income.planned - summary.expenses.planned,
      actual: summary.income.actual - summary.expenses.actual,
      variance: summary.income.variance - summary.expenses.variance
    };
    
    res.json(summary);
    
  } catch (error) {
    console.error('Error fetching budget summary:', error);
    res.status(500).json({ error: 'Failed to fetch budget summary' });
  }
});

module.exports = router;