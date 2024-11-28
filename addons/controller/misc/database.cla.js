const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

const General = require(MISC_CON + 'general.cla');
const { User, Post, Comment, Reply, Like } = require(SCHEMA + 'schema');

class Database {

    static logInfo(type, data){
        General.log(type,data,'info')
    }

    static logError(type, data){
        General.log(type,data,'error')
    }

    
    static async dbConn (){
        await mongoose.connect(process.env.MONGODB_URI)
        .then((conn) =>{
            console.log("Database connection successful");
        })
        .catch((err) => {
            Database.logError("DBconn [DATABASE CLASS]",err);
            console.log("Error occurred while connecting to database")
        })
    }

    static async seqDBConn() {
        const sequelize = new Sequelize('mogrex_blog', 'root', 'jephthahJEHOVAHgod332$', {
            host: 'localhost',
            dialect: 'mysql'
        });

        (async () => {
            try {
                await sequelize.authenticate();
                console.log('Connection has been established successfully.');
            } catch (error) {
                console.error('Unable to connect to the database:', error);
            }
        })();
    }

    // static async findSingleValue (coll, field, param, select){
    //     let response = false;
    //     try{
    //         const result = await eval(coll).findOne({[field] : param}, select);
    //         if(result) response = await result[select];
    //     }catch(err){
    //         Database.logError("findSingleValue [DATABASE CLASS]", err);
    //     }
    //     return response;
    // }

    static async findSingleValue (coll, field, param, select){
        let response = false;
        try {
            const result = await eval(coll).findOne({
                attributes: [select],
                where: { [field]: param }
            });
            if(result) response = result[select];
        }catch(err){
            Database.logError("findSingleValue [DATABASE CLASS]", err);
        }
        return response;
    }
}

module.exports = Database;