"use strict";
const express = require("express"),
  bodyParser = require("body-parser"),
  lowdb = require("lowdb");

let db = lowdb("./data/data.json");
db._.mixin(require("underscore-db"));

let api = express();
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

api.get("/", function(request, response){
  response.send("Welcome to the API!");
});

let usersController = require("./controllers/users")(db);

api.post("/api/auth", usersController.auth);
api.post("/api/logout", usersController.logout);
api.post("/api/users", usersController.post);


let port = process.env.PORT || 3000;

api.listen(port, function() {
  console.log("Server is running at http://localhost:" + port);
});