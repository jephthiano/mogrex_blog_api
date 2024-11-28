const { Comment: CommentSch, Reply: ReplySch } = require(SCHEMA + 'schema');

const DB = require(MISC_CON + 'database.cla');
const General = require(MISC_CON + 'general.cla');
const Security = require(MISC_CON + 'security.cla');

class Reply {
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

    // CREATE REPLY
    async addReply() {
        this.response['message_detail'] = "Comment could not be added at the moment";
        try {
            //get commentData
            const CommentId = await DB.findSingleValue('Comment', 'comment_id', this.input.comment_id, 'id');
            if (CommentId) {
                //setting UserId, postID into this.input
                this.input.UserId = this.userData.id;
                this.input.CommentId = CommentId;
                this.input.reply_id = Security.generateUniqueId(10);
                
                //save into db
                let result = await ReplySch.create(this.input);
                if (result) {
                    //set response
                    this.response['status'] = true;
                    this.response['message'] = "Success";
                    this.response['message_detail'] = "Comment successfully added";
                    this.response['responseData'] = result.dataValues;
                }
            }
            
        } catch (err) {
            Reply.logError('Create Reply [REPLY CLASS]', err);
        }

        return this.response;
    }

    // UPDATE REPLY
    async updateReply() {
        this.response['message_detail'] = "Comment could not be updated, you may not be eligible to update comment or the comment is not available";
        try {
            const { reply_id } = this.input;
            const { id: UserId } = this.userData;

            if (reply_id) {
                //save into db
                let updateReplyData = await ReplySch.update(
                    this.input,
                    { where: { reply_id, UserId } },
                );
    
                // data is stored
                if (updateReplyData[0]) {
                    //set response
                    this.response['status'] = true;
                    this.response['message'] = "Success";
                    this.response['message_detail'] = "Comment successfully updated ";
                }
            }

        } catch (err) {
            Post.logError('Update Reply [COMMENT CLASS]', err);
        }

        return this.response;
    }

    // DELETE REPLY
    async deleteReply() {
        this.response['message_detail'] = "Comment could not be deleted, you may not be eligible to delete comment or the comment is not available";
        try {
            const { reply_id } = this.input;
            const { id: UserId } = this.userData;
            
            if (reply_id) {
                //find one and delete if valid
                const deleteReply = await ReplySch.destroy({ where: { reply_id, UserId } });
    
                if (deleteReply) {
                    //set response
                    this.response['status'] = true;
                    this.response['message'] = "Success";
                    this.response['message_detail'] = "Comment successfully deleted";
                }
            }
        } catch (err) {
            Reply.logError('Delete Reply [REPLY CLASS]', err);
        }

        return this.response;
    }
}

module.exports = Reply;