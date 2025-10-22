/*********************************************************************************************
 * Objetivo: Arquivo responsável pela requisições da API do projeto da locadora de filmes
 * Data: 07/10/2025
 * Autor: Eduardo Feitosa
 * Versão: 1.0
 **********************************************************************************************/

//Import das bibliotecas para criar a API
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

//Cria um objeto especialista no formato JSON para receber os dados do body (POST E PUT)
const bodyParserJSON = bodyParser.json()

//Cria o objeto app para criar a API
const PORT = process.PORT || 8060

//Porta
const app = express()

//Configurações do cors
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})


const controllerFilme = require('./controller/filme/controller_filme.js')

//Endpoint para CRUD de filmes

//Retorna a lista de filmes
app.get('/v1/locadora/filmes', cors(), async function(request, response){
    //Chama a função da controller para retornar todos os filmes
    let filmes = await controllerFilme.listarFilmes()

    response.status(filmes.status_code)
    response.json(filmes)
})

//Retorna um filme filtrando pelo ID
app.get('/v1/locadora/filmes/:id', cors(), async function(request, response){

    //Recebe o ID enviado na requisição via parametro
    let idFilme = request.params.id
    
    //Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.buscarFilmeId(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})

//Insere um novo Filme no BD
app.post('/v1/locadora/filmes', cors(), bodyParserJSON, async function(request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o filme, enviamos os dados do body e o content-type
    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

app.put('/v1/locadora/filmes/:id', cors(), bodyParserJSON, async function(request, response){
    //Recebe os dados do bodu
    let dadosBody = request.body

    //Recebe o id do filme encaminhado pela URL
    let idFilme = request.params.id

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    let filme = await controllerFilme.atualizarFilme(dadosBody, idFilme, contentType)

    response.status(filme.status_code)
    response.json(filme)

})

app.delete('/v1/locadora/filmes/:id', cors(), async function(request, response) {
    let idFilme = request.params.id

    let filme = await controllerFilme.excluirFilmes(idFilme)
    response.status(filme.status_code)
    response.json(filme)
})

const controllerGenero = require('./controller/genero/controller_genero.js')

//EndPoints da tb_genero
app.get('/v1/locadora/generos', cors(), async function(request, response) {
    //Executando a função de buscar generos e configurando a resposta
    let genero = await controllerGenero.listarGeneros()
    response.status(genero.status_code)
    response.json(genero)
})

app.get('/v1/locadora/generos/:id', cors(), async function(request, response) {
    //Recebendo o ID do Genero pela URL
    let idGenero = request.params.id

    //Executando a função de buscar genero com base no ID e configurando a resposta
    let genero = await controllerGenero.buscarGeneroId(idGenero)
    response.status(genero.status_code)
    response.json(genero)
})

app.post('/v1/locadora/generos', cors(), bodyParserJSON, async function(request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Executando a função de inserir um genero e configurando a resposta
    let genero = await controllerGenero.inserirGenero(dadosBody, contentType)
    response.status(genero.status_code)
    response.json(genero)
})

app.put('/v1/locadora/generos/:id', cors(), bodyParserJSON, async function(request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebendo o ID do Genero pela URL
    let idGenero = request.params.id

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Executando a função de atualizar um genero e configurando a resposta
    let genero = await controllerGenero.atualizarGenero(dadosBody, idGenero, contentType)
    response.status(genero.status_code)
    response.json(genero)
})

app.delete('/v1/locadora/generos/:id', cors(), async function(request, response) {
    //Recebendo o ID do Genero pela URL
    let idGenero = request.params.id

    //Executando a função de excluir um genero e configurando a resposta
    let genero = await controllerGenero.excluirGenero(idGenero)
    response.status(genero.status_code)
    response.json(genero)
})


//ENDPOINTS DA TABELA CLASSIFICAÇÃO

const controllerClassificacao = require('./controller/classificacao/controller_classificacao.js')

app.get('/v1/locadora/classificacoes', cors(), async function(request, response) {
    let classificacao = await controllerClassificacao.listarClassificacoes()
    response.status(classificacao.status_code)
    response.json(classificacao)
})

app.get('/v1/locadora/classificacoes/:id', cors(), async function(request, response) {
    let idClassificacao = request.params.id
    
    let classificacao = await controllerClassificacao.buscarClassificacaoId(idClassificacao)
    response.status(classificacao.status_code)
    response.json(classificacao)
})

app.post('/v1/locadora/classificacoes', cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body
    
    let contentType = request.headers['content-type']

    let classificacao = await controllerClassificacao.inserirClassificacao(dadosBody, contentType)
    response.status(classificacao.status_code)
    response.json(classificacao)
})

app.put('/v1/locadora/classificacoes/:id', cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']
    
    let idClassificacao = request.params.id

    let classificacao = await controllerClassificacao.atualizarClassificacao(dadosBody, idClassificacao, contentType)
    response.status(classificacao.status_code)
    response.json(classificacao)
})

app.delete('/v1/locadora/classificacoes/:id', cors(), async function(request, response) {
    let idClassificacao = request.params.id
    
    let classificacao = await controllerClassificacao.excluirClassificacao(idClassificacao)
    response.status(classificacao.status_code)
    response.json(classificacao)
})


//ENDPOINTS DA TABELA ATOR

const controllerAtor = require('./controller/ator/controller_ator.js')

app.get('/v1/locadora/atores', cors(), async function(request, response) {
    let ator = await controllerAtor.listarAtores()
    response.status(ator.status_code)
    response.json(ator)
})

app.get('/v1/locadora/atores/:id', cors(), async function(request, response) {
    let idAtor = request.params.id
    
    let ator = await controllerAtor.buscarAtorId(idAtor)
    response.status(ator.status_code)
    response.json(ator)
})

app.post('/v1/locadora/atores', cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let ator = await controllerAtor.inserirAtor(dadosBody, contentType)
    console.log(`Parou aqui na resposta e é ${ator}`)
    response.status(ator.status_code)
    response.json(ator)
})

app.put('/v1/locadora/atores/:id', cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body
    
    let idAtor = request.params.id

    let contentType = request.headers['content-type']

    let ator = await controllerAtor.atualizarAtor(dadosBody, idAtor, contentType)
    response.status(ator.status_code)
    response.json(ator)
})

app.delete('/v1/locadora/atores/:id', cors(), async function(request, response) {
    let idAtor = request.params.id

    let ator = await controllerAtor.excluirAtor(idAtor)
    response.status(ator.status_code)
    response.json(ator)
})

app.listen(PORT, function(){
    console.log('API aguardando requisições!!!')
})