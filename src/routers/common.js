const express = require("express");
const CommonCtrl = require("../controllers/commonController");

const Router = express.Router();

Router.get("/", CommonCtrl.index);
Router.get("/imgCode", CommonCtrl.imgCode);


module.exports = Router;