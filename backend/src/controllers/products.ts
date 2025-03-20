import { Request, Response } from 'express';
import pool from '../config/db';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, sort, page = 1, limit = 10 } = req.query;
        let query = 'SELECT * FROM products';
        const params: any[] = [];
        if (category) {
            params.push(category);
            query += ` WHERE category = $${params.length}`;
        }
        if (sort) {
            query += ` ORDER BY price ${sort === 'asc' ? 'ASC' : 'DESC'}`;
        }
        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 10;
        const offset = (pageNumber - 1) * limitNumber;

        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limitNumber, offset);

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT DISTINCT category FROM products');
        res.json(result.rows.map(row => row.category));
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};