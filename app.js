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

app.listen(PORT, function(){
    console.log('API aguardando requisições!!!')
})