const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postagem = new Schema({
    img:{
        type: String,
    },
    titulo:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        required: true
    },
    categoria:{
        //Esse comando serve para fazer a relação entre a tabela post com a tabela categoria, pegando o objeto atraves do id da categoria
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model("postagens", postagem)