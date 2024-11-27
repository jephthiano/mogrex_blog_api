const UserSch = require(SCHEMA + 'user.schema');

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
            message_detail: "Request failed",
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
        this.response['message_detail'] = "Check your login details and try again.";
        try{
            const {login_id , password} = this.input;
            const where = {$or: [{ username: login_id }, { email: login_id }]};
            const result = await UserSch.findOne(where, 'password status');
            
            //if result is found
            if (result) {
                const { password: db_password, status: userStatus } = result;

                if(Security.verify_password(password, db_password)){
                    if(userStatus === 'suspended'){
                        this.response['message'] = "Your account has been suspended";
                        this.response['message_detail'] = "Contact admin for more information";
                    }else{
                        this.response['status'] = true;
                        this.response['message'] = "Success";
                        this.response['message_detail'] = "Login successful";
                    }
                }
            }

        }catch(err){
            this.response['message'] = "Login failed";
            Auth.logError('Login [AUTH CLASS]', err);
        }

        return this.response;
    }

    // REGISTER
    async register(regType) {
        this.response['message_detail'] = "Registration failed";
        try{
            let result = await UserSch.create(this.input);

            // data is stored
            if(result){
                //set response
                this.response['status'] = true;
                this.response['message'] = "Success";
                this.response['message_detail'] = "Account successfully created";
                
                //send email
                const messageData = {
                    name: this.input.first_name,
                    receiver : this.input.email,
                    subject : Messaging.subjectTemplate('welcome'),
                    message: Messaging.messageTemplate('welcome', 'email')
                }
                Messaging.sendEmail(messageData)
            }
        }catch(err){
            Auth.logError('Register [AUTH CLASS]', err);
        }

        return this.response;
    }
}

module.exports = Auth;