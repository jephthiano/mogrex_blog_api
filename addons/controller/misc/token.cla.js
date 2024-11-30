const jwt = require('jsonwebtoken');

const { User: UserSch } = require(SCHEMA + 'schema');

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

        //return enc token
        return Security.sel_encry(token, 'token');
    }

    static async verifyToken(req, res, next){
        let response = false;

        //get  token from the cookie [decrypt]
        const token = Security.sel_decry(req.cookies.token, 'token');
        
        if (token) {
            try{
                var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                console.log(token)
                if (decoded.id) {
                    //get the user details and pass it into req
                    const userData = await UserSch.findOne({ where: {user_code: decoded.id } });
                    if (userData) { 
                        //if user is not suspended
                        if (userData.status === 'active') {
                            //set user data and token into req
                            req.data['token'] = token;
                            req.data['userData'] = userData;
                            response = true
                        }
                    }
                }
            } catch (err) {
                Token.logError(err);
            }
        }

        //if everything is fine
        if (response) {
            next();
        } else {
            const status = "invalid";
            const message = "Failed";
            const messageDetail = "Unauthorized request/connection";
            let rawResponse = {status, message, messageDetail};

            Security.returnResponse(res, req, rawResponse);
            return;
        }
    }
}

module.exports = Token;