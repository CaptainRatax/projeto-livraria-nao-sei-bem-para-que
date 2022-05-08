var mongoose = require("mongoose");
var { clienteSchema } = require("./clientesSchema");
var { livroSchema } = require("./livrosSchema");
var { funcionarioSchema } = require("./funcionariosSchema");

const compraSchema = new mongoose.Schema({
    valor: "number",
    cliente: clienteSchema,
    livro: livroSchema,
    funcionario: funcionarioSchema,
}, { timestamps: true });

const Compra = mongoose.model("Compra", compraSchema);

module.exports = {
    Compra: Compra,
    compraSchema: compraSchema,
};