const { client } = require("../config/db");

const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        client.query(sql, params, (error, result) => {
            if (error) reject(error);
            else resolve(result.rows);
        });
    });
};

module.exports = { query };
