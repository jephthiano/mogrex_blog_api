const PostSch = require(SCHEMA + 'post.schema');

const Security = require(MISC_CON + 'security.cla');
const General = require(MISC_CON + 'general.cla');


class Post {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.userData = this.req.data.userData;
        this.input = this.req.data.input;

        this.response = {
            status:false,
            message: "failed",
            message_detail: "Request failed",
            responseData:{},
            errorData:{}
        }
    }

    static logInfo(type, data){
        General.log(type,data,'info');
    }

    static logError(type, data){
        General.log(type,data,'error');
    }

    // CREATE POST
    async createPost() {
        this.response['message_detail'] = "Post could not be created at the moment";
        try {
            //setting created_by into this.input
            this.input.created_by = this.userData.id;
            //save into db
            let result = await PostSch.create(this.input);

            // data is stored
            if (result) {
                //get postData
                const postData = await PostSch.findOne({_id : result.id}, '-password -_id -__v');

                if (postData) {
                    //set response
                    this.response['status'] = true;
                    this.response['message'] = "Success";
                    this.response['message_detail'] = "Post successfully created";
                    this.response['responseData'] = postData;
                    
                    
                }
            }
        } catch (err) {
            Post.logError('Create Post [POST CLASS]', err);
        }

        return this.response;
    }

    // CREATE POST
    async deleteePost() {
        this.response['message_detail'] = "Post could not be created at the moment";
        try {
            //setting created_by into this.input
            this.input.created_by = this.userData.id;
            //save into db
            let result = await PostSch.create(this.input);

            // data is stored
            if (result) {
                //get postData
                const postData = await PostSch.findOne({_id : result.id}, '-password -_id -__v');

                if (postData) {
                    //set response
                    this.response['status'] = true;
                    this.response['message'] = "Success";
                    this.response['message_detail'] = "Post successfully created";
                    this.response['responseData'] = postData;
                    
                    
                }
            }
        } catch (err) {
            Post.logError('Create Post [POST CLASS]', err);
        }

        return this.response;
    }
}

module.exports = Post;