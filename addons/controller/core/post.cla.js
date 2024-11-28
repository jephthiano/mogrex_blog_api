const { Post: PostSch } = require(SCHEMA + 'schema');

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
            //setting UserId into this.input
            this.input.UserId = this.userData.id;
            this.input.post_id = Security.generateUniqueId(10);
            //save into db
            let result = await PostSch.create(this.input);

            // data is stored
            if (result) {
                //set response
                this.response['status'] = true;
                this.response['message'] = "Success";
                this.response['message_detail'] = "Post successfully created";
                this.response['responseData'] = result.dataValues;
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
            const { id: UserId } = this.userData;

            //save into db
            let updatePostData = await PostSch.update(
                this.input,
                { where: { post_id, UserId } },
            );

            // data is stored
            if (updatePostData[0]) {
                //set response
                this.response['status'] = true;
                this.response['message'] = "Success";
                this.response['message_detail'] = "Post successfully updated";
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
            const { id: UserId } = this.userData;

            //find one and delete if valid
            const deletePost = await PostSch.destroy({ where: { post_id, UserId } });

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