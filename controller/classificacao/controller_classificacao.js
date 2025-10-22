/*********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 22/10/2025
 * Autor: Eduardo Feitosa
 * Versão: 1.0
 **********************************************************************************************/
//Import do arquivo DAO para manipular o CRUD da classificacao no BD
const classificacaoDAO = require('../../model/dao/classificacao.js')
const { buscarFilmeId } = require('../filme/controller_filme.js')

//Import do arquivo que contem a padronização das mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarClassificacoes = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista das classificações
        let result = await classificacaoDAO.getSelectAllRating()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.total_rating = result

                return MESSAGE.HEADER //200
            }else{
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const buscarClassificacaoId = async function(id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(id != '' && id != undefined && id != null && !isNaN(id) && id > 0){
            //Chama a função para filtrar pelo ID
            let result = await classificacaoDAO.getSelectByIdRating(id)

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.rating = result

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

const inserirClassificacao = async function(classificacao, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){
            if(classificacao.nome != '' && classificacao.nome != undefined && classificacao.nome != null && classificacao.nome.length <= 100){
            
                if(classificacao.idade_minima != '' && classificacao.idade_minima != undefined && classificacao.idade_minima != null && !isNaN(classificacao.idade_minima) && classificacao.idade_minima >= 0){
                    let result = await classificacaoDAO.setInsertRating(classificacao)

                    if(result){
                        let lastIdClassificacao = await classificacaoDAO.getSelectLastIdRating()

                        if(lastIdClassificacao){
                            classificacao.id = lastIdClassificacao[0]['classificacao_id']
                            
                            MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                            MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                            MESSAGE.HEADER.response = classificacao
                            
                            return MESSAGE.HEADER
                        }else{
                            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                        }

                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }

                }else{
                    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [IDADE_MINIMA] invalido!!!'
                    return MESSAGE.ERROR_REQUIRED_FIELDS //400
                }
            }else{
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] invalido!!!'
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const atualizarClassificacao = async function(classificacao, id, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){
            if(classificacao.nome != '' && classificacao.nome != undefined && classificacao.nome != null && classificacao.nome.length <= 100){
            
                if(classificacao.idade_minima != '' && classificacao.idade_minima != undefined && classificacao.idade_minima != null && !isNaN(classificacao.idade_minima) && classificacao.idade_minima >= 0){
                    let validarId = await buscarClassificacaoId(id)

                    if(validarId.status_code == 200){
                        
                        classificacao.id = parseInt(id)

                        let result = await classificacaoDAO.setUpdateRating(classificacao)

                        if(result){
                            MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                            MESSAGE.HEADER.response = classificacao

                            return MESSAGE.HEADER //200
                        }else{
                            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                        }

                    }else{
                        return validarId //A resposta do ValidarId já especifica onde está o erro
                    }

                }else{
                    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [IDADE_MINIMA] invalido!!!'
                    return MESSAGE.ERROR_REQUIRED_FIELDS //400
                }

            }else{
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] invalido!!!'
                return MESSAGE.ERROR_REQUIRED_FIELDS //400
            }
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const excluirClassificacao = async function(id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarId = await buscarClassificacaoId(id)

        if(validarId.status_code == 200){
            let result = await classificacaoDAO.setDeleteRating(id)

            if(result){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETED_ITEM.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETED_ITEM.status_code
                MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETED_ITEM.message

                return MESSAGE.HEADER //200
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            return validarId
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

module.exports = {
    listarClassificacoes,
    buscarClassificacaoId,
    inserirClassificacao,
    atualizarClassificacao,
    excluirClassificacao
}