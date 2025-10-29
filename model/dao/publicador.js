/*********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de diretor no Banco de Dados MySQL
 * Data: 29/10/2025
 * Autor: Eduardo Feitosa
 * Versão: 1.0
 **********************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllPublisher = async function() {
    try {
        let sql = 'select * from tb_publicador order by publicador_id desc'

        let result = await prisma.$queryRawUnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectByIdPublisher = async function(id) {
    try {
        let sql = `select * from tb_publicador where publicador_id = ${id}`

        let result = prisma.$queryRawUnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectLastIdPublisher = async function() {
    try {
        let sql = 'select publicador_id from tb_ator order by publicador_id desc limit 1'

        let result = await prisma.$queryRawUnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const setInsertPublisher = async function(publicador) {
    try {
        let sql = ''
        if(publicador.data_fundacao == null){
            sql = `insert into tb_publicador(nome, data_fundacao, is_ativa, logradouro, cidade, estado, pais)
                    values('${publicador.nome}', '${publicador.data_fundacao}', '${publicador.is_ativa}', 
                            '${publicador.logradouro}', '${publicador.cidade}', '${publicador.estado}', '${publicador.pais}')`
        }else{
            sql = `insert into tb_publicador(nome, data_fundacao, is_ativa, logradouro, cidade, estado, pais)
                    values('${publicador.nome}', '${publicador.data_fundacao}', '${publicador.is_ativa}', 
                        '${publicador.logradouro}', '${publicador.cidade}', '${publicador.estado}', '${publicador.pais}')`
        }

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
    
}

const setUpdatePublisher = async function(publicador) {
    try {
        let sql = ''
        if(publicador.data_fundacao == null){
            sql = `update tb_publicador set nome = '${publicador.nome}', data_fundacao = ${publicador.data_fundacao}, is_ativa = ${publicador.is_ativa}, 
                logradouro = '${publicador.logradouro}', cidade = '${publicador.cidade}', estado = '${publicador.estado}', pais = '${publicador.pais}'`
        }else{
            sql = `update tb_publicador set nome = '${publicador.nome}', data_fundacao = '${publicador.data_fundacao}', is_ativa = ${publicador.is_ativa}, 
            logradouro = '${publicador.logradouro}', cidade = '${publicador.cidade}', estado = '${publicador.estado}', pais = '${publicador.pais}'`
        }

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const setDeletePublisher = async function(id) {
    try {
        let sql = `delete from tb_publicador where publicador_id = ${id}`
        
        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return result

        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllPublisher,
    getSelectByIdPublisher,
    getSelectLastIdPublisher,
    setInsertPublisher,
    setUpdatePublisher,
    setDeletePublisher
}