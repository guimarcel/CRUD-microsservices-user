const mongoose = require("mongoose");
const bcrypt = require("mongoose");
const table = new mongoose.Schema({
  nomeusuario: { type: String, unique: true },
  email: { type: String },
  senha: { type: String },
  nomecompleto: { type: String },
  telefone: { type: String },
  datacadastro: { type: Date, default: Date.now },
});

table.pre("save", function (next) {
  let user = this;
  if (!user.isModified("senha")) return next();
  bcrypt.hash(user.password, 10, (erro, hashpass) => {
    user.password = hashpass;
    return next();
  });
});

module.exports = mongoose.model("user", table);
