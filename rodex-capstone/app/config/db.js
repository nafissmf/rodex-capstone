const { Firestore } = require('@google-cloud/firestore');
const dotenv = require('dotenv');
dotenv.config();

const db = new Firestore({
    projectId: 'rodex',
    keyFilename: process.env.FIRESTOREKEY
});

module.exports = db;