/*********************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de filme_genero no Banco de Dados MySQL
 * Data: 05/11/2025
 * Autor: Eduardo Feitosa
 * Versão: 2.0
 **********************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllFilmsGenre = async function() {
    try {
        let sql = 'select * from tb_filme_genero order by filme_genero_id desc'

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

const getSelectByIdFilmGenre = async function(id) {
    try {
        let sql = `select * from tb_filme_genero where filme_genero_id=${id}`

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

//Retorna os generos filtrando pelo ID do filme do banco de dados
const getSelectGenresByFilmeId = async function(filmeId) {
    try {
        let sql = `select tb_genero.genero_id, tb_genero.nome 
                        from tb_filme 
                            inner join tb_filme_genero 
                                on tb_filme.id = tb_filme_genero.filme_id 
                            inner join tb_genero 
                                on tb_genero.genero_id = tb_filme_genero.genero_id 
                        where tb_filme.id=${filmeId}`

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

//Retorna os filmes filtrando pelo ID do genero do banco de dados
const getSelectFilmsByGeneroId = async function(generoId) {
    try {
        let sql = `select tb_filme.id, tb_filme.nome 
                        from tb_filme 
                            inner join tb_filme_genero 
                                on tb_filme.id = tb_filme_genero.filme_id 
                            inner join tb_genero 
                                on tb_genero.id = tb_filme_genero.genero_id 
                        where tbl_genero.genero_id=${generoId}`

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

const getSelectLastIdFilmGenre = async function() {
    try {
        let sql = 'select filme_genero_id from tb_filme_genero order by filme_genero_id desc limit 1'

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

const setInsertFilmsGenres = async function(filmeGenero) {
    try {
        let sql = `insert into tb_filme_genero(filme_id, genero_id) values (${filmeGenero.filme_id}, ${filmeGenero.genero_id})`

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

const setUpdateFilmsGenres = async function(filmeGenero) {
    try {
        let sql = `update tb_filme_genero set filme_id = ${filmeGenero.filme_id}, genero_id = ${filmeGenero.genero_id} where filme_genero_id = ${filmeGenero.id}`

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

const setDeleteFilmsGenres = async function(id) {
    try {
        let sql = `delete from tb_filme_genero where filme_genero_id=${id}`

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
    getSelectAllFilmsGenre,
    getSelectByIdFilmGenre,
    getSelectGenresByFilmeId,
    getSelectFilmsByGeneroId,
    getSelectLastIdFilmGenre,
    setInsertFilmsGenres,
    setUpdateFilmsGenres,
    setDeleteFilmsGenres
}