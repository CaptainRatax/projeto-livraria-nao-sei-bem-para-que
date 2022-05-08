var mongoose = require("mongoose");
var { clienteSchema } = require("./clientesSchema");
var { livroSchema } = require("./livrosSchema");
var { funcionarioSchema } = require("./funcionariosSchema");

const vendaSchema = new mongoose.Schema({
    valor: "number",
    pontosUsados: "number",
    cliente: clienteSchema,
    livro: livroSchema,
    funcionario: funcionarioSchema,
}, { timestamps: true });

const Venda = mongoose.model("Venda", vendaSchema);

module.exports = {
    Venda: Venda,
    vendaSchema: vendaSchema,
};