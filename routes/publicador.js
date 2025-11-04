//Import das bibliotecas para criar a API
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

//Cria um objeto especialista no formato JSON para receber os dados do body (POST E PUT)
const bodyParserJSON = bodyParser.json()

//Configurações do cors
const router = express.Router()
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

//ENDPOINT DA TABELA PUBLICADOR

const controllerPublicador = require('../controller/publicador/controller_publicador.js')

router.get('/', cors(), async function(request, response){
    let publicador = await controllerPublicador.listarPublicadores()
    response.status(publicador.status_code)
    response.json(publicador)
})

router.get('/:id', cors(), async function(request, response) {
    let publicadorId = request.params.id

    let publicador = await controllerPublicador.buscarPublicadorId(publicadorId)
    response.status(publicador.status_code)
    response.json(publicador)
})

router.post('/', cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let publicador = await controllerPublicador.inserirPublicador(dadosBody, contentType)
    response.status(publicador.status_code)
    response.json(publicador)
})

router.put('/:id', cors(), bodyParserJSON, async function(request, response) {
    let publicadorId = request.params.id

    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let publicador = await controllerPublicador.atualizarPublicador(dadosBody, publicadorId, contentType)
    response.status(publicador.status_code)
    response.json(publicador)
})

router.delete('/:id', cors(), async function(request, response) {
    let publicadorId = request.params.id

    let publicador = await controllerPublicador.excluirPublicador(publicadorId)
    response.status(publicador.status_code)
    response.json(publicador)
})

module.exports = router