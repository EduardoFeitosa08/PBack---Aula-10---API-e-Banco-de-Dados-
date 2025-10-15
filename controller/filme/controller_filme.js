/*********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 07/10/2025
 * Autor: Eduardo Feitosa
 * Versão: 1.0
 **********************************************************************************************/
//Import do arquivo DAO para manipular o CRUD no BD
const filmeDAO = require('../../model/dao/filme.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de filmes
const listarFilmes = async function() {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{
        //Chama a função do DAO para retornar a lista de filmes
        let result = await filmeDAO.getSelectAllFilms()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.total_films = result.length
                MESSAGE.HEADER.response.films = result
                
                return MESSAGE.HEADER //200
            }else{
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }

    }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
    
}


//Retorna um filme filtrando pelo ID
const buscarFilmeId = async function(id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatorio
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){
            //Chama a função para filtrar pelo ID
            let result = await filmeDAO.getSelectByIdFilms(parseInt(id)) 

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film = result

                    return MESSAGE.HEADER //200
                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] invalido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }


    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo filme
const inserirFilme = async function(filme, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){
            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilme(filme)

            if(!validarDados){
                // Chama a função do DAO para inserir um novo filme
                let result = await filmeDAO.setInsertFilms(filme)
    
                if(result){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
    
                    return MESSAGE.HEADER //201
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return validarDados //400
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
        
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Atualiza um filme filtrando pelo ID
const atualizarFilme = async function(filme, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-types
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){
            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilme(filme)

            if(!validarDados){
                // Chama a função para validar a consistencia do ID e verifica se existe no BD
                let validarID = await buscarFilmeId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200
                if(validarID.status_code == 200){

                    //Adicionando o ID no JSON com os dados do filme
                    filme.id = parseInt(id)

                    //Chama a função do DAO para atualizar um filme
                    let result = await filmeDAO.setUpdateFilms(filme)
    
                    if(result){
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = filme
        
                        return MESSAGE.HEADER //200
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                    return validarID // Retorno da função de buscarFilmeID (400 ou 404 ou 500)
                }
            }else{
                return validarDados // Retorno da função de validar dados do Filme 400
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
        
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Apaga um filme filtrando pelo ID
const excluirFilmes = async function(id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await buscarFilmeId(id)

        if(validarID.status_code == 200){
            let result = await filmeDAO.setDeleteFilms(id)

            if(result){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETED_ITEM.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETED_ITEM.status_code
                MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETED_ITEM.message

                return MESSAGE.HEADER //200
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            return validarID //404
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Validação dos dados de cadastro do Filme
const validarDadosFilme = async function(filme) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(filme.nome == '' || filme.nome == null || filme.nome == undefined || filme.nome.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [NOME] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(filme.sinopse == undefined){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [SINOPSE] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(filme.data_lancamento == undefined || filme.data_lancamento.length != 10){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [DATA LANÇAMENTO] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(filme.duracao == '' || filme.duracao == null || filme.duracao == undefined || filme.duracao.length > 8){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [DURACAO] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(filme.orcamento == '' || filme.orcamento == null || filme.orcamento == undefined || filme.orcamento.length > 18 || typeof(filme.orcamento) != 'number'){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [ORCAMENTO] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(filme.trailer == undefined || filme.trailer.length > 280){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [TRAILER] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(filme.capa == '' || filme.capa == null || filme.capa == undefined || filme.capa.length > 280){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [CAPA] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else{
        return false
    }

}





module.exports = {
    listarFilmes,
    buscarFilmeId,
    inserirFilme,
    atualizarFilme,
    excluirFilmes
}