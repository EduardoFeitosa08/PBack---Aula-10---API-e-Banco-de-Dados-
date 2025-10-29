/*********************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o APP e a Model (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 29/10/2025
 * Autor: Eduardo Feitosa
 * Versão: 1.0
 **********************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const diretorDAO = require("../../model/dao/diretor.js");

//Import do arquivo que padroniza todas as mensagens
const MESSAGE_DEFAULT = require("../modulo/config_messages.js");

const listarDiretores = async function () {
  //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    //Chama a função do DAO para retornar a lista de diretores
    let result = await diretorDAO.getSelectAllDirector();

    if (result) {
      if (result.length > 0) {
        MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status;
        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code;
        MESSAGE.HEADER.response.total_actors = result.length;
        MESSAGE.HEADER.response.directors = result;

        return MESSAGE.HEADER; //200
      } else {
        return MESSAGE.ERROR_NOT_FOUND; //404
      }
    } else {
      return MESSAGE.ERROR_INTERNAL_SERVER_MODEL; //500
    }
  } catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

const buscarDiretorId = async function (id) {
  //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (id != "" && id != null && id != undefined && !isNaN(id) && id > 0) {
      let result = await diretorDAO.getSelectByIdDirector(id);

      if (result) {
        if (result.length > 0) {
          MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status;
          MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code;
          MESSAGE.HEADER.response.directors = result;

          return MESSAGE.HEADER; //200
        } else {
          return MESSAGE.ERROR_NOT_FOUND; //404
        }
      } else {
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL;
      }
    } else {
      MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [ID] invalido`;
      return MESSAGE.ERROR_REQUIRED_FIELDS; //400
    }
  } catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

const inserirDiretor = async function (diretor, contentType) {
  //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (String(contentType).toUpperCase() === "APPLICATION/JSON") {
      let validarDados = validarDadosDiretor(diretor)

      if (!validarDados) {
        let result = await diretorDAO.setInsertDirector(diretor)

        if (result) {

          // MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
          // MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
          // MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
          // MESSAGE.HEADER.response = diretor

          // return MESSAGE.HEADER

          let lastIdDiretor = await diretorDAO.getSelectLastIdDirector()

          if(lastIdDiretor){
              //Adiciona no JSON de ator o ID que foi gerado pelo BD
              diretor.id = lastIdDiretor

              MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
              MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
              MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
              MESSAGE.HEADER.response = diretor

              return MESSAGE.HEADER
          }else{
              return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
          }

        } else {

          return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }

      } else {
        return validarDados
      }

    } else {
      return MESSAGE.ERROR_CONTENT_TYPE //415
    }

  } catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

const atualizarDiretor = async function(diretor, id, contentType) {
  //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  try {
    if (String(contentType).toUpperCase() === "APPLICATION/JSON"){
      let validarId = await buscarDiretorId(id)

      if(validarId.status_code == 200){

        let validarDados = validarDadosDiretor(diretor)

        if(!validarDados){
          //Adicionando o ID no JSON com os dados do ator
          diretor.id = parseInt(id)

          let result = await diretorDAO.setUpdateDirector(diretor)

          if(result){
            MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
            MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
            MESSAGE.HEADER.response = diretor

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

const excluirDiretor = async function(id) {
  //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

  try {
    let validarId = await buscarDiretorId(id)

    if(validarId.status_code == 200){
      let result = await diretorDAO.setDeleteDirector(id)

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
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
  }

}

const validarDadosDiretor = function (diretor) {
  let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

  if (diretor.nome == "" || diretor.nome == null || diretor.nome == undefined || diretor.nome.length > 100) {

    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [NOME] invalido`;
    return MESSAGE.ERROR_REQUIRED_FIELDS; //400

  } else if (diretor.genero == "" || diretor.genero == null || diretor.genero == undefined || diretor.genero.length > 100) {

    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [GENERO] invalido`;
    return MESSAGE.ERROR_REQUIRED_FIELDS; //400

  } else if (diretor.data_nascimento == "" || diretor.data_nascimento == null || diretor.data_nascimento == undefined || diretor.data_nascimento.length != 10) {

    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [DATA_NASCIMENTO] invalido`;
    return MESSAGE.ERROR_REQUIRED_FIELDS; //400

  } else if (diretor.img == "" || diretor.img == undefined || diretor.img.length > 200) {

    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [IMG] invalido`;
    return MESSAGE.ERROR_REQUIRED_FIELDS; //400

  } else if (diretor.data_morte == null) {

    return false;

  } else if (diretor.data_morte == "" || diretor.data_morte == undefined || diretor.data_morte.length != 10) {

    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = `Atributo [DATA_MORTE] invalido`;
    return MESSAGE.ERROR_REQUIRED_FIELDS; //400

  } else {
    return false;
  }
};

module.exports = {
  listarDiretores,
  buscarDiretorId,
  inserirDiretor,
  atualizarDiretor,
  excluirDiretor
}