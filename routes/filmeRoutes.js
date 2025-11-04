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


const controllerFilme = require('../controller/filme/controller_filme.js')

//Endpoint para CRUD de filmes

//Retorna a lista de filmes
router.get('/', cors(), async function(request, response){
    //Chama a função da controller para retornar todos os filmes
    let filmes = await controllerFilme.listarFilmes()

    response.status(filmes.status_code)
    response.json(filmes)
})

//Retorna um filme filtrando pelo ID
router.get('/:id', cors(), async function(request, response){

    //Recebe o ID enviado na requisição via parametro
    let idFilme = request.params.id
    
    //Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.buscarFilmeId(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})

//Insere um novo Filme no BD
router.post('/', cors(), bodyParserJSON, async function(request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o filme, enviamos os dados do body e o content-type
    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

router.put('/:id', cors(), bodyParserJSON, async function(request, response){
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

router.delete('/:id', cors(), async function(request, response) {
    let idFilme = request.params.id

    let filme = await controllerFilme.excluirFilmes(idFilme)
    response.status(filme.status_code)
    response.json(filme)
})

module.exports = router