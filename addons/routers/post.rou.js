const express = require('express');
const router = new express.Router();

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');

const Post = require(CORE_CON + 'post.cla');
const Validator = require(VALIDATORS + 'post.val');

//SEARCH
router.get('/search', async(req,res) => {
    let response = General.initial_response('invalid_input');

    const PostIns = new Post(req, res);
    response = await PostIns.getPost('searc');
    
    Security.returnResponse(res, req, response);
    return;
})

//FILTER
router.get('/filter', async(req,res) => {
    let response = General.initial_response('invalid_input');

    const PostIns = new Post(req, res);
    response = await PostIns.getPost('filter');
    
    Security.returnResponse(res, req, response);
    return;
})

//CREATE
router.post('/create', async(req,res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.create_post(req.data.input, req.data.userData);

    //if there is no error
    if (!error.status) {
        const PostIns = new Post(req, res);
        response = await PostIns.createPost();
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
    const error = await Validator.update_post(req.data.input);

    //if there is no error
    if (!error.status) {
        const PostIns = new Post(req, res);
        response = await PostIns.updatePost();
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

    const PostIns = new Post(req, res);
    response = await PostIns.deletePost();
    
    Security.returnResponse(res, req, response);
    return;
})


module.exports = router;