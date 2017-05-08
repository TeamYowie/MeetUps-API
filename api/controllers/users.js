"use strict";
const AUTH_KEY_HEADER_NAME = "x-auth-key";
const authKeyGenerator = require("./../utils/auth-key-generator")();
const idGenerator = require("./../utils/id-generator")();

module.exports = (db) => {
  const post = (req, res) => {
    let reqUser = req.body;
    if (!reqUser || typeof reqUser.username !== "string" || typeof reqUser.passHash !== "string") {
      return res.status(422)
        .send("Invalid username or password!");
    }

    let duplicateUser = db("users").find({
      usernameLower: reqUser.username.toLowerCase()
    });

    if (duplicateUser) {
      return res.status(409)
        .send('Duplicated user!');
    }

    reqUser.usernameLower = reqUser.username.toLowerCase();
    reqUser.id = idGenerator.get();
    db("users").insert(reqUser);

    return res.status(201)
      .send("User created!");
  };

  const auth = (req, res) => {
    let reqUser = req.body;

    let user = db("users").find({
      usernameLower: reqUser.username.toLowerCase()
    });

    if (!user || user.passHash !== reqUser.passHash) {
      return res.status(422)
        .send("Invalid username or password");
    }

    if (!user.authKey) {
      user.authKey = authKeyGenerator.get(user.id);
    }

    return res.status(200)
      .send({
        result: {
          id: user.id,
          username: user.username,
          authKey: user.authKey,
          profileImage: user.profileImage
        }
    });
  };

  const logout = (req, res) => {
    let reqUser = req.body;
    let authKey = req.headers[AUTH_KEY_HEADER_NAME];

    let user = db("users").find({
      id: reqUser.id
    });

    if (!user || user.authKey !== authKey) {
      return res.status(422)
        .send("Invalid credentials.");
    }

    user.authKey = null;

    return res.status(200)
      .send();
  };

  return {
    post,
    auth,
    logout
  };
};