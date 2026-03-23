const { query } = require("../utils/queryHelper");
const { ValidationError, NotFoundError } = require("../utils/errors");
const { v4: uuidv4 } = require("uuid");
const { generateToken, verifyToken } = require("../auth/authHelper");
const express = require("express");
const app = express();

const createUser = async (req, res, next) => {
    const { name, address, email, age, password } = req.body;
    if (!name || !email || !password) {
        return next(new ValidationError("name, email, and password are required fields"));
    }
    const id = uuidv4();
    try {
        const result = await query(
            "INSERT INTO users (id, name, address, email, age, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, address, email, age",
            [id, name, address, email, age, password]
        );
        res.json({
            success: true,
            data: result[0],
            message: "User created successfully",
            accessToken: generateToken({ id: result[0].id, email: result[0].email }), // Generate JWT token
        });
    } catch (error) {
        if (error.code === '23505') {  // Postgres unique violation
            return next(new ValidationError("Email already exists"));
        }
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const data = await query("SELECT id, name, address, email, age FROM users");
        res.json({
            success: true,
            data,
            message: "Users retrieved successfully",
        });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    const { id } = req.params;
    try {
        console.log("HEADER", req.headers.authorization.split(" ")[1]);
        const data = await query("SELECT id, name, address, email, age FROM users WHERE id = $1", [id]);
        if (!data.length) throw new NotFoundError(`User with id ${id} not found`);
        res.json({
            success: true,
            data: data[0],
            message: "User retrieved successfully",
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { name, address } = req.body;
    if (!name || !address) {
        return next(new ValidationError("name and address are required fields"));
    }
    try {
        const result = await query(
            "UPDATE users SET name = $1, address = $2 WHERE id = $3 RETURNING id, name, address, email, age",
            [name, address, id]
        );
        if (!result.length) throw new NotFoundError(`User with id ${id} not found`);
        res.json({
            success: true,
            data: result[0],
            message: "User updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await query(
            "DELETE FROM users WHERE id = $1 RETURNING id, name, address, email, age",
            [id]
        );
        if (!result.length) throw new NotFoundError(`User with id ${id} not found`);
        res.json({
            success: true,
            data: result[0],
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ValidationError("email and password are required fields"));
    }
    try {
        const result = await query(
            "SELECT id, name, address, email, age, password FROM users WHERE email = $1",
            [email]
        );
        if (!result.length) {
            return next(new ValidationError("Invalid email or password"));
        }
        const user = result[0];

        if (user.password !== password) {
            return next(new ValidationError("Invalid email or password"));
        }

        const accessToken = generateToken({ id: user.id, email: user.email });

        res.json({
            success: true,
            message: "Login successful",
            accessToken,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                age: user.age,
                address: user.address,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, loginUser };
