const db = require('../config/db');

const customerWithSearch = async (req, res) => {
    try {
        const { first_name, last_name, city, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM customers WHERE 1=1';
        let params = [];

        if (first_name) {
            query += ' AND first_name LIKE ?';
            params.push(`%${first_name}%`);
        }
        if (last_name) {
            query += ' AND last_name LIKE ?';
            params.push(`%${last_name}%`);
        }
        if (city) {
            query += ' AND city LIKE ?';
            params.push(`%${city}%`);
        }

        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit, 10), parseInt(offset, 10));

        const [results] = await db.query(query, params);
        res.json(results);

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

const getByIdCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Id is required"
            });
        }

        const [results] = await db.query('SELECT * FROM customers WHERE id = ?', [id]);

        if (results.length === 0) {
            return res.status(404).json({
                error: 'Customer not found'
            });
        }
        res.json(results[0]);

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

const UniqueCityAndCustomerCount = async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT city, COUNT(*) AS customer_count
            FROM customers
            GROUP BY city
            ORDER BY city;
        `);

        if (result.length === 0) {
            return res.status(404).json({
                error: 'No customers found'
            });
        }

        res.json(result);

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};


const createCustomer = async (req, res) => {
    const { first_name, last_name, city, company } = req.body;

    if (!first_name || !last_name || !city || !company) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [existingRecords] = await db.query(
            'SELECT * FROM customers WHERE city = ? AND company = ?',
            [city, company]
        );

        if (existingRecords.length === 0) {
            return res.status(400).json({ error: 'city or company does not exist in records' });
        }

        const [result] = await db.query(
            'INSERT INTO customers (first_name, last_name, city, company) VALUES (?, ?, ?, ?)',
            [first_name, last_name, city, company]
        );

        res.status(201).json({
             message: "Created successfully",
            id: result.insertId, first_name, last_name, city, company,
           
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

module.exports = {
    customerWithSearch,
    getByIdCustomer,
    UniqueCityAndCustomerCount,
    createCustomer
}
