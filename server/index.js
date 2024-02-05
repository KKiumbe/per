// Import required modules
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000; // You can choose any available port
const pool = require("./db"); // Assuming you have a db.js file exporting a PostgreSQL pool

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Define a route to get all todo items
app.get("/todo", async (req, res) => {
    try {
        const allTodo = await pool.query('SELECT * FROM todo');
        res.json(allTodo.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a route to get a specific todo item by ID
app.get("/todo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query('SELECT * FROM todo WHERE id = $1', [id]);
        res.json(todo.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a route to create a new todo item
app.post("/todo", async (req, res) => {
    try {
        const { description } = req.body;
        pool.query('INSERT INTO todo (description) VALUES ($1) RETURNING *', [description], (error, result) => {
            if (error) {
                console.error('Error executing query', error);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            const addedData = result.rows[0];
            res.status(201).json(addedData);
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//put request 

app.put("/todo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body; // Use req.body to get data from the request body

        const update = await pool.query("UPDATE todo SET description = $1 WHERE id = $2", [description, id]);
        res.json(update.rows[0]); // Assuming you want to send back the updated data
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a route to test database connection
app.get('/test-database', (req, res) => {
    pool.query('SELECT NOW() as current_time', (error, result) => {
        if (error) {
            console.error('Error executing query', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        const currentTime = result.rows[0].current_time;
        res.status(200).json({ message: 'Database connected successfully', currentTime });
    });
});
//delete

app.delete("/todo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletetodo = await pool.query('DELETE  FROM todo WHERE id = $1', [id]);
        res.json("todo was deleted");
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
