const express = require('express');
const router = new express.Router();

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');
const Token = require(MISC_CON + 'token.cla');

const Comment = require(CORE_CON + 'comment.cla');
const Validator = require(VALIDATORS + 'comment.val');

//GET POST COMMENT
router.get('/', async (req, res) => {
    
    const CommentIns = new Comment(req, res);
    let response = await CommentIns.getComment();

    Security.returnResponse(res, req, response);
    return;
})

//CREATE
router.post('/create',Token.verifyToken, async(req,res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.comment(req.data.input);

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
router.put('/update', Token.verifyToken, async(req,res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.comment(req.data.input);

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
router.delete('/delete', Token.verifyToken, async(req, res) => {
    let response = General.initial_response('invalid_input');

    const CommentIns = new Comment(req, res);
    response = await CommentIns.deleteComment();
    
    Security.returnResponse(res, req, response);
    return;
})


module.exports = router;