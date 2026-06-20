require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
connectDB();

app.use(express.json());

const urlRoutes = require('./routes/urlRoutes');
app.use('/api/url',urlRoutes);
app.use('/',urlRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});