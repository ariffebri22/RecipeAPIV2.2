const { getCategory, getCategoryAll, getCategoryCount, getCategoryById, deleteCategoryById, postCategory, putCategory } = require("../model/CategoryModel");

const CategoryController = {
    getDataDetail: async (req, res, next) => {
        try {
            const { search, searchBy, sort, limit } = req.query;

            let page = req.query.page || 1;
            let limiter = limit || 5;

            data = {
                search: search || "",
                searchBy: searchBy || "name",
                sort: sort || "asc",
                offset: (page - 1) * limiter,
                limit: limit || 5,
            };
            let dataCategory = await getCategory(data);
            let dataCategoryCount = await getCategoryCount(data);

            let pagination = {
                totalPage: Math.ceil(dataCategoryCount.rows[0].count / limiter),
                totalData: parseInt(dataCategoryCount.rows[0].count),
                pageNow: parseInt(page),
            };

            console.log("dataCategory");
            console.log(dataCategory);
            console.log("total data");
            console.log(dataCategoryCount.rows[0].count);
            if (dataCategory) {
                res.status(200).json({ status: 200, message: "get data category success", data: dataCategory.rows, pagination });
            }
        } catch (err) {
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    getData: async (req, res, next) => {
        try {
            let dataCategory = await getCategoryAll();
            console.log("dataCategory");
            console.log(dataCategory);
            if (dataCategory) {
                res.status(200).json({ status: 200, message: "get data category success", data: dataCategory.rows });
            }
        } catch (err) {
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    getDataById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(404).json({ message: "id wrong" });
            }

            let dataCategoryId = await getCategoryById(parseInt(id));

            console.log("dataCategory");
            console.log(dataCategoryId);

            if (!dataCategoryId.rows[0]) {
                return res.status(200).json({ status: 200, message: "get data category not found", data: [] });
            }

            return res.status(200).json({ status: 200, message: "get data category success", data: dataCategoryId.rows[0] });
        } catch (err) {
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    deleteDataById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(404).json({ message: "id wrong" });
            }

            const type = req.payload.type;

            if (type !== "admin") {
                return res.status(403).json({ status: 403, message: "You are not authorized to access this" });
            }

            let result = await deleteCategoryById(parseInt(id));
            console.log(result);
            if (result.rowCount == 0) {
                throw new Error("delete data failed");
            }
            return res.status(200).json({ status: 200, message: "delete data category success", data: result.rows[0] });
        } catch (err) {
            res.status(500).json({ status: 500, message: err.message });
        }
    },
    postData: async (req, res, next) => {
        try {
            const { name, description } = req.body;
            console.log("post data ");
            console.log(name, description);

            if (!name || !description) {
                return res.status(400).json({ status: 400, message: "input name category required" });
            }

            const type = req.payload.type;

            if (type !== "admin") {
                return res.status(403).json({ status: 403, message: "You are not authorized to access this" });
            }

            let data = {
                name: name,
                description: description,
            };

            console.log("data");
            console.log(data);
            let result = postCategory(data);
            console.log(result);

            return res.status(200).json({ status: 200, message: "data category success", data });
        } catch (err) {
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    putData: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(404).json({ message: "id wrong" });
            }

            const type = req.payload.type;

            if (type !== "admin") {
                return res.status(403).json({ status: 403, message: "You are not authorized to access this" });
            }

            let dataCategoryId = await getCategoryById(parseInt(id));

            console.log("put data");
            console.log(dataCategoryId.rows[0]);

            let data = {
                name: name || dataCategoryId.rows[0].name,
                description: description || dataCategoryId.rows[0].description,
                id,
            };

            let result = putCategory(data);
            console.log(result);

            delete data.id;

            return res.status(200).json({ status: 200, message: "update data category success", data });
        } catch (err) {
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
};

module.exports = CategoryController;
