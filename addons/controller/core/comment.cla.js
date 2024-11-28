const { Post: PostSch, Comment: CommentSch } = require(SCHEMA + 'schema');

const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');

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
            this.input.comment_id = Security.generateUniqueId(10);
            
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
            Comment.logError('Create Comment [COMMENT CLASS]', err);
        }

        return this.response;
    }

    // UPDATE COMMENT
    async updateComment() {
        this.response['message_detail'] = "Comment could not be updated, you may not be eligible to update comment or the comment is not available";
        try {
            const { comment_id } = this.input;
            const { id: UserId } = this.userData;

            //save into db
            let updatePostData = await PostSch.update(
                this.input,
                { where: { comment_id, UserId } },
            );

            // data is stored
            if (updatePostData[0]) {
                //set response
                this.response['status'] = true;
                this.response['message'] = "Success";
                this.response['message_detail'] = "Comment successfully updated";
            }
        } catch (err) {
            Comment.logError('Update Comment [COMMENT CLASS]', err);
        }

        return this.response;
    }

    // DELETE COMMENT
    async deleteComment() {
        this.response['message_detail'] = "Comment could not be deleted, you may not be eligible to delete comment or the comment is not available";
        try {
            const { comment_id } = this.input;
            const { id: UserId } = this.userData;

            //find one and delete if valid
            const deleteComment = await CommentSch.destroy({ where: { comment_id, UserId } });

            if (deleteComment) {
                //set response
                this.response['status'] = true;
                this.response['message'] = "Success";
                this.response['message_detail'] = "Comment successfully deleted";
            }
        } catch (err) {
            Comment.logError('Delete Comment [COMMENT CLASS]', err);
        }

        return this.response;
    }
}

module.exports = Comment;