const { User: UserSch } = require(SCHEMA + 'schema');
const { Op } = require('sequelize');

const Security = require(MISC_CON + 'security.cla');
const General = require(MISC_CON + 'general.cla');
const Messaging = require(MISC_CON + 'messaging.cla');


class Auth {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.userData = this.req.data.userData;
        this.input = this.req.data.input;

        this.response = {
            status:false,
            message: "failed",
            messageDetail: "Request failed",
            responseData:{},
            errorData:{}
        }
    }

    static logInfo(type, data){
        General.log(type,data,'info');
    }

    static logError(type, data){
        General.log(type,data,'error');
    }

    // LOGIN
    async login() {
        this.response['message'] = "Incorrect login details";
        this.response['messageDetail'] = "Check your login details and try again.";
        try {
            const {login_id , password} = this.input;
            const where = {[Op.or]: [{ username: login_id }, { email: login_id }]};
            const result = await UserSch.findOne({where});
            
            //if result is found
            if (result) {
                const { password: db_password, status: userStatus, user_code } = result.dataValues;

                if (Security.verify_password(password, db_password)) {
                    if (userStatus === 'suspended') {
                        this.response['message'] = "Your account has been suspended";
                        this.response['messageDetail'] = "Contact admin for more information";
                    } else {
                        //get userData and remove password, id and user_code
                        const userData = result.dataValues;
                        delete userData.password
                        delete userData.user_code
                        
                        if (userData) {
                            this.response['status'] = true;
                            this.response['id'] = user_code;
                            this.response['message'] = "Success";
                            this.response['messageDetail'] = "Login successful";
                            this.response['responseData'] = userData;
                        }
                    }
                }
            }

        } catch (err) {
            this.response['message'] = "Login failed";
            Auth.logError('Login [AUTH CLASS]', err);
        }

        return this.response;
    }

    // REGISTER
    async register(regType) {
        this.response['messageDetail'] = "Registration failed";
        try {
            //set unique_id and user_code into input
            this.input.unique_id = Security.generateUniqueId(10);
            this.input.user_code = Security.generateUniqueToken()

            let result = await UserSch.create(this.input);
            // data is stored
            if (result) {
                //get userData 
                const userData = result.dataValues;
                const { user_code } = userData;
                
                //remove password, id and user_code
                delete userData.password
                delete userData.user_code
                
                if (userData) {
                    //set response
                    this.response['status'] = true;
                    this.response['id'] = user_code;
                    this.response['message'] = "Success";
                    this.response['messageDetail'] = "Account successfully created";
                    this.response['responseData'] = userData;
                    
                    //send email
                    const messageData = {
                        name: this.input.first_name,
                        receiver : this.input.email,
                        subject : Messaging.subjectTemplate('welcome'),
                        message: Messaging.messageTemplate('welcome', 'email')
                    }
                    Messaging.sendEmail(messageData);
                }
            }
        } catch (err) {
            Auth.logError('Register [AUTH CLASS]', err);
        }

        return this.response;
    }
}

module.exports = Auth;