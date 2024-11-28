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
                const postData = await PostSch.findOne({_id : result.id}, '-_id -__v');

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

    // UPDATE POST
    async updatePost() {
        this.response['message_detail'] = "Post could not be updated, you may not be eligible to update post or the post is not available";
        try {
            const { post_id } = this.input;
            const { id: created_by } = this.userData;

            //save into db
            let updatePostData = await PostSch.findOneAndUpdate(
                { post_id, created_by },
                this.input,
                {new: true}
            );

            // data is stored
            if (updatePostData) {
                //set response
                this.response['status'] = true;
                this.response['message'] = "Success";
                this.response['message_detail'] = "Post successfully updated";
                this.response['responseData'] = updatePostData;  
                  
            }
        } catch (err) {
            Post.logError('Update Post [POST CLASS]', err);
        }

        return this.response;
    }

    // DELETE POST
    async deletePost() {
        this.response['message_detail'] = "Post could not be deleted, you may not be eligible to delete post or the post is not available";
        try {
            const { post_id } = this.input;
            const { id: created_by } = this.userData;

            //find one and delete if valid
            const deletePost = await PostSch.findOneAndDelete({ post_id, created_by });

            if (deletePost) {
                //set response
                this.response['status'] = true;
                this.response['message'] = "Success";
                this.response['message_detail'] = "Post successfully deleted";
            }
        } catch (err) {
            Post.logError('Delete Post [POST CLASS]', err);
        }

        return this.response;
    }
}

module.exports = Post;