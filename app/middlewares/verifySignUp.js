const db = require('../config/db');

const checkDuplicateUsername = (req, res, next) => {
    // Memeriksa apakah username sudah ada di Firestore
    db.collection('Users').where('username', '==', req.body.username).get()
        .then(snapshot => {
            if (snapshot.empty) {
                next(); // Jika tidak ditemukan, lanjutkan ke middleware berikutnya atau controller
                return;
            }
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

const verifySignUp = {
    checkDuplicateUsername
};

module.exports = verifySignUp;
