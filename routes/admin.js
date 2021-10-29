const express = require("express");
const app = express();
const basicAuth = require('express-basic-auth');

const adminRoutes = express.Router();

module.exports = adminRoutes;