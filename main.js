const { Client } = require("pg")

const con = new Client({
    user: "postgres",
    host: "localhost",
    port: 5432,
    database: "demo",
    password: "pghskp02"
})

con.connect((error) => {
    if (error) {
        console.log("Error connecting to database", error)
    } else {
        console.log("Connected to database")
    }
})

// const query =
//     "SELECT * FROM users WHERE address = $1"
// // "SELECT * FROM users WHERE id = $1 AND name = $2"
// const values =
//     ["null"]
// // [1, "Heisarki"]

// con.query(query, values, (error, result) => {
//     if (error) {
//         console.log("Error executing query", error)
//     } else {
//         console.log("Query results:", result.rows)
//     }
//     con.end((error) => {
//         if (error) {
//             console.log("Error closing database connection", error)
//         }
//         console.log("Database connection closed")
//     })
// })

const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000
app.use(express.json())
app.use(cors())
app.listen(port, (error) => {
    if (error) {
        console.log("Error starting server", error)
    } else
        console.log(`Server is running on port ${port}`)
})

// Custom error class
class ValidationError extends Error {
    constructor(message, status = 400) {
        super(message)
        this.status = status
        this.name = "ValidationError"
    }
}

// Helper function to promisify con.query
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (error, result) => {
            if (error) reject(error);
            else resolve(result.rows);
        });
    });
};

app.get("/users", async (req, res) => {
    try {
        const data = await query("SELECT * FROM users")
        // console.log("Query results:", data)
        res.send({
            data: data,
            message: "User data retrieved successfully",
        })
    }
    catch (error) {
        // console.log("Error executing query", error)
        res.send(error)
    }
})

app.post("/users", async (req, res, next) => {
    const {id, name, address } = req.body
    try {
        // throw new ValidationError("Tst", 200)
        const result = await query("INSERT INTO users (id,name, address) VALUES ($1, $2, $3) RETURNING *", [id, name, address])
        res.send({
            data: result[0],
            message: "User created successfully",
        })
    } catch (error) {
        next(error)
    }
})

app.patch("/users/:id", async (req, res, next) => {
    const {name, address } = req.body
    // if (!name || !address) {
    //     throw new ValidationError("Name and address are required fields", 400)
    // }
    const { id } = req.params
    try {
        const result = await query("UPDATE users SET name = $1, address = $2 WHERE id = $3 RETURNING *", [name, address, id])
        res.send({
            data: result[0],
            message: "User updated successfully",
        })
    } catch (error) {
        next(error)
    }
})

app.delete("/users/:id", async (req, res, next) => {
    const { id } = req.params
    try {
        const result = await query("DELETE FROM users WHERE id = $1 RETURNING *", [id])
        res.send({
            data: result[0],
            message: "User deleted successfully",
        })
    } catch (error) {
        next(error)
    }
})

// Error handling middleware (must be last)
app.use((error, req, res, next) => {
    const status = error.status || 500
    res.status(status).json({
        message: error.message,
        status: status
    })
})