import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { Pool } from 'pg';
import multer from 'multer';
import url from 'url';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const pool = new Pool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD
});
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});
const uploads = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/products', async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM products");
        res.json(rows);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});
app.post('/products', uploads.single('image'), async (req, res) => {
    const { name, description, price } = req.body;
    const file = req.file;
    const image_url = '/uploads/' + file?.filename;
    try {
        if (!name || !description || !price) {
            return res.status(400).json({ error: 'Введите данные корректно' });
        }
        const { rows } = await pool.query("INSERT INTO products(name, description, price, image_url) VALUES($1, $2, $3, $4) RETURNING *", [name, description, price, image_url]);
        res.json(rows[0]);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});
app.put('/products/:id', uploads.single('image'), async (req, res) => {
    const { name, description, price } = req.body;
    const id = Number(req.params.id);
    const file = req.file;
    const image_url = '/uploads/' + file?.filename;
    try {
        if (!name || !description || !price) {
            return res.status(400).json({ error: 'Введите данные корректно' });
        }
        const { rows } = await pool.query("UPDATE products SET name = $1, description = $2, price = $3, image_url = $4 WHERE id = $5 RETURNING *", [name, description, price, image_url, id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Такого продукта не сущесвтует" });
        }
        res.json(rows[0]);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});
app.delete('/products/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
        const { rows } = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
        if (!rows.length) {
            return res.status(404).json({ error: "Такого продукта не сущесвтует" });
        }
        res.json(rows[0]);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});
app.listen(8080, () => {
    console.log('Сервер запущен');
});
