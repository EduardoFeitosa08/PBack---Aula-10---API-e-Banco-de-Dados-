/*********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de genero no Banco de Dados MySQL
 * Data: 01/10/2025
 * Autor: Eduardo Feitosa
 * Versão: 1.0
 **********************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllGenre = async function() {
    try {
        let sql = 'select * from tb_genero order by genero_id desc'

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectByIdGenre = async function(id) {
    try {
        let sql = `select genero_id from tb_genero where genero_id=${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectLastIdGenre = async function() {
    try {
        let sql = 'select genero_id from tb_genero order by genero_id desc limit 1'

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return result
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const setInsertGenre = async function(genero) {
    try {
        let sql = `insert into tb_genero(nome) values ('${genero.nome}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const setUpdateGenre = async function(genero) {
    try {
        let sql = `update tb_filme set nome = '${genero.nome}' where genero_id = ${genero.id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

const setDeleteGenre = async function(id) {
    try {
        let sql = `delete from tb_genero where genero_id=${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllGenre,
    getSelectByIdGenre,
    getSelectLastIdGenre,
    setInsertGenre,
    setUpdateGenre,
    setDeleteGenre
}