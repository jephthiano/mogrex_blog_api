const express = require('express');
const router = new express.Router();

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');
const Token = require(MISC_CON + 'token.cla');

const Auth = require(CORE_CON + 'auth.cla');
const Validator = require(VALIDATORS + 'auth.val');

//LOGIN
router.post('/login', async(req,res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.login(req.data.input);

    //if there is no error
    if(!error.status){
        const AuthIns = new Auth(req, res);
        response = await AuthIns.login();

        if (response.status) {
            //set auth [with jwt and cookies]
            const token = await Token.setToken(response.id);
            res.cookie("token", token)
            
            //unset id key
            delete response['id']
        }

    }else{
        //set the error in response data
        response['errorData'] = error.data;
    }
    
    Security.returnResponse(res, req, response);
    return;
})


//REGISTER
router.post('/register', async(req,res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.register(req.data.input);

    //if there is no error
    if(!error.status){
        const AuthIns = new Auth(req, res);
        response = await AuthIns.register();

        if (response.status) {
            //set auth [with jwt and cookies]
            const token = await Token.setToken(response.id);
            res.cookie("token", token)
            
            //unset id key
            delete response['id']
        }
    }else{
        //set the error in response data
        response['errorData'] = error.data;
    }
    
    Security.returnResponse(res, req, response);    
    return;
})

//LOGOUT
router.get('/logout', async(req,res) => {
    let response = General.initial_response('invalid_input');
    this.response['status'] = true;
    this.response['message'] = "Success";
    this.response['message_detail'] = "Log out successful";

    // unset cookie
    res.clearCookie('token');
    
    Security.returnResponse(res, req, response);    
    return;
})

module.exports = router;