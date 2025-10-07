/*********************************************************************************************
 * Objetivo: Arquivo responsável pela padronização de todas as mensagens da API do projeto de Filmes
 * Data: 07/10/2025
 * Autor: Eduardo Feitosa
 * Versão: 1.0
 **********************************************************************************************/

const dataAtual = new Date()

/************************ MENSAGENS DE PADRONIZAÇÃO DO PROJETO **********************************/
const MESSAGE_HEADER = {
    status: Boolean,
    status_code: Number,
    development: 'Eduardo Feitosa Batista',
    api_description: 'API para manipular dados da locadora de filmes',
    version: '1.0.10.25',
    request_date: dataAtual.toLocaleString(),
    response: {}
}


/************************ MENSAGENS DE ERRO DO PROJETO ******************************************/



/************************ MENSAGENS DE SUCESSO DO PROJETO ***************************************/
const MESSAGE_SUCCESS_REQUEST = {status: true, status_code: 200, message: 'Requisição bem sucedida!!!'}





module.exports = {
    MESSAGE_HEADER,
    MESSAGE_SUCCESS_REQUEST
}