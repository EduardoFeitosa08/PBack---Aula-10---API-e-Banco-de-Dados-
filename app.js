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

app.listen(PORT, function(){
    console.log('API aguardando requisições!!!')
})