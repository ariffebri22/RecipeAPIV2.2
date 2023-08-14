const Pool = require("../config/db");
const { getUsers, getUsersAll, getUsersCount, getUsersById, deleteUsersById, postUsers, putUsers, getLogin, checkUsernameAvailability, checkEmailAvailability } = require("../model/UsersModel");
const { hash, verify } = require("../helper/passwordHash");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const argon2 = require("argon2");
const nodemailer = require("nodemailer");
const cloudinary = require("../config/cloud");
const xss = require("xss");

const secretKey = process.env.SECRET_KEY;

const transporter = nodemailer.createTransport({
    service: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

const UsersController = {
    getDataDetail: async (req, res, next) => {
        try {
            const type = req.payload.type;

            if (type !== "admin") {
                return res.status(403).json({ status: 403, message: "You are not authorized to access this" });
            }

            const { search, searchBy, sort, limit } = req.query;

            let page = req.query.page || 1;
            let limiter = limit || 5;

            const data = {
                search: search || "",
                searchBy: searchBy || "username",
                sort: sort || "asc",
                offset: (page - 1) * limiter,
                limit: limit || 5,
            };

            const dataUsers = await getUsers(data);
            const dataUsersCount = await getUsersCount(data);

            const pagination = {
                totalPage: Math.ceil(dataUsersCount.rows[0].count / limiter),
                totalData: parseInt(dataUsersCount.rows[0].count),
                pageNow: parseInt(page),
            };

            console.log("dataUsers");
            console.log(dataUsers);
            console.log("total data");
            console.log(dataUsersCount.rows[0].count);

            res.status(200).json({ status: 200, message: "get data users success", data: dataUsers.rows, pagination });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    getData: async (req, res, next) => {
        try {
            const type = req.payload.type;

            if (type !== "admin") {
                return res.status(403).json({ status: 403, message: "You are not authorized to access this" });
            }
            const dataUsers = await getUsersAll();
            console.log("dataUsers");
            console.log(dataUsers);
            res.status(200).json({ status: 200, message: "get data users success", data: dataUsers });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    getDataById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(404).json({ message: "id wrong" });
            }

            const type = req.payload.type;

            if (type !== "admin") {
                return res.status(403).json({ status: 403, message: "You are not authorized to access this" });
            }

            const dataUsersId = await getUsersById(parseInt(id));

            console.log("dataUsers");
            console.log(dataUsersId);

            if (!dataUsersId.rows[0]) {
                return res.status(200).json({ status: 200, message: "get data users not found", data: [] });
            }

            return res.status(200).json({ status: 200, message: "get data users success", data: dataUsersId.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
    deleteDataById: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(404).json({ message: "id wrong" });
            }

            const dataUsersId = await getUsersById(parseInt(id));

            const users_id = req.payload.users_Id;
            const type = req.payload.type;

            console.log("id data");
            console.log(users_id);
            console.log(dataUsersId.rows[0].users_id);
            if (users_id !== dataUsersId.rows[0].users_id && type !== "admin") {
                return res.status(403).json({ status: 403, message: "Recipe does not belong to you" });
            }

            await cloudinary.uploader.destroy(dataUsersId.rows[0].public_id);
            const result = await deleteUsersById(parseInt(id));
            console.log(result);

            if (result.rowCount == 0) {
                throw new Error("delete data failed");
            }

            return res.status(200).json({ status: 200, message: "delete data users success", data: result.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: err.message });
        }
    },

    postData: async (req, res, next) => {
        try {
            const { type, username, password, email } = req.body;
            const photo = req.file;

            console.log("post data");
            console.log(type, username, password, email);

            if (!req.isFileValid) {
                return res.status(404).json({ message: req.isFileValidMessage });
            }

            if (!type || !username || !password || !email) {
                return res.status(400).json({ status: 400, message: "input type, username, password, email required" });
            }

            const isUsernameAvailable = await checkUsernameAvailability(username);
            if (!isUsernameAvailable) {
                return res.status(400).json({ message: "Username already exists, login or enter another username" });
            }

            const isEmailAvailable = await checkEmailAvailability(email);
            if (!isEmailAvailable) {
                return res.status(400).json({ message: "Email already exists, login or enter another email" });
            }

            const hashedPassword = await hash(password);

            const resultt = await cloudinary.uploader.upload(photo.path, {
                use_filename: true,
                folder: "RecipeAPIV2",
            });

            console.log("data");
            const data = {
                type: xss(type),
                username: xss(username),
                password: xss(hashedPassword),
                email: xss(email),
                photo: resultt.secure_url,
                public_id: resultt.public_id,
            };

            console.log(data);
            const result = await postUsers(data);
            console.log(result);
            // const token = jwt.sign({ username: username }, secretKey, { expiresIn: "1m" });

            res.status(200).json({ status: 200, say: `Hello ${username}!`, message: "Registration success", data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },

    putData: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { username, password, email } = req.body;

            if (!id || id <= 0 || isNaN(id)) {
                return res.status(404).json({ message: "id wrong" });
            }

            if (!req.isFileValid) {
                return res.status(404).json({ message: req.isFileValidMessage });
            }

            const dataUsersId = await getUsersById(parseInt(id));

            const users_id = req.payload.users_Id;
            const type = req.payload.type;

            console.log("id data");
            console.log(users_id);
            console.log(dataUsersId.rows[0].users_id);
            if (users_id !== dataUsersId.rows[0].users_id && type !== "admin") {
                return res.status(403).json({ status: 403, message: "You can't access data that doesn't belong to you, except admin." });
            }

            console.log("put data");
            console.log(dataUsersId.rows[0]);

            const data = {
                username: xss(username) || dataUsersId.rows[0].username,
                password: xss(password) || dataUsersId.rows[0].password,
                email: xss(email) || dataUsersId.rows[0].email,
                photo: dataUsersId.rows[0].photo,
                public_id: dataUsersId.rows[0].public_id,
                id,
            };

            if (req.file) {
                const resultt = await cloudinary.uploader.upload(req.file.path, {
                    use_filename: true,
                    folder: "RecipeAPIV2",
                });

                if (dataUsersId.rows[0].public_id) {
                    await cloudinary.uploader.destroy(dataUsersId.rows[0].public_id);
                }

                data.photo = resultt.secure_url;
                data.public_id = resultt.public_id;
            }

            if (password) {
                data.password = await hash(password);
            }

            const result = await putUsers(data);
            console.log(result);

            delete data.id;

            return res.status(200).json({ status: 200, message: "update data users success", data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ status: 400, message: "input email and password required" });
            }

            const dataUsers = await getLogin({ email });

            if (dataUsers && dataUsers.rows.length > 0) {
                const storedPassword = dataUsers.rows[0].password;
                // const newPassword = storedPassword.join("");

                if (typeof storedPassword === "string" && typeof password === "string") {
                    const isPasswordValid = await verify(storedPassword, password);
                    if (isPasswordValid) {
                        const token = jwt.sign({ email: email, users_Id: dataUsers.rows[0].id, type: dataUsers.rows[0].type, username: dataUsers.rows[0].username, photo: dataUsers.rows[0].photo }, secretKey, { expiresIn: "24h" });

                        const mailOptions = {
                            from: process.env.EMAIL,
                            to: dataUsers.rows[0].email,
                            subject: "Verify your Account",
                            text: `Halo ${dataUsers.rows[0].username}, please verify your account with this token : ${token}`,
                            html: "<b>Halo,</b><br><p>please verify your account.</p>",
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log("Gagal mengirim email: ", error);
                            } else {
                                console.log("Email terkirim: ", info.response);
                            }
                        });

                        return res.status(200).json({ status: 200, message: "Login Successfully", token, username: `${dataUsers.rows[0].username}`, photo: `${dataUsers.rows[0].photo}`, email: `${dataUsers.rows[0].email}` });
                    } else {
                        return res.status(401).json({ status: 401, message: "Wrong password" });
                    }
                } else {
                    // console.log(storedPassword);
                    return res.status(500).json({ status: 500, message: "Internal server error: Invalid password format" });
                }
            } else {
                return res.status(404).json({ status: 404, message: "Email not found, please register first" });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
};

module.exports = UsersController;
