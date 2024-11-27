const jwt = require('jsonwebtoken');

const User = require(SCHEMA + 'user.schema');

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');

class Token {

    static logInfo(type, data){
        General.log(type,data,'info')
    }

    static logError(type, data){
        General.log(type,data,'error')
    }

    

    static setToken(id){
        const token = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY);

        // set token into cookie

        // return token;
    }

    static async verifyToken(req, res, next){
        let response = false;
        const auth = req.headers.authorization;
        const token = Token.getToken(auth);

        if(token){
            try{
                var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                if(decoded.id){
                    //get the user details and pass it into req
                    const userData = await User.findOne({_id : decoded.id});
                    if(userData){
                        //if user is not suspended
                        if(userData.status !== 'suspended'){
                            req.data['token'] = token;
                            req.data['userData'] = userData;
                            response = true
                        }
                    }
                }
            }catch(err){
                Token.logError(err);
            }
        }
        if(response){
            next();
        }else{
            const status = "invalid";
            const message = "Invalid request/connection";
            let rawResponse = {status, message};

            Security.returnResponse(res, req, rawResponse);
            return;
        }
    }

    static async verifyApiToken(req, res, next){
        //check if instance is valid
        //check if user sub_start has not expired
        //check if instance is active
        next();
    }

    static getToken(auth){
        let response = false;
        if(auth && auth.startsWith('bearer')){
            response = auth.split(' ')[1] ?? false;
        }

        return response;
    }
}

module.exports = Token;