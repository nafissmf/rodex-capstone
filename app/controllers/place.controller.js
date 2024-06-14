const db = require('../config/db');
const dotenv = require('dotenv');
dotenv.config();

const add = async (data) => {
    try {
        const docRef = db.collection('Users').doc(data.id);
        await docRef.set(data);
        console.log('User added');
    } catch (error) {
        console.error('Error adding user:', error);
    }
}

const addPlaces = async (places) => {
    try {
        const batch = db.batch();

        places.forEach((place) => {
            const placeRef = db.collection('Places').doc(place.Place_Id.toString());
            batch.set(placeRef, place);
        });

        await batch.commit();
        console.log('All places were added successfully!');
    } catch (error) {
        console.error('Error adding places:', error);
        throw error;
    }
}

const getAllPlaces = async () => {
    try {
        const snapshot = await db.collection('Places').get();
        if (snapshot.empty) {
            throw new Error("Places not found.");
        }

        const places = [];
        snapshot.forEach(doc => {
            places.push(doc.data());
        });

        return places;
    } catch (error) {
        console.error('Error getting places:', error);
        throw error;
    }
}

const getPlace = async (id) => {
    try {
        const doc = await db.collection('Places').doc(id).get();
        if (!doc.exists) {
            throw new Error("Place not found.");
        }

        return doc.data();
    } catch (error) {
        console.error('Error getting place:', error);
        throw error;
    }
}

const getPlaceByKeyword = async (keyword) => {
    try {
        const key = keyword.toLowerCase().replace(/\s/g, '');
        const snapshot = await db.collection('Places').get();
        if (snapshot.empty) {
            throw new Error("Places not found.");
        }

        const places = [];
        snapshot.forEach(doc => {
            const place = doc.data();
            const placeName = place.Place_Name.toLowerCase().replace(/\s/g, '');

            if (placeName.includes(key)) {
                places.push(place);
            }
        });

        if (places.length === 0) {
            throw new Error("Places not found.");
        }

        return places;
    } catch (error) {
        console.error('Error getting places by keyword:', error);
        throw error;
    }
}

const getPlaceByCategory = async (category) => {
    try {
        const cat = category.toLowerCase().replace(/\s/g, '');
        const snapshot = await db.collection('Places').get();
        if (snapshot.empty) {
            throw new Error("Places not found.");
        }

        const places = [];
        snapshot.forEach(doc => {
            const place = doc.data();
            const placeCategory = place.Category.toLowerCase().replace(/\s/g, '');

            if (placeCategory.includes(cat)) {
                places.push(place);
            }
        });

        if (places.length === 0) {
            throw new Error("Places not found.");
        }

        return places;
    } catch (error) {
        console.error('Error getting places by category:', error);
        throw error;
    }
}

module.exports = {
    add,
    addPlaces,
    getAllPlaces,
    getPlace,
    getPlaceByKeyword,
    getPlaceByCategory
};
