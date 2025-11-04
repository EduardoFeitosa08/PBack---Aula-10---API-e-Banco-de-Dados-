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

//ENDPOINTS DA TABELA CLASSIFICAÇÃO

const controllerClassificacao = require('../controller/classificacao/controller_classificacao.js')

router.get('/', cors(), async function(request, response) {
    let classificacao = await controllerClassificacao.listarClassificacoes()
    response.status(classificacao.status_code)
    response.json(classificacao)
})

router.get('/:id', cors(), async function(request, response) {
    let idClassificacao = request.params.id
    
    let classificacao = await controllerClassificacao.buscarClassificacaoId(idClassificacao)
    response.status(classificacao.status_code)
    response.json(classificacao)
})

router.post('/', cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body
    
    let contentType = request.headers['content-type']

    let classificacao = await controllerClassificacao.inserirClassificacao(dadosBody, contentType)
    response.status(classificacao.status_code)
    response.json(classificacao)
})

router.put('/:id', cors(), bodyParserJSON, async function(request, response) {
    let dadosBody = request.body

    let contentType = request.headers['content-type']
    
    let idClassificacao = request.params.id

    let classificacao = await controllerClassificacao.atualizarClassificacao(dadosBody, idClassificacao, contentType)
    response.status(classificacao.status_code)
    response.json(classificacao)
})

router.delete('/:id', cors(), async function(request, response) {
    let idClassificacao = request.params.id
    
    let classificacao = await controllerClassificacao.excluirClassificacao(idClassificacao)
    response.status(classificacao.status_code)
    response.json(classificacao)
})

module.exports = router