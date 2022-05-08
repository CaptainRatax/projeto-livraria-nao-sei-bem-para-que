var mongoose = require("mongoose");

const funcionarioSchema = new mongoose.Schema({
    nFuncionario: "string",
    nome: "string",
    email: "string",
    password: "string",
}, { timestamps: true });

const Funcionario = mongoose.model("Funcionario", funcionarioSchema);

module.exports = {
    Funcionario: Funcionario,
    funcionarioSchema: funcionarioSchema,
};