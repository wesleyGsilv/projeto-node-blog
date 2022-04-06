const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Criando uma collections com o nome categoria, seria uma tabela em mysql

const categoria = new Schema({
    nome:{
        type: String,
        required: true
    },

    slug:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model("categorias", categoria)