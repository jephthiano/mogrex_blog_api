const mongoose = require('mongoose');

const General = require(MISC_CON + 'general.cla');
const User = require(SCHEMA + 'user.schema');

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

    static async findSingleValue (coll, field, param, select){
        let response = false;
        try{
            const result = await eval(coll).findOne({[field] : param}, select);
            if(result) response = await result[select];
        }catch(err){
            Database.logError("findSingleValue [DATABASE CLASS]", err);
        }
        return response;
    }
}

module.exports = Database;