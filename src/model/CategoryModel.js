const Pool = require("../config/db");

const getCategoryAll = async () => {
    console.log("model getCategory");
    return new Promise((resolve, reject) =>
        Pool.query(`SELECt * FROM category ORDER BY id`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const getCategory = async (data) => {
    const { search, searchBy, sort, offset, limit } = data;
    console.log("model getCategory", search, searchBy, sort, offset, limit);
    return new Promise((resolve, reject) =>
        Pool.query(`SELECT * FROM category WHERE ${searchBy} ILIKE '%${search}%' ORDER BY id ${sort} OFFSET ${offset} LIMIT ${limit} `, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const getCategoryCount = async (data) => {
    const { search, searchBy, sort, offset, limit } = data;
    console.log("model getCategory", search, searchBy, sort, offset, limit);
    return new Promise((resolve, reject) =>
        Pool.query(`SELECT COUNT(*) FROM category WHERE ${searchBy} ILIKE '%${search}%'`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const postCategory = async (data) => {
    const { name, description } = data;
    console.log(data);
    console.log("model postCategory");
    return new Promise((resolve, reject) =>
        Pool.query(`INSERT INTO category(name, description) VALUES('${name}','${description}')`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const putCategory = async (data) => {
    const { id, name, description } = data;
    console.log("model postCategory");
    return new Promise((resolve, reject) =>
        Pool.query(`UPDATE category SET name='${name}', description='${description}' WHERE id=${id}`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const getCategoryById = async (id) => {
    console.log("model category by id ->", id);
    return new Promise((resolve, reject) =>
        Pool.query(`SELECT * FROM category WHERE id=${id}`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

const deleteCategoryById = async (id) => {
    console.log("delete category by id ->", id);
    return new Promise((resolve, reject) =>
        Pool.query(`DELETE FROM category WHERE id=${id}`, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    );
};

module.exports = { getCategory, getCategoryAll, getCategoryCount, getCategoryById, deleteCategoryById, postCategory, putCategory };
