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

//ENDPOINTS DA TABELA ATOR

const controllerAtor = require('../controller/ator/controller_ator.js')

router.get('/', cors(), async function(request, response) {
    let ator = await controllerAtor.listarAtores()
    response.status(ator.status_code)
    response.json(ator)
})

router.get('/:id', cors(), async function(request, response) {
    let idAtor = request.params.id
    
    let ator = await controllerAtor.buscarAtorId(idAtor)
    response.status(ator.status_code)
    response.json(ator)
})

router.post('/', cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let ator = await controllerAtor.inserirAtor(dadosBody, contentType)
    response.status(ator.status_code)
    response.json(ator)
})

router.put('/:id', cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body
    
    let idAtor = request.params.id

    let contentType = request.headers['content-type']

    let ator = await controllerAtor.atualizarAtor(dadosBody, idAtor, contentType)
    response.status(ator.status_code)
    response.json(ator)
})

router.delete('/:id', cors(), async function(request, response) {
    let idAtor = request.params.id

    let ator = await controllerAtor.excluirAtor(idAtor)
    response.status(ator.status_code)
    response.json(ator)
})

module.exports = router