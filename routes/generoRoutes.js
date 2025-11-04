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

const controllerGenero = require('../controller/genero/controller_genero.js')

//EndPoints da tb_genero
router.get('/', cors(), async function(request, response) {
    //Executando a função de buscar generos e configurando a resposta
    let genero = await controllerGenero.listarGeneros()
    response.status(genero.status_code)
    response.json(genero)
})

router.get('/:id', cors(), async function(request, response) {
    //Recebendo o ID do Genero pela URL
    let idGenero = request.params.id

    //Executando a função de buscar genero com base no ID e configurando a resposta
    let genero = await controllerGenero.buscarGeneroId(idGenero)
    response.status(genero.status_code)
    response.json(genero)
})

router.post('/', cors(), bodyParserJSON, async function(request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Executando a função de inserir um genero e configurando a resposta
    let genero = await controllerGenero.inserirGenero(dadosBody, contentType)
    response.status(genero.status_code)
    response.json(genero)
})

router.put('/:id', cors(), bodyParserJSON, async function(request, response) {
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

router.delete('/:id', cors(), async function(request, response) {
    //Recebendo o ID do Genero pela URL
    let idGenero = request.params.id

    //Executando a função de excluir um genero e configurando a resposta
    let genero = await controllerGenero.excluirGenero(idGenero)
    response.status(genero.status_code)
    response.json(genero)
})

module.exports = router