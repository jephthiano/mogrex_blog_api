const { Like: LikeSch } = require(SCHEMA + 'schema');

const DB = require(MISC_CON + 'database.cla');
const General = require(MISC_CON + 'general.cla');

class Like {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.userData = this.req.data.userData;
        this.input = this.req.data.input;
        this.typeArray = ['post', 'comment', 'reply'];

        this.response = {
            status:false,
            message: "failed",
            messageDetail: "Request failed",
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

    
    // LIKE / UNLIKE
    async like_unlike(request_type) {
        this.response['messageDetail'] = "Request not processed";
        try {
            const { id: content_id, type } = this.input;
            const { id: like_by } = this.userData;

            //check if content is set and type is in typeArray
            if (content_id && this.typeArray.includes(type)) {
                // set the type response based on type
                const typeRes = (type === 'post') ? "Post" : "Comment";
                let queryData = {}
                let con_id = false;

                //set the query data based on type
                if (type === 'post') {
                     con_id = await DB.findSingleValue('Post', 'post_id', content_id, 'id');
                    queryData = { type, like_by, PostId: con_id }
                } else if (type === 'comment') {
                    con_id = await DB.findSingleValue('Comment', 'comment_id', content_id, 'id');
                    queryData = { type, like_by, CommentId: con_id }
                } else {
                    con_id = await DB.findSingleValue('Reply', 'reply_id', content_id, 'id');
                    queryData = { type, like_by, ReplyId: con_id }
                }


                //check if either of Post, comment or Reply is set
                if (con_id) {
                    //if request_type is like [insert] else [delete]
                    if (request_type === 'like') {
                        //check if like exists;
                        const exists = await LikeSch.findOne({ where: queryData });
                        if (exists) {
                            this.response['messageDetail'] = `You have already liked this ${typeRes}`;
                        } else {
                            //insert into the db
                            const storeLike = await LikeSch.create( queryData );
                            if (storeLike) {
                                //set response
                                this.response['status'] = true;
                                this.response['message'] = "Success";
                                this.response['messageDetail'] = `${typeRes} successfully liked`;
                            }
                        }
                    } else {
                        const deleteLike = await LikeSch.destroy({ where: queryData });
                        if (deleteLike) {
                            //set response
                            this.response['status'] = true;
                            this.response['message'] = "Success";
                            this.response['messageDetail'] = `${typeRes} successfully unlike`;
                        }
                    }

                }

            }
        } catch (err) {
            Like.logError('Like [LIKE CLASS]', err);
        }

        return this.response;
    }
}

module.exports = Like;