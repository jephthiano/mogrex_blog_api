const express = require('express');
const router = new express.Router();

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');

// const Blog = require(CORE_CON + 'blog.cla');
const Validator = require(VALIDATORS + 'blog.val');

//CREATE
router.post('/create', async(req,res) => {
    let response = General.initial_response('invalid_input');

    //validate inputs
    const error = await Validator.login(req.data.input);

    //if there is no error
    if (!error.status) {
        console.log('perfect');
        // const BlogIns = new Blog(req, res);
        // response = await BlogIns.createBlog();
    }else{
        //set the error in response data
        response['errorData'] = error.data;
    }
    
    Security.returnResponse(res, req, response);
    return;
})


module.exports = router;