const express = require('express');
const router = new express.Router();

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');

const Comment = require(CORE_CON + 'comment.cla');
const Validator = require(VALIDATORS + 'content.val');

//CREATE
router.post('/create', async(req,res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.content(req.data.input, req.data.userData);

    //if there is no error
    if (!error.status) {
        const CommentIns = new Comment(req, res);
        response = await CommentIns.addComment();
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
    const error = await Validator.content(req.data.input, req.data.userData);

    //if there is no error
    if (!error.status) {
        const CommentIns = new Comment(req, res);
        response = await CommentIns.updateComment();
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

    const CommentIns = new Comment(req, res);
    response = await CommentIns.deleteComment();
    
    Security.returnResponse(res, req, response);
    return;
})


module.exports = router;