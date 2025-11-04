/*********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 04/11/2025
 * Autor: Eduardo Feitosa
 * Versão: 1.0
 **********************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const publicadorDAO = require('../../model/dao/publicador.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarPublicadores = async function() {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista de diretores
        let result = await publicadorDAO.getSelectAllPublisher()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.total_publishers = result.length
                MESSAGE.HEADER.response.publishers = result
                
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


const buscarPublicadorId = async function(id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){
            let result = await publicadorDAO.getSelectByIdPublisher(id)

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.publisher = result

                    return MESSAGE.HEADER //200
                }else{
                    return MESSAGE.ERROR_NOT_FOUND // 404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [ID] invalido`
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const inserirPublicador = async function(publicador, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let validarDados = validarDadosPublicador(publicador)

            if(!validarDados){
                let result = await publicadorDAO.setInsertPublisher(publicador)

                if(result){

                    let lastIdPublicador = await publicadorDAO.getSelectLastIdPublisher()
                    
                    if(lastIdPublicador){
                        //Adiciona no JSON de publicador o ID que foi gerado pelo BD
                        publicador.id = lastIdPublicador
                                                
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = publicador
                    
                        return MESSAGE.HEADER
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return validarDados
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

const atualizarPublicador = async function(publicador, id, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let validarId = await buscarPublicadorId(id)

            if(validarId.status_code == 200){
                
                let validarDados = validarDadosPublicador(publicador)

                if(!validarDados){
                    publicador.id = parseInt(id)

                    let result = await publicadorDAO.setUpdatePublisher(publicador)

                    if(result){
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = publicador

                        return MESSAGE.HEADER //200
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                    return validarDados
                }
            }else{
                return validarId
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const excluirPublicador = async function(id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarId = await buscarPublicadorId(id)

        if(validarId.status_code == 200){
            let result = await publicadorDAO.setDeletePublisher(id)

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


const validarDadosPublicador = function(publicador){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
    if(publicador.nome == '' || publicador.nome == null || publicador.nome == undefined || publicador.nome.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [NOME] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    
    }else if(publicador.is_ativa == 'true' || publicador.is_ativa == 'false'){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [IS_ATIVA] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    
    }else if(publicador.logradouro == '' || publicador.logradouro == null || publicador.logradouro == undefined || publicador.logradouro.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [LOGRADOURO] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    
    }else if(publicador.cidade == '' || publicador.cidade == null || publicador.cidade == undefined || publicador.cidade.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [CIDADE] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(publicador.estado == '' || publicador.estado == null || publicador.estado == undefined || publicador.estado.length > 2){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [ESTADO] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    
    }else if(publicador.pais == '' || publicador.pais == null || publicador.pais == undefined || publicador.pais.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [PAÍS] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    
    }else if(publicador.data_fundacao == null){
        return false

    }else if(publicador.data_fundacao == '' || publicador.data_fundacao == undefined || publicador.data_fundacao.length != 10){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [DATA_FUNDAÇÃO] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else{
        return false
    }
}

module.exports = {
    listarPublicadores,
    buscarPublicadorId,
    inserirPublicador,
    atualizarPublicador,
    excluirPublicador
}