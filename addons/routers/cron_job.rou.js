const express = require('express');
const router = new express.Router();

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');


//LOGIN
router.get('/wake_up', async(req,res) => {
    let response = General.initial_response('invalid_input');
    response['status'] = true;
    response['message'] = "Success";
    response['messageDetail'] = "Server successfully woken up";
    
    Security.returnResponse(res, req, response);
    return;
})


module.exports = router;