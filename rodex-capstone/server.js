const express = require('express');
const cors = require("cors");

// routes
const firestoreRoutes = require('./app/routes/firestore.routes.js');
const authRoutes = require('./app/routes/auth.routes.js');
const userRoutes = require('./app/routes/user.routes.js');
const placeRoutes = require('./app/routes/place.routes.js');

const app = express();
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

var corsOptions = {
    origin: "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "rodex go" });
});

firestoreRoutes(app);
authRoutes(app);
userRoutes(app);
placeRoutes(app);