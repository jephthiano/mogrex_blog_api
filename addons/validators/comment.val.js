const { Post: PostSch } = require(SCHEMA + 'schema');

const General = require(MISC_CON + 'general.cla');
// const Security = require(MISC_CON + 'security.cla');

class Post {
    static async comment (inputs){
        let error = {}
        let errRes = { status: true, data: {} }
        let { content } = inputs;

        //check if content is empty
        if(!content || General.isEmptyString(content)){
            error['content'] = "content is required";
        }

        //if there is no error
        if(General.isEmptyObject(error)){
            errRes['status'] = false;
        }else{
            errRes['data'] = error
        }

        return errRes;
    }
}

module.exports = Post;