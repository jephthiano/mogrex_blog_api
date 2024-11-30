const crypto = require("crypto");
const cryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');
const validator = require('validator');
require('dotenv').config();

const General = require(MISC_CON + 'general.cla');

const key = process.env.ENC_KEY;
const iv = process.env.ENC_IV;
const method = process.env.ENC_METHOD;// Encryption method
const cost = 10;
const enc_array = ['general', 'token'];

class Security {

    static logInfo(data){
        General.log('Security',data,'info')
    }

    static logError(data){
        General.log('Security',data,'error')
    }

    static returnResponse(res, req, data){
        let response = {data}
        res.status(200).json(response);
        return;
    }

    static hash_password (password){
        return bcrypt.hashSync(password, cost);
    }

    static verify_password(plainPassword, hashedPassword){
        plainPassword = (typeof plainPassword === 'string') ? plainPassword : "" ;
        hashedPassword = (typeof hashedPassword === 'string') ? hashedPassword : "" ;
        
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }

    static sel_encry(data, type='general'){
        if(enc_array.includes(type)){
            data = this.encrypt(data);
        }

        return data;
    }

    static sel_decry(data, type='general'){
        if(enc_array.includes(type)){
            data = this.decrypt(data);
        }

        return data;
    }

    static encrypt(data){
        const encrypted = cryptoJS.AES.encrypt(
            data, 
            cryptoJS.enc.Utf8.parse(key), 
            {iv: cryptoJS.enc.Utf8.parse(iv)}
        ).toString();

        return encrypted;
    }

    static decrypt(data){
        const decrypted = cryptoJS.AES.decrypt(
            data, 
            cryptoJS.enc.Utf8.parse(key), {
            iv: cryptoJS.enc.Utf8.parse(iv)
        }).toString(cryptoJS.enc.Utf8);

        return decrypted;
    }

    static validate_input(data, type){
        let result = false
        if(type === 'email') result = validator.isEmail(data);  
        if(type === 'name') result = validator.isAlpha(data) && validator.isLength(data, { min: 1, max: 50 });    
        if(type === 'username') result = validator.isAlpha(data) && validator.isLength(data, { min: 5, max: 10 });    
        return result;
    }

    static validate_password(password){
        // if capital letter is not found
        if(!(/[A-Z]/.test(password))){
            return false
        }

        // if small letter is not found
        if(!(/[a-z]/.test(password))){
            return false
        }

        // if digit is not found
        if(!(/[0-9]/.test(password))){
            return false
        }
        
        // if character is not found
        if(!(/[-+_!@#$%^&*.,?]/.test(password))){
            return false
        }

        // if password length is less than 8
        if(password.length < 8){
            return false;
        }
        
        return true;
    }

    static generateUniqueToken (){
        return crypto.randomBytes(32).toString('hex');
        // return crypto.randomUUID();
    }

    static generateUniqueId (max){
        max = Number("1" + "0".repeat(max));
        return crypto.randomInt(2, max);
    }
    
}

module.exports = Security;