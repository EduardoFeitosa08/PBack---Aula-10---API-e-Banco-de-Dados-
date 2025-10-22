/*********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 22/10/2025
 * Autor: Eduardo Feitosa
 * Versão: 1.0
 **********************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const atorDAO = require('../../model/dao/ator.js')

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarAtores = async function() {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista de atores
        let result = await atorDAO.getSelectAllActor()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.total_actors = result.length
                MESSAGE.HEADER.response.films = result
                
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

const buscarAtorId = async function(id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){
            let result = await atorDAO.getSelectByIdActor(id)

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.actor = result

                    return MESSAGE.HEADER //200
                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
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

const inserirAtor = async function(ator, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){
            let validarDados = validarDadosAtor(ator)

            if(!validarDados){
                let result = await atorDAO.setInsertActor(ator)

                if(result){

                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                    MESSAGE.HEADER.response = ator

                    return MESSAGE.HEADER
                    // let lastIdAtor = await atorDAO.getSelectLastIdActor()

                    // if(lastIdAtor){
                    //     //Adiciona no JSON de ator o ID que foi gerado pelo BD
                    //     ator.id = lastIdFilme
                            
                    //     MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                    //     MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                    //     MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                    //     MESSAGE.HEADER.response = ator

                    //     return MESSAGE.HEADER
                    // }else{
                    //     return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                    // }
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

const atualizarAtor = async function(ator, id, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){
            let validarId = await buscarAtorId(id)

            if(validarId.status_code == 200){

                let validarDados = validarDadosAtor(ator)

                if(!validarDados){
                    //Adicionando o ID no JSON com os dados do ator
                    ator.id = parseInt(id)

                    let result = await atorDAO.setInsertActor(ator)

                    if(result){
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = ator
        
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

const excluirAtor = async function(id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarId = await buscarAtorId(id)

        if(validarId.status_code == 200){
            let result = await atorDAO.setDeleteActor(id)

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


const validarDadosAtor = function(ator){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(ator.nome == '' || ator.nome == null || ator.nome == undefined || ator.nome.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [NOME] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.genero == '' || ator.genero == null || ator.genero == undefined || ator.genero.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [GENERO] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.data_nascimento == '' || ator.data_nascimento == null || ator.data_nascimento == undefined || ator.data_nascimento.length != 10){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [DATA_NASCIMENTO] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.img == ''|| ator.img == undefined || ator.img.length > 200){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [IMG] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(ator.data_morte == null){
        return false

    }else if(ator.data_morte == '' || ator.data_morte == undefined || ator.data_morte.length != 10){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [DATA_MORTE] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else{
        return false
    }
}

module.exports = {
    listarAtores,
    buscarAtorId,
    inserirAtor,
    atualizarAtor,
    excluirAtor
}