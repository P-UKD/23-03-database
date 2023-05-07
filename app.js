import express from 'express';
import pg from 'pg';
const { Pool } = pg;

const app = express();
const port = 3000;

// Database connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'users',
    password: '0808',
    port: 5432
});

// Route handlers
const getUsers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM students ORDER BY id ASC');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

const createTable = async (req, res) => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        age INTEGER
      )
    `);
        console.log('Table successfully created');
        res.status(200).send('Table successfully created');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

const addStudent = async (req, res) => {
    const { first_name, last_name, age } = { first_name: 'Andriy', last_name: 'Melnik', age: 16 };
    try {
        const { rows } = await pool.query(
            'INSERT INTO students (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *',
            [first_name, last_name, age]
        );
        console.log(`User added with ID: ${rows[0].id}`);
        res.status(201).send(`User added with ID: ${rows[0].id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

const getAllStudents = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM students');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

const getStudentsByAge = async (req, res) => {
    const sort = req.query.sort;
    try {
        const { rows } = await pool.query(`SELECT * FROM students ORDER BY age ${sort}`);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

// Routes
app.get('/', getUsers);
app.get('/createTable', createTable);
app.get('/addStudent', addStudent);
app.get('/getAllStudents', getAllStudents);
app.get('/getStudentsByAge', getStudentsByAge);

// Server start
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});