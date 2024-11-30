const express = require('express');
const router = new express.Router();

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');


//WAKE UP
router.get('/wake_up', async(req,res) => {
    let response = General.initial_response('invalid_input');
    response['status'] = true;
    response['message'] = "Success";
    response['messageDetail'] = "Server successfully woken up";
    
    Security.returnResponse(res, req, response);
    console.log('server still up and running at', new Date());
    return;
})


module.exports = router;