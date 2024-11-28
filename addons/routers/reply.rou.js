const express = require('express');
const router = new express.Router();

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');

const Reply = require(CORE_CON + 'reply.cla');
const Validator = require(VALIDATORS + 'comment.val');

//CREATE
router.post('/create', async(req,res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.comment(req.data.input);

    //if there is no error
    if (!error.status) {
        const ReplyIns = new Reply(req, res);
        response = await ReplyIns.addReply();
    }else{
        //set the error in response data
        response['errorData'] = error.data;
    }
    
    Security.returnResponse(res, req, response);
    return;
})

//UPDATE
router.put('/update', async(req,res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.comment(req.data.input);

    //if there is no error
    if (!error.status) {
        const ReplyIns = new Reply(req, res);
        response = await ReplyIns.updateReply();
    }else{
        //set the error in response data
        response['errorData'] = error.data;
    }
    
    Security.returnResponse(res, req, response);
    return;
})

//DELETE
router.delete('/delete', async(req, res) => {
    let response = General.initial_response('invalid_input');

    const ReplyIns = new Reply(req, res);
    response = await ReplyIns.deleteReply();
    
    Security.returnResponse(res, req, response);
    return;
})


module.exports = router;