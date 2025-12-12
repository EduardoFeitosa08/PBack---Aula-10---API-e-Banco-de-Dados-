/*********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model (Validações, tratamento de dados, tratamento de erros, etc) para o CRUD de Filme e Genero
 * Data: 05/11/2025
 * Autor: Eduardo Feitosa
 * Versão: 2.0
 **********************************************************************************************/
//Import do arquivo DAO para manipular o CRUD do Filme Genero no BD
const filmePublicadorDAO = require('../../model/dao/filme_publicador.js')

//Import do arquivo que contem a padronização das mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de todos os filmes e atores
const listarFilmesPublicadores = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista dos filmes atores do BD
        let result = await filmePublicadorDAO.getSelectAllFilmsPublishers()

        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.total_film_actors = result.length
                MESSAGE.HEADER.response.film_publishers = result

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna um filme genero filtrando pelo ID
const buscarFilmePublicadorId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatorio
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await filmePublicadorDAO.getSelectByIdFilmPublishers(id)

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_publisher = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 404
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] invalido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Retorna os generos filtrando pelo ID do filme
const listarPublicadoresFilmeId = async function (filmeId) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatorio
        if (filmeId != '' && filmeId != null && filmeId != undefined && !isNaN(filmeId) && filmeId > 0) {
            //Chama a função para filtrar pelo ID
            let result = await filmePublicadorDAO.getSelectPublishersByFilmeId(filmeId)

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.publishers = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [FILME_ID] invalido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Retorna os filmes filtrando pelo ID do genero
const listarFilmesPublicadorId = async function (publicadorId) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatorio
        if (publicadorId != '' && publicadorId != null && publicadorId != undefined && !isNaN(publicadorId) && publicadorId > 0) {
            //Chama a função para filtrar pelo ID
            let result = await filmePublicadorDAO.getSelectFilmsByPublisherId(publicadorId)

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.films = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 404
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [PUBLICADOR_ID] invalido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

const inserirFilmePublicador = async function (filmePublicador, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilmePublicador(filmePublicador)

            if (!validarDados) {
                // Chama a função do DAO para inserir um novo filme
                let result = await filmePublicadorDAO.setInsertFilmsPublishers(filmePublicador)

                if (result) {
                    //Chama a função para receber o ID gerado no BD
                    let lastIdFilmePublicador = await filmePublicadorDAO.getSelectLastIdFilmPublisher()

                    if (lastIdFilmePublicador) {
                        //Adiciona no JSON de filme o ID que foi gerado pelo BD
                        filmePublicador.id = lastIdFilmePublicador

                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = filmePublicador

                        return MESSAGE.HEADER //201
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }

                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return validarDados //400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

const atualizarFilmePublicador = async function (filmePublicador, id, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilmePublicador(filmePublicador)

            if (!validarDados) {

                let validarId = await buscarFilmeGeneroId(id)

                if (validarId.status_code == 200) {
                    // Chama a função do DAO para inserir um novo filme
                    let result = await filmePublicadorDAO.setUpdateFilmsPublishers(filmePublicador)

                    if (result) {

                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = filmePublicador

                        return MESSAGE.HEADER //201

                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarId
                }
            } else {
                return validarDados //400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

const excluirFilmePublicadorByFilmeId = async function (filmeId) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (filmeId != '' && filmeId != null && filmeId != undefined && !isNaN(filmeId) && filmeId > 0) {
            let result = await filmePublicadorDAO.setDeleteFilmsPublishersByFilmeId(filmeId)

            if (result) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETED_ITEM.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETED_ITEM.status_code
                MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETED_ITEM.message
                delete MESSAGE.HEADER.response
    
                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [FILME_ID] invalido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
        
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

const excluirFilmePublicador = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await buscarFilmePublicadorId(id)

        if (validarID.status_code == 200) {
            let result = await filmePublicadorDAO.setDeleteFilmsPublishers(id)

            if (result) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETED_ITEM.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETED_ITEM.status_code
                MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETED_ITEM.message
                delete MESSAGE.HEADER.response

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            return validarID //A resposta do ValidarId já especifica onde está o erro
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Validação dos dados de cadastro do Filme
const validarDadosFilmePublicador = async function (filmePublicador) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (filmePublicador.filme_id == '' || filmePublicador.filme_id == null || filmePublicador.filme_id == undefined || isNaN(filmePublicador.filme_id) || filmePublicador.filme_id <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [FILME_ID] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (filmePublicador.publicador_id == '' || filmePublicador.publicador_id == null || filmePublicador.publicador_id == undefined || isNaN(filmePublicador.publicador_id) || filmePublicador.publicador_id <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [GENERO_ID] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else {
        return false
    }

}



module.exports = {
    listarFilmesPublicadores,
    listarFilmesPublicadorId,
    buscarFilmePublicadorId,
    listarPublicadoresFilmeId,
    inserirFilmePublicador,
    atualizarFilmePublicador,
    excluirFilmePublicador,
    excluirFilmePublicadorByFilmeId
}