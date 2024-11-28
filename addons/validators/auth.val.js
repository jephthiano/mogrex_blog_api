const DB = require(MISC_CON + 'database.cla');

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');

class Auth {
    static login (inputs){
        let error = {}
        let errRes = { status: true, data: {} }
        const { login_id, password } = inputs;
    
        //check if login id is empty
        if(!login_id || General.isEmptyString(login_id)){
            error['login_id'] = "login id cannot be empty";
        }

        //check if password is empty
        if(!password || General.isEmptyString(password)){
            error['password'] = "password cannot be empty";
        }

        //if there is no error
        if(General.isEmptyObject(error)){
            errRes['status'] = false;
        }else{
            errRes['data'] = error
        }

        return errRes;
    }

    static async register (inputs){
        let error = {}
        let errRes = { status: true, data: {} }
        let { email, username, first_name, last_name, password } = inputs;
        
        const email_exists = await DB.findSingleValue('User','email',email,'email');
        const username_exists = await DB.findSingleValue('User','username',username,'username');

        //check if email is empty
        if(!email || General.isEmptyString(email)){
            error['email'] = "email is required";
        }else if(!Security.validate_input(email, 'email')){
            error['email'] = "invalid email";
        }else if (email_exists){
            error['email'] = "email already exists";
        }

        //check if username is empty
        if(!username || General.isEmptyString(username)){
            error['username'] = "username is required";
        }else if(!Security.validate_input(username, 'username')){
            error['username'] = "username should be between 5 to 10 alphabets";
        }else if (username_exists){
            error['username'] = "username already taken";
        }

        //check if first name is empty
        if(!first_name || General.isEmptyString(first_name)){
            error['first_name'] = "first_name is required";
        }else if(!Security.validate_input(first_name, 'name')){
            error['first_name'] = "invalid first name";
        }

        //check if last name is empty
        if(!last_name || General.isEmptyString(last_name)){
            error['last_name'] = "last_name is required";
        }else if(!Security.validate_input(last_name, 'name')){
            error['last_name'] = "invalid last name";
        }

        //check if password is empty
        if(!password || General.isEmptyString(password)){
            error['password'] = "password is required";
        }else if(!Security.validate_password(password)){
            error['password'] = "password must be 8 or more characters, contain at least one uppercase, lowercase, digit and special character";
        }

        //if there is no error
        if(General.isEmptyObject(error)){
            errRes['status'] = false;
        }else{
            errRes['data'] = error
        }

        return errRes;
    }
}

module.exports = Auth;