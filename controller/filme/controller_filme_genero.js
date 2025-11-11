/*********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model (Validações, tratamento de dados, tratamento de erros, etc) para o CRUD de Filme e Genero
 * Data: 05/11/2025
 * Autor: Eduardo Feitosa
 * Versão: 2.0
 **********************************************************************************************/
//Import do arquivo DAO para manipular o CRUD do Filme Genero no BD
const filmeGeneroDAO = require('../../model/dao/filme_genero.js')

//Import do arquivo que contem a padronização das mensagens
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Retorna uma lista de todos os filmes e generos
const listarFilmesGeneros = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista dos filmes generos do BD
        let result = await filmeGeneroDAO.getSelectAllFilmsGenre()

        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.total_film_genres = result.length
                MESSAGE.HEADER.response.film_genres = result

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
const buscarFilmeGeneroId = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatorio
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await filmeGeneroDAO.getSelectByIdFilmGenre(id)

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_genre = result

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
const listarGenerosFilmeId = async function (filmeId) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatorio
        if (filmeId != '' && filmeId != null && filmeId != undefined && !isNaN(filmeId) && filmeId > 0) {
            //Chama a função para filtrar pelo ID
            let result = await filmeGeneroDAO.getSelectGenresByFilmeId(filmeId)

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.genres = result

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
const listarFilmesGeneroId = async function (generoId) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatorio
        if (generoId != '' && generoId != null && generoId != undefined && !isNaN(generoId) && generoId > 0) {
            //Chama a função para filtrar pelo ID
            let result = await filmeGeneroDAO.getSelectFilmsByGeneroId(generoId)

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
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [GENERO_ID] invalido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

const inserirFilmeGenero = async function (filmeGenero, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilmeGenero(filmeGenero)

            if (!validarDados) {
                // Chama a função do DAO para inserir um novo filme
                let result = await filmeGeneroDAO.setInsertFilmsGenres(filmeGenero)

                if (result) {
                    //Chama a função para receber o ID gerado no BD
                    let lastIdFilmeGenero = await filmeGeneroDAO.getSelectLastIdFilmGenre()

                    if (lastIdFilmeGenero) {
                        //Adiciona no JSON de filme o ID que foi gerado pelo BD
                        filmeGenero.id = lastIdFilmeGenero

                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = filmeGenero

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

const atualizarFilmeGenero = async function (filmeGenero, id, contentType) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilmeGenero(filmeGenero)

            if (!validarDados) {

                let validarId = await buscarFilmeGeneroId(id)

                if (validarId.status_code == 200) {
                    // Chama a função do DAO para inserir um novo filme
                    let result = await filmeGeneroDAO.setUpdateFilmsGenres(filmeGenero)

                    if (result) {

                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = filmeGenero

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

const excluirFilmeGenero = async function (id) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await buscarFilmeGeneroId(id)

        if (validarID.status_code == 200) {
            let result = await filmeGeneroDAO.setDeleteFilmsGenres(id)

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
const validarDadosFilmeGenero = async function(filmeGenero) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(filmeGenero.filme_id == '' || filmeGenero.filme_id == null || filmeGenero.filme_id == undefined || isNaN(filmeGenero.filme_id) || filmeGenero.filme_id <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [FILME_ID] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if(filmeGenero.genero_id == '' || filmeGenero.genero_id == null || filmeGenero.genero_id == undefined || isNaN(filmeGenero.genero_id) || filmeGenero.genero_id <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [GENERO_ID] invalido`
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else{
        return false
    }

}



module.exports = {
    listarFilmesGeneros,
    buscarFilmeGeneroId,
    listarFilmesGeneroId,
    listarGenerosFilmeId,
    inserirFilmeGenero,
    atualizarFilmeGenero,
    excluirFilmeGenero
}