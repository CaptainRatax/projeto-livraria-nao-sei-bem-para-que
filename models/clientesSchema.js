var mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
    nome: "string",
    email: "string",
    telemovel: "string",
    password: "string",
    pontos: "number",
}, { timestamps: true });

const Cliente = mongoose.model("Cliente", clienteSchema);

module.exports = {
    Cliente: Cliente,
    clienteSchema: clienteSchema,
};