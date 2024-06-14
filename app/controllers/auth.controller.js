const storeFirestore = require('../controllers/firestore.controller');
const db = require('../config/db');
const dotenv = require('dotenv');
dotenv.config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

exports.signup = async (req, res) => {
    const { username, password, nama } = req.body;

    const id = crypto.randomBytes(16).toString("hex");
    const createdAt = new Date().toISOString();

    const user = {
        id: id,
        nama: nama,
        username: username,
        password: bcrypt.hashSync(password, 8),
        createdAt: createdAt
    };

    try {
        await storeFirestore.add(user);
        res.status(201).send({ 
            message: "User was registered successfully!",
            data: user 
        });
    } catch (error) {
        res.status(500).send({ message: "Failed to register user.", error: error.message });
    }
}

exports.signin = (req, res) => {
    const { username, password } = req.body;

    db.collection('Users').where('username', '==', username).get()
        .then(snapshot => {
            if (snapshot.empty) {
                return res.status(404).send({ message: "User Not found." });
            }

            snapshot.forEach(doc => {
                const user = doc.data();

                const passwordIsValid = bcrypt.compareSync(
                    password,
                    user.password
                );

                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: "Invalid Password!"
                    });
                }

                const token = jwt.sign({ id: user.id }, process.env.SECRET, {
                    expiresIn: 86400 // 24 hours
                });

                res.status(200).send({
                    message: "User was logged in successfully!",
                    data: {
                        id: user.id,
                        nama: user.nama,
                        username: user.username,
                        createdAt: user.createdAt
                    },
                    accessToken: token
                });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.signout = (req, res) => {
    res.status(200).send({ 
        message: "User was logged out successfully!",
        accessToken: null 
    });
};

exports.addPlaces = async (req, res) => {
    const places = req.body;

    if (!Array.isArray(places)) {
        return res.status(400).send({
            message: "Invalid input, expected an array of places"
        });
    }

    try {
        await storeFirestore.addPlaces(places);
        res.status(201).send({
            message: "All places were added successfully!",
            data: places
        });
    } catch (error) {
        res.status(500).send({
            message: "Failed to add places.",
            error: error.message
        });
    }
}

exports.getAllPlaces = async (req, res) => {
    try {
        const places = await storeFirestore.getAllPlaces();
        res.status(200).send({
            message: "Places were found successfully!",
            total_data: places.length,
            data: places
        });
    } catch (error) {
        res.status(500).send({
            message: "Failed to get places.",
            error: error.message
        });
    }
}

exports.getPlace = async (req, res) => {
    const id = req.params.id;

    try {
        const place = await storeFirestore.getPlace(id);
        res.status(200).send({
            message: "Place was found successfully!",
            data: place
        });
    } catch (error) {
        res.status(404).send({
            message: "Place not found.",
            error: error.message
        });
    }
}

exports.getPlaceByKeyword = async (req, res) => {
    const keyword = req.params.keyword;

    try {
        const places = await storeFirestore.getPlaceByKeyword(keyword);
        res.status(200).send({
            message: "Places were found successfully!",
            total_data: places.length,
            data: places
        });
    } catch (error) {
        res.status(404).send({
            message: "Places not found.",
            error: error.message
        });
    }
}

exports.getPlaceByCategory = async (req, res) => {
    const category = req.params.category;

    try {
        const places = await storeFirestore.getPlaceByCategory(category);
        res.status(200).send({
            message: "Places were found successfully!",
            total_data: places.length,
            data: places
        });
    } catch (error) {
        res.status(404).send({
            message: "Places not found.",
            error: error.message
        });
    }
}

