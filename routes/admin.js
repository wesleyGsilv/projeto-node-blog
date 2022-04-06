const express = require('express');
const { render } = require('express/lib/response');
const router  = express.Router()
//Forma externa de usar um model 
const mongoose = require('mongoose')
require("../models/Categoria")
require("../models/Post")
const Categoria = mongoose.model("categorias")
const Post = mongoose.model("postagens")

router.get('/', (req, res) => {
    res.render("admin/index")
})

///Rotas Categorias
router.get('/categoria', (req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias)=>{
        res.render("admin/categoria", {
            categorias: categorias.map(categoria => categoria.toJSON())
        })
    }).catch((erro)=>{
        req.flash("erro_msg", "hove erro ao renderizar")
        res.redirect("/admin")
    })
    
})

router.get('/categoria/add', (req, res) => {
    res.render("admin/addcategoria")
})

router.post('/categoria/nova', (req, res) => {
//Validaçâo dos campos do formulario

    var erros = []
    if(!req.body.nome || typeof req.body.none == undefined || req.body.nome == null){
        erros.push({texto:"Nome invalido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:"Slug vazio ou invalido"})
    }

    if(req.body.nome.length < 3){
        erros.push ({texto: "Nome da categoria é muito pequeno e necessário ter acima de 3 caracteres"})
    }

    if(erros.length > 0){
        res.render("admin/addcategoria", {erros: erros})
    }else{
    // Pegando os dados do formulario 
    const newCategori ={
        nome: req.body.nome,
        slug: req.body.slug
    }
    //Criar nove categoria.
    new Categoria(newCategori).save().then(()=>{
        req.flash("success_msg", "Categoria Criada co sucesso!")
        res.redirect("/admin/categoria")
    }).catch((erro)=>{
        req.flash("erro_msg", "Erro ao salvar categoria")
        res.redirect("/admin")
    })
    }
})

router.get("/categoria/edit/:id", (req, res) => {

    //findOne => pesquisar apenas um elemento por vez
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render("admin/edicao-categoria", {categoria: categoria})
    }).catch((erro) => {
        req.flash("erro_msg", "Esta Categira não existe")
        res.redirect("/admin/categoria")
    })
    
})

router.post("/categoria/edit", (req, res) =>{

    var errosEdit = []
    if(!req.body.nome || typeof req.body.none == undefined || req.body.nome == null){
        errosEdit.push({texto:"Nome invalido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errosEdit.push({texto:"Slug vazio ou invalido"})
    }

    if(req.body.nome.length < 3){
        errosEdit.push ({texto: "Nome da categoria é muito pequeno e necessário ter acima de 3 caracteres"})
    }

    if(errosEdit.length > 0){
        res.render("admin/addcategoria", {erros: errosEdit})
    }else{
    Categoria.findOne({_id: req.body.id}).then((categoria) =>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categoria")
        }).catch((erro) =>{
            req.flash("erro_msg", "holve um erro ao salvar a categoria")
            res.redirect("/admin/categoria")
        })
    }).catch((erro) =>{
        req.flash("erro_msg", "holve um erro ao editar a categoria")
        res.redirect("/admin/categoria")
    })
    }

})

router.post("/categoria/deletar", (req, res) =>{
    // o _id serve para pegar um id por vez
    Categoria.remove({'_id': req.body.id}).then(() =>{
        req.flash("success_msg", "Categoria Deletadata com sucesso!")
        res.redirect("/admin/categoria")
    }).catch((erro)=>{
        req.flash("erro_msg", "hove erro ao Deletar")
        res.redirect("/admin")
    })
})

// Rotas Post

router.get('/post', (req, res) => {
    Post.find().populate("categoria").sort({date: 'desc'}).then((postagens)=>{
        res.render("./admin/postagem", {
            postagens: postagens.map(post => post.toJSON())
        })
    }).catch((erro)=>{
        req.flash("erro_msg", "hove um erro ao listar as postagens")
        res.redirect("/admin/postagem")
    })
})

router.get('/post/add', (req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias)=>{
        res.render("./admin/addpostagem", {
            categorias: categorias.map(categoria => categoria.toJSON())
        })
    }).catch((erro)=>{
        req.flash("erro_msg", "hove erro no Formulario")
        res.redirect("/admin")
    })
})

router.post('/post/nova', (req, res) => {
    //Validaçâo dos campos do formulario
    
    var erros = []

    if(!req.body.img || typeof req.body.img == undefined || req.body.img == null){
        erros.push({texto:"E necesario ter uma imagem para o post"})
    }
    
     if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto:"Titulo invalido"})
    }

    if(req.body.titulo.length < 3){
        erros.push ({texto: "Titulo é muito pequeno e necessário ter acima de 3 caracteres"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:"Slug vazio ou invalido"})
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto:"Descrição não pode esta vazia"})
    }

    if(req.body.descricao.length < 10){
        erros.push ({texto: "Descrição é muito pequeno e necessário ter acima de 10 caracteres"})
    }

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto:"Enecesario ter um conteúdo para o post"})
    }

    if(req.body.conteudo.length < 10){
        erros.push ({texto: "Conteúdo é muito pequeno e necessário ter acima de 10 caracteres"})
    }

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria invalida, registre uma nova!"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagem", {erros: erros})
    }else{
    // Pegando os dados do formulario 
    const newPost ={
        img: req.body.img,
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria
    }
    //Criar nove categoria.
    new Post(newPost).save().then(()=>{
        req.flash("success_msg", "Postagem Criada co sucesso!")
        res.redirect("/admin/post")
    }).catch((erro)=>{
        req.flash("erro_msg", "Erro ao salvar Postagem")
        res.redirect("/admin/post")
    })
    }
})

router.get("/post/edit/:id", (req, res) => {

    //findOne => pesquisar apenas um elemento por vez
    //Forma de fazer busca no DB sequencial 
    Post.findOne({_id:req.params.id}).then((post)=>{
        Categoria.find().then((categorias) =>{
            res.render("admin/edicao-post", {categorias: categorias,post: post})
        }).catch((erro) => {
            req.flash("erro_msg", "Esta Categira não existe")
            res.redirect("/admin/post")
        })
        
    }).catch((erro) => {
        req.flash("erro_msg", "Esta Categira não existe")
        res.redirect("/admin/post")
    })
    
})

router.post("/post/edit", (req, res) =>{
    var erros = []

    if(!req.body.img || typeof req.body.img == undefined || req.body.img == null){
        erros.push({texto:"E necesario ter uma imagem para o post"})
    }
    
     if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto:"Titulo invalido"})
    }

    if(req.body.titulo.length < 3){
        erros.push ({texto: "Titulo é muito pequeno e necessário ter acima de 3 caracteres"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:"Slug vazio ou invalido"})
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto:"Descrição não pode esta vazia"})
    }

    if(req.body.descricao.length < 10){
        erros.push ({texto: "Descrição é muito pequeno e necessário ter acima de 10 caracteres"})
    }

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto:"Enecesario ter um conteúdo para o post"})
    }

    if(req.body.conteudo.length < 10){
        erros.push ({texto: "Conteúdo é muito pequeno e necessário ter acima de 10 caracteres"})
    }

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria invalida, registre uma nova!"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagem", {erros: erros})
    }else{
    Post.findOne({_id: req.body.id}).then((post) =>{
        post.img = req.body.img,
        post.titulo = req.body.titulo,
        post.slug = req.body.slug,
        post.descricao = req.body.descricao,
        post.conteudo = req.body.conteudo,
        post.categoria = req.body.categoria

        post.save().then(()=>{
            req.flash("success_msg", "Post editada com sucesso!")
            res.redirect("/admin/post")
        }).catch((erro) =>{
            req.flash("erro_msg", "holve um erro ao salvar o Post")
            res.redirect("/admin/post")
        })
    }).catch((erro) =>{
        req.flash("erro_msg", "holve um erro ao editar o Post")
        res.redirect("/admin/post")
    })
    }

})

router.post("/post/deletar", (req, res)=>{
    Post.remove({'_id': req.body.id}).then(() =>{
        req.flash("success_msg", "Post Deletadato com sucesso!")
        res.redirect("/admin/post")
    }).catch((erro)=>{
        req.flash("erro_msg", "hove erro ao Deletar")
        res.redirect("/admin")
    })
})

module.exports = router