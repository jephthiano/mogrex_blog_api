const General = require(MISC_CON + 'general.cla');
const { User, Post, Comment, Reply, Like } = require(SCHEMA + 'schema');

class Database {

    static logInfo(type, data){
        General.log(type,data,'info')
    }

    static logError(type, data){
        General.log(type,data,'error')
    }

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