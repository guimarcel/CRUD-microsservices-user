const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cfg = require("./config/config");
const User = require("./model/user");
const ManagerUser = require("./model/manageruser");
const create_token = require("./utils/token");

const app = express();
app.use(express.json());
app.use(cors());

const url = (database_url =
  "mongodb+srv://guiguimarcel51:senha1ncorreta@microsservicesapi.6lhi2h1.mongodb.net/?retryWrites=true&w=majority");

mongoose.connect(url, { userNewUrlParser: true, useUnifiedTopology: true });

app.get("/", (req, res) => {
  res.send({ output: req.headers });
});

app.post("/api/user/add", (req, res) => {
  const data = new User(req.body);
  data
    .save()
    .then((data) => {
      res.status(201).send({ output: `New user inserted`, payload: data });
    })
    .catch((erro) =>
      res.status(400).send({ output: `Insertion Fail -> ${erro}` })
    );
});

app.post("/api/user/login", (req, res) => {
  const us = req.body.user;
  const ps = req.body.password;

  console.log(`${us} - ${ps}`);

  User.findOne({ nomeusuario: us }, (error, data) => {
    console.log(data);
    if (error) return res.status(400).send({ output: `Find user error` });
    if (!data) return res.status(404).send({ output: `User not found` });

    bcrypt.compare(ps, data.senha, (error, same) => {
      if (!same)
        return res.status(400).send({ output: `Password authentication fail` });
      const token = create_token(data._id, data.nomeusuario);
      const info = new ManagerUser({
        userid: data._id,
        username: data.nomeusuario,
        information: req.headers,
      });
      info.save();
      res
        .status(200)
        .send({ output: `Authenticated`, payload: data, token: token });
    });
  });
});

app.listen(4000, () => console.log(`Servidor online in http://localhost:4000`));
