/*********************************************************************************************
 * Objetivo: Arquivo responsável pela requisições da API do projeto da locadora de filmes
 * Data: 07/10/2025
 * Autor: Eduardo Feitosa
 * Versão: 1.0
 **********************************************************************************************/

//Import das bibliotecas para criar a API
const express = require('express')
const cors = require('cors')

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

const filmeRoutes = require('./routes/filmeRoutes.js')
const generoRoutes = require('./routes/generoRoutes.js')
const classificacaoRoutes = require('./routes/classificacaoRoutes.js')
const atorRoutes = require('./routes/ator.js')
const diretorRoutes = require('./routes/diretor.js')
const publicadorRoutes = require('./routes/publicador.js')


//Confugurando as rotas de filme
app.use('/v1/locadora/filmes', filmeRoutes)

//Confugurando as rotas de genero
app.use('/v1/locadora/generos', generoRoutes)

//Confugurando as rotas de classificacao
app.use('/v1/locadora/classificacoes', classificacaoRoutes)

//Confugurando as rotas de atores
app.use('/v1/locadora/atores', atorRoutes)

//Confugurando as rotas de diretores
app.use('/v1/locadora/diretores', diretorRoutes)

//Confugurando as rotas de genero
app.use('/v1/locadora/publicadores', publicadorRoutes)

app.listen(PORT, function(){
    console.log('API aguardando requisições!!!')
})

