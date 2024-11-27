const express = require('express');
const router = new express.Router();

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');

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
    }else{
        //set the error in response data
        response['errorData'] = error.data;
    }
    
    Security.returnResponse(res, req, response);    
    return;
})

module.exports = router;