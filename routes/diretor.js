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

//ENDPOINTS DA TABELA DIRETOR

const controllerDiretor = require('../controller/diretor/controller_diretor.js')

router.get('/', cors(), async function(request, response) {
    let diretor = await controllerDiretor.listarDiretores()
    response.status(diretor.status_code)
    response.json(diretor)
})

router.get('/:id', cors(), async function(request, response) {
    let idDiretor = request.params.id
    
    let diretor = await controllerDiretor.buscarDiretorId(idDiretor)
    response.status(diretor.status_code)
    response.json(diretor)
})

router.post('/', cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let diretor = await controllerDiretor.inserirDiretor(dadosBody, contentType)
    response.status(diretor.status_code)
    response.json(diretor)
})

router.put('/:id', cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body
    
    let idDiretor = request.params.id

    let contentType = request.headers['content-type']

    let diretor = await controllerDiretor.atualizarDiretor(dadosBody, idDiretor, contentType)
    response.status(diretor.status_code)
    response.json(diretor)
})

router.delete('/:id', cors(), async function(request, response) {
    let idDiretor = request.params.id

    let diretor = await controllerDiretor.excluirDiretor(idDiretor)
    response.status(diretor.status_code)
    response.json(diretor)
})

module.exports = router