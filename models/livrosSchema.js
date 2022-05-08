var mongoose = require("mongoose");

const livroSchema = new mongoose.Schema({
    nLivro: "string",
    nome: "string",
    autor: "string",
    dataPublicacao: "date",
    preco: "number",
    usado: "boolean",
    stock: "number",
}, { timestamps: true });

const Livro = mongoose.model("Livro", livroSchema);

module.exports = {
    Livro: Livro,
    livroSchema: livroSchema,
};