class Request {

    static setInputData(req, res, next){
        req.data = {input : req.body};
        next();
    }
    
}

module.exports = Request;