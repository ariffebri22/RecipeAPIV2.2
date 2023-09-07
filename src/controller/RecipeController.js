const xss = require("xss");
const { getRecipe, getRecipeById, getRecipeByUsers, deleteById, postRecipe, putRecipe, getRecipeAll, getRecipeCount } = require("../model/RecipeModel");
const cloudinary = require("../config/cloud");

const RecipeController = {
    getDataDetail: async (req, res, next) => {
        try {
            const { search, searchBy, sort, limit } = req.query;

            const cleanedSearch = xss(search);
            const cleanedSearchBy = xss(searchBy);
            const cleanedSort = xss(sort);
            const cleanedLimit = xss(limit);

            let page = req.query.page || 1;
            let limiter = cleanedLimit || 5;

            const data = {
                search: cleanedSearch || "",
                searchBy: cleanedSearchBy || "title",
                sort: cleanedSort || "asc",
                offset: (page - 1) * limiter,
                limit: limiter,
            };

            const dataRecipe = await getRecipe(data);
            const dataRecipeCount = await getRecipeCount(data);

            const pagination = {
                totalPage: Math.ceil(dataRecipeCount.rows[0].count / limiter),
                totalData: parseInt(dataRecipeCount.rows[0].count),
                pageNow: parseInt(page),
            };

            console.log("dataRecipe");
            console.log(dataRecipe);
            console.log("total data");
            console.log(dataRecipeCount.rows[0].count);

            if (dataRecipe) {
                res.status(200).json({ status: 200, message: "get data recipe success", data: dataRecipe.rows, pagination });
            } else {
                res.status(404).json({ status: 200, message: "Recipe data not found", data: [] });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    getData: async (req, res, next) => {
        try {
            const dataRecipe = await getRecipeAll();
            console.log("dataRecipe");
            console.log(dataRecipe);
            res.status(200).json({ status: 200, message: "get data recipe success", data: dataRecipe.rows });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    getDataById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(400).json({ status: 400, message: "Invalid id" });
            }

            const dataRecipeId = await getRecipeById(parseInt(id));

            console.log("dataRecipe");
            console.log(dataRecipeId);

            if (!dataRecipeId.rows[0]) {
                return res.status(404).json({ status: 200, message: "Recipe data not found", data: [] });
            }

            res.status(200).json({ status: 200, message: "get data recipe success", data: dataRecipeId.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },

    getDataByUsers: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(400).json({ status: 400, message: "Invalid users_id" });
            }

            const dataRecipeUsers = await getRecipeByUsers(parseInt(id));

            console.log("dataRecipe");
            console.log(dataRecipeUsers);

            if (!dataRecipeUsers.rows[0]) {
                return res.status(404).json({ status: 200, message: "Recipe data not found", data: [] });
            }

            res.status(200).json({ status: 200, message: "get data recipe success", data: dataRecipeUsers.rows });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },

    deleteDataById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(400).json({ status: 400, message: "Invalid id" });
            }

            const dataRecipeId = await getRecipeById(parseInt(id));

            const users_id = req.payload.users_Id;
            const type = req.payload.type;

            console.log("id data");
            console.log(users_id);
            console.log(dataRecipeId.rows[0].users_id);
            if (users_id !== dataRecipeId.rows[0].users_id && type !== "admin") {
                return res.status(403).json({ status: 403, message: "You are not authorized to access this, except admin." });
            }

            await cloudinary.uploader.destroy(dataRecipeId.rows[0].public_id);
            const result = await deleteById(parseInt(id));
            console.log(result);
            if (result.rowCount === 0) {
                throw new Error("Delete data failed");
            }

            res.status(200).json({ status: 200, message: "delete data recipe success", data: result.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: err.message });
        }
    },
    postData: async (req, res, next) => {
        try {
            const { title, ingredients, category_id } = req.body;
            const photo = req.file;

            console.log("post data");
            console.log(title, ingredients, category_id);

            if (!req.isFileValid) {
                return res.status(404).json({ message: req.isFileValidMessage });
            }

            if (!title || !ingredients || !category_id) {
                return res.status(400).json({ status: 400, message: "Input title, ingredients, and category_id are required" });
            }

            const resultt = await cloudinary.uploader.upload(photo.path, {
                use_filename: true,
                folder: "RecipeAPIV2",
            });

            let data = {
                title: xss(title),
                ingredients: xss(ingredients),
                category_id: parseInt(category_id),
                users_id: req.payload.users_Id,
                photo: resultt.secure_url,
                public_id: resultt.public_id,
            };

            const result = await postRecipe(data);
            console.log(result);

            delete data.id;

            res.status(200).json({ status: 200, message: "Data resep berhasil ditambahkan", data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Terjadi kesalahan pada server" });
        }
    },

    putData: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, ingredients, category_id } = req.body;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(400).json({ status: 400, message: "Invalid id" });
            }

            if (!req.isFileValid) {
                return res.status(404).json({ message: req.isFileValidMessage });
            }

            const dataRecipeId = await getRecipeById(parseInt(id));

            const users_id = req.payload.users_Id;
            const type = req.payload.type;

            console.log("id data");
            console.log(users_id);
            console.log(dataRecipeId.rows[0].users_id);
            if (users_id !== dataRecipeId.rows[0].users_id && type !== "admin") {
                return res.status(403).json({ status: 403, message: "You are not authorized to access this, except admin." });
            }

            console.log("put data");
            console.log(dataRecipeId.rows[0]);

            const data = {
                title: xss(title) || dataRecipeId.rows[0].title,
                ingredients: xss(ingredients) || dataRecipeId.rows[0].ingredients,
                category_id: parseInt(category_id) || dataRecipeId.rows[0].category_id,
                photo: dataRecipeId.rows[0].photo,
                public_id: dataRecipeId.rows[0].public_id,
            };

            if (req.file) {
                const resultt = await cloudinary.uploader.upload(req.file.path, {
                    use_filename: true,
                    folder: "RecipeAPIV2",
                });

                // Hapus gambar lama dari Cloudinary jika ada
                if (dataRecipeId.rows[0].public_id) {
                    await cloudinary.uploader.destroy(dataRecipeId.rows[0].public_id);
                }

                data.photo = resultt.secure_url;
                data.public_id = resultt.public_id;
            }

            const result = await putRecipe(data, id);
            console.log(result);

            delete data.id;

            res.status(200).json({ status: 200, message: "update data recipe success", data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
};

module.exports = RecipeController;
