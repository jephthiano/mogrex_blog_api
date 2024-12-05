
const express = require('express');
const router = new express.Router();

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');


//WAKE UP
router.get('/wake_up', async(req,res) => {
    console.log('server still up and running at', new Date());
    
    let response = {
        status: true
    }

    Security.returnResponse(res, req, response);
    return;
})

module.exports = router;