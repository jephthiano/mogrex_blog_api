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


//SIGNUP [1. SEND OTP]
router.post('/su_send_otp', async(req,res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.su_send_otp(req.data.input);

    //if there is no error
    if(!error.status){
        const { veri_type } = req.data.input; 
        //set send_medium and use_case in input data
        req.data.input['send_medium'] = (veri_type === 'email') ? veri_type : "mobile_number";
        req.data.input['first_name'] = "user";
        req.data.input['use_case'] = "register";
        
        const AuthIns = new Auth(req, res);
        response = await AuthIns.sendOtp();
    }else{
        //set the error in response data
        response['errorData'] = error.data;
    }
    
    Security.returnResponse(res, req, response);
    return;
})


//SIGN UP [2. VERIFY OTP]
router.post('/su_verify_otp', async(req,res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.verify_otp(req.data.input);

    //if there is no error
    if(!error.status){
        //set use_case in input data
        req.data.input['use_case'] = "register";

        const AuthIns = new Auth(req, res);
        response = await AuthIns.verifyOtp();
    }else{
        //set the error in response data
        response['errorData'] = error.data;
    }
    
    Security.returnResponse(res, req, response);
    return;
})


//REGISTER
router.post('/register', async(req,res) => {
    let regType = "multi";
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.register(req.data.input, regType);

    //if there is no error
    if(!error.status){
        const {veri_type, receiving_medium} = req.data.input

        //set email or mobile_number into input data
        veri_type === 'email' ? req.data.input['email'] = receiving_medium : req.data.input['mobile_number'] = receiving_medium ;

        const AuthIns = new Auth(req, res);
        response = await AuthIns.register(regType);
    }else{
        //set the error in response data
        response['errorData'] = error.data;
    }
    
    Security.returnResponse(res, req, response);    
    return;
})


//FORGOT PASSWORD [1. SEND OTP]
router.post('/fp_send_otp', async(req,res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.fp_send_otp(req.data.input); 

    //if there is no error
    if(!error.status){
        const resData = error.data;
        const { receiving_medium } = req.data.input;
        
        //set send_medium, first_name and use case in input data
        req.data.input['send_medium'] = (Security.validate_input(receiving_medium, 'email')) ? "email" : "mobile_number" ;
        req.data.input['first_name'] = Security.sel_decry(resData.first_name, 'first_name');
        req.data.input['use_case'] = "forgot_password";

        const AuthIns = new Auth(req, res);
        response = await AuthIns.sendOtp();
    }else{
        //set the error in response data
        response['errorData'] = error.data;
    }
    
    Security.returnResponse(res, req, response);
    return;
})


//FORGOT PASSWORD [2. VERIFY OTP]
router.post('/fp_verify_otp', async(req,res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.verify_otp(req.data.input);
    
    //if there is no error
    if(!error.status){
        //set use_case in input data
        req.data.input['use_case'] = "forgot_password";
        
        const AuthIns = new Auth(req, res);
        response = await AuthIns.verifyOtp();
    }else{
        //set the error in response data
        response['errorData'] = error.data;
    }
    
    Security.returnResponse(res, req, response);
    return;
})


//FORGOT PASSWORD [3. RESET PASSWORD]
router.post('/reset_password', async(req,res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.reset_password(req.data.input);

    //if there is no error
    if(!error.status){
        const AuthIns = new Auth(req, res);
        response = await AuthIns.resetPassword();
    }else{
        //set the error in response data
        response['errorData'] = error.data;
    }
    
    Security.returnResponse(res, req, response);
    return;
})

module.exports = router;