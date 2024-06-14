const express = require('express');
const cors = require('cors');

// routes
const firestoreRoutes = require('./app/routes/firestore.routes.js');
const authRoutes = require('./app/routes/auth.routes.js');
const userRoutes = require('./app/routes/user.routes.js');
const placeRoutes = require('./app/routes/place.routes.js');

const app = express();
const PORT = 8080;

// CORS options
var corsOptions = {
    origin: "*",
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
    res.json({ message: "rodex go" });
});

// Routes
app.use('/api/firestore', firestoreRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/places', placeRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
