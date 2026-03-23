const { query } = require("../utils/queryHelper");
const { ValidationError, NotFoundError } = require("../utils/errors");

const getUsers = async (req, res, next) => {
    try {
        const data = await query("SELECT * FROM users");
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
        const data = await query("SELECT * FROM users WHERE id = $1", [id]);
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

const createUser = async (req, res, next) => {
    const { id, name, address } = req.body;
    if (!id || !name || !address) {
        return next(new ValidationError("id, name, and address are required fields"));
    }
    try {
        const result = await query(
            "INSERT INTO users (id, name, address) VALUES ($1, $2, $3) RETURNING *",
            [id, name, address]
        );
        res.status(201).json({
            success: true,
            data: result[0],
            message: "User created successfully",
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
            "UPDATE users SET name = $1, address = $2 WHERE id = $3 RETURNING *",
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
            "DELETE FROM users WHERE id = $1 RETURNING *",
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

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
