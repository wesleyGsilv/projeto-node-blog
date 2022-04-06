//Carregando modulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const  admin = require('./routes/admin')
//Definino a configuração pa dasta public onde ficas os arquivos img e css
const path = require('path')
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash")

//Configuraçoes

// Sessão config
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//Config  Middlewares

app.use((req, res, next)=>{
    //locals e uma função para declarar variaveis global
    res.locals.success_msg = req.flash("success_msg")
    res.locals.erro_msg = req.flash("erro_msg")
    next()
})

//Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//handlebars
app.engine('.hbs', handlebars.engine({ extname: '.hbs', defaultLayout: "main", runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
} }));
app.set('view engine', 'hbs', path.join(__dirname, 'views'))

//app.set('views', path.join(__dirname, 'views'));

//Config pasta public
app.use(express.static(path.join(__dirname, "public")));

//Mongose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/blogapp").then(() =>{
    console.log("Servidor conectado")
}).catch((erro) =>{
    console.log("Servidor com erro: " + erro)
})

//Rotas
// O  app.use('/admin', admin) esta recebendo as configuraços do arquivo admin.js
app.use('/admin', admin)
//Outros

const porta = 9090
app.listen(porta, ()=> {
    console.log("Servidor rodando na porta: " + porta);
})