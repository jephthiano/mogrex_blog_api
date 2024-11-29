const express = require('express');
const router = new express.Router();

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');

const Post = require(CORE_CON + 'post.cla');
const Validator = require(VALIDATORS + 'post.val');

//GET CURRENT USER POST
router.get('/user', async (req, res) => {
    
    const PostIns = new Post(req, res);
    let response = await PostIns.getPost('user');

    Security.returnResponse(res, req, response);
    return;
})

//SEARCH, FILTER AND OTHER GET
router.get('/:type', async(req,res) => {
    let response = General.initial_response('');
    const typeArray = ['getall', 'search', 'filter']
    const { type } = req.params;

    if (typeArray.includes(type)) {
        const PostIns = new Post(req, res);
        response = await PostIns.getPost(type);
    }

    Security.returnResponse(res, req, response);
    return;
})

//CREATE POST
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

//UPDATE POST
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

//DELETE POST
router.delete('/delete', async(req, res) => {
    let response = General.initial_response('invalid_input');

    const PostIns = new Post(req, res);
    response = await PostIns.deletePost();
    
    Security.returnResponse(res, req, response);
    return;
})


module.exports = router;