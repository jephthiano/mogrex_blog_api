const express = require('express');
const router = new express.Router();

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');

const Like = require(CORE_CON + 'like.cla');

//LIKE POST
router.delete('/', async(req, res) => {
    let response = General.initial_response('invalid_input');

    const LikeIns = new Like(req, res);
    response = await LikeIns.ProcessLike();
    
    Security.returnResponse(res, req, response);
    return;
})


module.exports = router;