const Pool = require("../config/db");

const getUsersAll = async () => {
    console.log("model getUsersAll");
    return new Promise((resolve, reject) => {
        Pool.query(`SELECT * FROM users ORDER BY id`, (err, result) => {
            if (!err) {
                resolve(result.rows);
            } else {
                reject(err);
            }
        });
    });
};

const getUsers = async (data) => {
    const { search, searchBy, sort, offset, limit } = data;
    console.log("model getUsers", search, searchBy, sort, offset, limit);

    try {
        const queryString = `SELECT * FROM users WHERE ${searchBy} ILIKE $1 ORDER BY id ${sort} OFFSET $2 LIMIT $3`;
        const values = [`%${search}%`, offset, limit];

        const result = await Pool.query(queryString, values);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const getUsersCount = async (data) => {
    const { search, searchBy } = data;
    console.log("model getUsersCount", search, searchBy);

    try {
        const queryString = `SELECT COUNT(*) FROM users WHERE ${searchBy} ILIKE $1`;
        const values = [`%${search}%`];

        const result = await Pool.query(queryString, values);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const postUsers = async (data) => {
    const { type, username, password, email, photo, public_id } = data;
    console.log("model postUsers");
    try {
        const queryString = `INSERT INTO users(type, username, password, email, photo, public_id) 
        VALUES($1, $2, $3, $4, $5, $6)`;
        const values = [type, username, password, email, photo, public_id];

        const result = await Pool.query(queryString, values);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const putUsers = async (data) => {
    const { id, username, password, email, photo, public_id } = data;
    console.log("model putUsers");
    try {
        const queryString = "UPDATE users SET username=$1, password=$2, email=$3, photo=$5, public_id=$6 WHERE id=$4";
        const values = [username, password, email, id, photo, public_id];

        const result = await Pool.query(queryString, values);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const getUsersById = async (id) => {
    console.log("model getUsersById ->", id);
    try {
        const queryString = "SELECT * FROM users WHERE id=$1";
        const values = [id];

        const result = await Pool.query(queryString, values);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const deleteUsersById = async (id) => {
    console.log("delete users by id ->", id);
    try {
        const queryString = "DELETE FROM users WHERE id=$1";
        const values = [id];

        const result = await Pool.query(queryString, values);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const getLogin = async (data) => {
    const { email } = data;
    console.log("model getLogin");
    try {
        const queryString = "SELECT * FROM users WHERE email=$1";
        const values = [email];

        const result = await Pool.query(queryString, values);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const checkUsernameAvailability = async (username) => {
    try {
        const queryString = "SELECT * FROM users WHERE username = $1";
        const values = [username];
        const result = await Pool.query(queryString, values);
        return result.rows.length === 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const checkEmailAvailability = async (email) => {
    try {
        const queryString = "SELECT * FROM users WHERE email = $1";
        const values = [email];
        const result = await Pool.query(queryString, values);
        return result.rows.length === 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = {
    getUsers,
    getUsersAll,
    getUsersCount,
    getUsersById,
    deleteUsersById,
    postUsers,
    putUsers,
    getLogin,
    checkUsernameAvailability,
    checkEmailAvailability,
};
