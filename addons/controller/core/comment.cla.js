const { Post: PostSch, Comment: CommentSch } = require(SCHEMA + 'schema');

const General = require(MISC_CON + 'general.cla');


class Comment {
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

    // CREATE COMMENT
    async addComment() {
        this.response['message_detail'] = "Comment could not be added at the moment";
        try {
            
            //setting UserId, postID into this.input
            this.input.UserId = this.userData.id;
            this.input.PostId = this.postData.id;
            
            //save into db
            let result = await CommentSch.create(this.input);
            if (result) {
                //set response
                this.response['status'] = true;
                this.response['message'] = "Success";
                this.response['message_detail'] = "Comment successfully added";
                this.response['responseData'] = result.dataValues;
            }
        } catch (err) {
            Post.logError('Create Comment [Comment CLASS]', err);
        }

        return this.response;
    }

    // UPDATE COMMENT
    async updateComment() {
        this.response['message_detail'] = "Comment could not be updated, you may not be eligible to update comment or the comment is not available";
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
                this.response['message_detail'] = "Comment successfully updated";
            }
        } catch (err) {
            Post.logError('Update Comment [COMMENT CLASS]', err);
        }

        return this.response;
    }

    // DELETE POST
    async deletePost() {
        this.response['message_detail'] = "Comment could not be deleted, you may not be eligible to delete comment or the comment is not available";
        try {
            const { comment_id, post_id: PostId } = this.input;
            const { id: UserId } = this.userData;

            //find one and delete if valid
            const deletePost = await PostSch.destroy({ where: { comment_id, PostId, UserId } });

            if (deletePost) {
                //set response
                this.response['status'] = true;
                this.response['message'] = "Success";
                this.response['message_detail'] = "Comment successfully deleted";
            }
        } catch (err) {
            Post.logError('Delete Comment [Comment CLASS]', err);
        }

        return this.response;
    }
}

module.exports = Comment;