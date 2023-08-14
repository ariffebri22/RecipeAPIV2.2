// const { DataTypes } = require("sequelize");
const Pool = require("../config/db");

const getRecipeAll = async () => {
    console.log("model getRecipe");
    return new Promise((resolve, reject) =>
        Pool.query(
            `SELECT re.id, re.title, re.ingredients, re.photo, cat.name AS category, us.username AS creator, us.photo AS creator_photo, re.created_at
            FROM recipe re
            JOIN category cat ON re.category_id = cat.id
            JOIN users us ON re.users_id = us.id
            ORDER BY re.id DESC;`,
            (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            }
        )
    );
};

const getRecipe = async (data) => {
    const { search, searchBy, sort, offset, limit } = data;
    console.log("model getRecipe", search, searchBy, sort, offset, limit);
    return new Promise((resolve, reject) =>
        Pool.query(
            `SELECT re.id, re.title, re.ingredients, re.photo, cat.name AS category, us.username AS creator, re.created_at
            FROM recipe re
            JOIN category cat ON re.category_id = cat.id
            JOIN users us ON re.users_id = us.id
            WHERE ${searchBy} ILIKE '%${search}%' ORDER BY re.id ${sort} OFFSET ${offset} LIMIT ${limit} `,
            (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            }
        )
    );
};

const getRecipeCount = async (data) => {
    const { search, searchBy, sort, offset, limit } = data;
    console.log("model getRecipe", search, searchBy, sort, offset, limit);
    return new Promise((resolve, reject) =>
        Pool.query(`SELECT COUNT(*) FROM recipe re JOIN category cat ON re.category_id = cat.id JOIN users us ON re.users_id = us.id WHERE ${searchBy} ILIKE '%${search}%'`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const postRecipe = async (data) => {
    const { title, ingredients, category_id, photo, users_id, public_id } = data;
    console.log(data);
    console.log("model postRecipe");
    return new Promise((resolve, reject) =>
        Pool.query(`INSERT INTO recipe(title,ingredients,category_id,photo,users_id,public_id) VALUES('${title}','${ingredients}','${category_id}','${photo}', '${users_id}', '${public_id}')`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const putRecipe = async (data, id) => {
    const { title, ingredients, category_id, photo, public_id } = data;
    console.log("model putRecipe");
    return new Promise((resolve, reject) =>
        Pool.query(`UPDATE recipe SET title='${title}', ingredients='${ingredients}', category_id = '${category_id}', photo='${photo}', public_id='${public_id}' WHERE id=${id}`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const getRecipeById = async (id) => {
    console.log("model recipe by id ->", id);
    return new Promise((resolve, reject) =>
        Pool.query(
            `SELECT re.id, re.title, re.ingredients, re.photo, re.category_id, cat.name AS category, us.username AS creator, us.photo AS creator_photo, re.created_at
            FROM recipe re
            JOIN category cat ON re.category_id = cat.id
            JOIN users us ON re.users_id = us.id
            WHERE re.id=${id}
            ORDER BY re.id DESC;`,
            (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            }
        )
    );
};

const getRecipeByUsers = async (id) => {
    console.log("model recipe by users_id ->", id);
    return new Promise((resolve, reject) =>
        Pool.query(`SELECT * FROM recipe WHERE users_id=${id}`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const deleteById = async (id) => {
    console.log("delete recipe by id ->", id);
    return new Promise((resolve, reject) =>
        Pool.query(`DELETE FROM recipe WHERE id=${id}`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

module.exports = {
    getRecipe,
    getRecipeById,
    getRecipeByUsers,
    deleteById,
    postRecipe,
    putRecipe,
    getRecipeAll,
    getRecipeCount,
};
