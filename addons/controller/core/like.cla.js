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

    
    // DELETE REPLY
    async deleteReply() {
        this.response['message_detail'] = "Comment could not be deleted, you may not be eligible to delete comment or the comment is not available";
        try {
            const { id, type } = this.input;
            const { id: UserId } = this.userData;
            
            if (reply_id) {
                console.log(reply_id)
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