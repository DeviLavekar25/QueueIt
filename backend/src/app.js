const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const venueRoutes = require("./routes/venue.routes");
const queueRoutes = require("./routes/queue.routes")
const errorHandler = require("./middleware/error.middleware");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/venues",venueRoutes);
app.use("/api/queues",queueRoutes);

app.get("/", (req, res) => {
    res.send("QueueIt API Running");
});

app.use(errorHandler);

module.exports = app;