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

    
    // LIKE
    async like() {
        this.response['message_detail'] = "Request not process";
        try {
            const { id: content_id, type } = this.input;
            const { id: like_by } = this.userData;

            //check if content is set and type is in typeArray
            if (content_id && this.typeArray.includes(type)) {
                // set the type response based on type
                const typeRes = (type === 'post') ? "Post" : "Comment";
                let queryData

                //set the query data based on type
                if (type === 'post') {
                    const PostId = await DB.findSingleValue('Post', 'post_id', content_id, 'id');
                    queryData = { type, like_by, PostId }
                } else if (type === 'comment') {
                    const CommentId = await DB.findSingleValue('Comment', 'comment_id', content_id, 'id');
                    queryData = { type, like_by, CommentId }
                } else {
                    const ReplyId = await DB.findSingleValue('Reply', 'reply_id', content_id, 'id');
                    queryData = { type, like_by, ReplyId }
                }

                console.log(PostId);return
                //check if either of Post, comment or Reply is set
                if (General.isValidData(PostId) || General.isValidData(CommentId) || General.isValidData(ReplyId)) {
                    //check if like exists;
                    const exists = await LikeSch.findOne({ where: queryData });
                    if (exists) {
                        this.response['message_detail'] = `You have already liked this ${typeRes}`;
                    } else {
                        //insert into the db
                        const storeLike = await LikeSch.create( queryData );
                        if (storeLike) {
                            //set response
                            this.response['status'] = true;
                            this.response['message'] = "Success";
                            this.response['message_detail'] = `${typeRes} successfully liked`;
                        }
                    }
                }

            }
        } catch (err) {
            Like.logError('Like [LIKE CLASS]', err);
        }

        return this.response;
    }

    // UNLIKE
    async unlike() {
        this.response['message_detail'] = "Request not process";
        try {
            const { id, type } = this.input;
            const { id: like_by } = this.userData;

            if (id && this.typeArray.includes(type)) {
                const typeRes = (type === 'post') ? "Post" : "Comment";

                //delete in  db
                const deleteLike = await LikeSch.destroy({ where: { type, like_by } });
                if (deleteLike) {
                    //set response
                    this.response['status'] = true;
                    this.response['message'] = "Success";
                    this.response['message_detail'] = `${typeRes} successfully unlike`;
                }
            }
        } catch (err) {
            Like.logError('UnLike [LIKE CLASS]', err);
        }

        return this.response;
    }
}

module.exports = Like;