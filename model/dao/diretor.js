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

const getSelectAllDirector = async function() {
    try {
        let sql = 'select * from tb_diretor order by diretor_id desc'

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

const getSelectByIdDirector = async function(id) {
    try {
        let sql = `select * from tb_diretor where diretor_id =${id}`

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

const getSelectLastIdDirector = async function() {
    try {
        let sql = 'select diretor_id from tb_diretor order by diretor_id desc limit 1'

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

const setInsertDirector = async function(diretor) {
    try {

        //Validando o atributo data_morte, onde se ele ser nulo enviará o script sem as aspas somente nesse atributo
        //Para assim não ter conflito no tamanho da data
        //Se ele não ser nulo enviará o script com as aspas naquele atributo

        let sql = ''
        if(diretor.data_morte == null){
            sql = `insert into tb_diretor(nome, genero, data_nascimento, data_morte, img_diretor)
                    values('${diretor.nome}', '${diretor.genero}', '${diretor.data_nascimento}', ${diretor.data_morte}, '${diretor.img}')`
        }else{
            sql = `insert into tb_diretor(nome, genero, data_nascimento, data_morte, img_diretor)
                    values('${diretor.nome}', '${diretor.genero}', '${diretor.data_nascimento}', '${diretor.data_morte}', '${diretor.img}')`
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

const setUpdateDirector = async function(diretor) {
    try {
        let sql = ''
        if(diretor.data_morte == null){
            sql = `update tb_diretor set nome = '${diretor.nome}', genero = '${diretor.genero}', data_nascimento = '${diretor.data_nascimento}', 
            data_morte = ${diretor.data_morte}, img_diretor = '${diretor.img}'
            where diretor_id = ${diretor.id}`
        }else{
            sql = `update tb_diretor set nome = '${diretor.nome}', genero = '${diretor.genero}', data_nascimento = '${diretor.data_nascimento}', 
            data_morte = '${diretor.data_morte}', img_diretor = '${diretor.img}'
            where diretor_id = ${diretor.id}`
        }

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return result
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

const setDeleteDirector = async function(id) {
    try {
        let sql = `delete from tb_diretor where diretor_id = ${id}`

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
    getSelectAllDirector,
    getSelectByIdDirector,
    getSelectLastIdDirector,
    setInsertDirector,
    setUpdateDirector,
    setDeleteDirector
}