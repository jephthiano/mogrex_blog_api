const DB = require(MISC_CON + 'database.cla');
const UserSch = require(SCHEMA + 'user.schema');

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


    static async su_send_otp (inputs){
        let error = {}
        let errRes = { status: true, data: {} }
        const { receiving_medium, veri_type } = inputs;

        let enc_rece = Security.sel_encry(receiving_medium, 'email');
        const data_exits = await UserSch.findOne(
            {$or: [{ mobile_number: enc_rece }, { email: enc_rece }]},
            'first_name'
        );
        const resType = (veri_type === 'email') ? veri_type : "mobile number";
    
        //check if email is empty
        if(!receiving_medium || General.isEmptyString(receiving_medium)){
            error['receiving_medium'] = `field is required`;
        }else if(data_exits){
            error['receiving_medium'] = `${resType} already taken`;
        }else{
            if(veri_type === 'email'){
                if((!Security.validate_input(receiving_medium, 'email'))){
                    error['receiving_medium'] = "invalid email";
                }
            }else{
                if((!Security.validate_input(receiving_medium, 'mobile_number'))){
                    error['receiving_medium'] = "invalid mobile number";
                }
            }
        }

        //if there is no error
        if(General.isEmptyObject(error)){
            errRes['status'] = false;
        }else{
            errRes['data'] = error
        }

        return errRes;
    }

    static verify_otp (inputs){
        let error = {}
        let errRes = { status: true, data: {} }
        const { code } = inputs;

        //check if code is valid
        if(!code || !Security.validate_input(code, 'otp_code')){
            error['code'] = "invalid otp code";
        }
    
        //if there is no error
        if(General.isEmptyObject(error)){
            errRes['status'] = false;
        }else{
            errRes['data'] = error
        }

        return errRes;
    }


    static async register (inputs, regType){
        let error = {}
        let errRes = { status: true, data: {} }
        let { receiving_medium, veri_type, email, mobile_number, first_name, last_name, username, gender, password, confirm_password } = inputs;
        
        const enc_email = Security.sel_encry(email, 'email');
        const enc_username = Security.sel_encry(username, 'username');
        const enc_mobile_number = Security.sel_encry(mobile_number, 'mobile_number');

        const email_exists = await DB.findSingleValue('User','email',enc_email,'email');
        const mobile_exists = await DB.findSingleValue('User','mobile_number',enc_mobile_number,'mobile_number');
        const username_exists = await DB.findSingleValue('User','username',enc_username,'username');

        //FOR MUTLI
        if(regType && regType === 'multi'){
            
            if(veri_type === 'email'){
                //check if mobile number is empty
                if(!mobile_number || General.isEmptyString(mobile_number)){
                    error['mobile_number'] = "mobile number is required";
                }else if(!Security.validate_input(mobile_number, 'mobile_number')){
                    error['mobile_number'] = "invalid mobile number";
                }else if (mobile_exists){
                    error['mobile_number'] = "mobile number already exists";
                }
                
            }else{
                //check if email is empty
                if(!email || General.isEmptyString(email)){
                    error['email'] = "email is required";
                }else if(!Security.validate_input(email, 'email')){
                    error['email'] = "invalid email";
                }else if (email_exists){
                    error['email'] = "email already exists";
                }
            }
        }else{
            //FOR SINGLE

            //check if email is empty
            if(!email || General.isEmptyString(email)){
                error['email'] = "email is required";
            }else if(!Security.validate_input(email, 'email')){
                error['email'] = "invalid email";
            }else if (email_exists){
                error['email'] = "email already exists";
            }

            //check if mobile number is empty
            if(!mobile_number || General.isEmptyString(mobile_number)){
                error['mobile_number'] = "mobile number is required";
            }else if(!Security.validate_input(mobile_number, 'mobile_number')){
                error['mobile_number'] = "invalid mobile number";
            }else if (mobile_exists){
                error['mobile_number'] = "mobile number already exists";
            }
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

        //check for gender
        if(!gender || (gender !== 'male' && gender !== 'female')){
            error['gender'] = "invalid gender";   
        }

        //check if password is empty
        if(!password || General.isEmptyString(password)){
            error['password'] = "password is required";
        }else if(!Security.validate_password(password)){
            error['password'] = "password must be 8 or more characters, contain at least one uppercase, lowercase, digit and special character";
        }
        // else if(password !== confirm_password){
        //     error['password'] = "passwords not match";
        // }

        //if there is no error
        if(General.isEmptyObject(error)){
            errRes['status'] = false;
        }else{
            errRes['data'] = error
        }

        return errRes;
    }

    static async fp_send_otp (inputs){
        let error = {}
        let errRes = { status: true, data: {} }
        const { receiving_medium } = inputs;

        let enc_rece = Security.sel_encry(receiving_medium, 'email');
        const where = {$or: [{ mobile_number: enc_rece }, { email: enc_rece }]};
        const data_exits = await UserSch.findOne(where, 'first_name');
        
        //check if email is empty
        if(!receiving_medium || General.isEmptyString(receiving_medium)){
            error['receiving_medium'] = "email/mobile number is required";
        }else if (!data_exits){
            error['receiving_medium'] = "email/mobile number does not exist";
        }
    
        //if there is no error
        if(General.isEmptyObject(error)){
            errRes['status'] = false;
            errRes['data'] = data_exits;
        }else{
            errRes['data'] = error
        }

        return errRes;
    }


    static reset_password (inputs){
        let error = {}
        let errRes = { status: true, data: {} }
        const { password, confirm_password } = inputs;

        if(!Security.validate_password(password)){
            //check if password is secure
            error['password'] = "password must be 8 or more characters, contain at least one uppercase, lowercase, digit and special character";
        }else if(password !== confirm_password){
            //check if new password and confirm password are not the same
            error['password'] = "password not match";
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