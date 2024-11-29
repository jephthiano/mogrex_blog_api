const { User: UserSch, Comment: CommentSch, Reply: ReplySch } = require(SCHEMA + 'schema');

const DB = require(MISC_CON + 'database.cla');
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

    // GET, SEARCH AND FILTER POST
    async getComment() {
        //initializing variables
        let { post_id, current_page } = this.req.query
        this.response['messageDetail'] = `No comment, be the first to comment`;
            
        try {
            // get the post_id
            const PostId = await DB.findSingleValue('Post', 'post_id', post_id, 'id');
            if (PostId) {
                const limit = 10; //setting limit
                current_page = (current_page > 1) ? Number(current_page) : 1; // setting the current page
                const offset = (current_page - 1) * limit; // setting the offset
                const where = { PostId }; //setting where

                //fetch result [return result or empty object]
                const result = await CommentSch.findAll(
                    {
                        where,
                        offset,
                        limit,
                        order: [['createdAt', 'DESC']],
                        include: [
                            {
                                model: UserSch,
                                attributes: ['first_name', 'last_name', 'unique_id']
                            },
                            {
                                model: ReplySch,
                                as: 'commentReply'
                            }
                        ],
                    }
                ) || {};

                //getting total available result
                const total = await CommentSch.count({ where });

                //current result total
                const total_result = result.length;

                //set response
                this.response['status'] = true;
                this.response['message'] = "Success";
                this.response['messageDetail'] = (total_result < 1) ? "No comment found" : ""; 
                this.response['responseData'] = { current_page, total, total_result, result, };
            }
        } catch (err) {
            Comment.logError('Get Comment [COMMENT CLASS]', err);
        }

        return this.response;
    }

    // CREATE COMMENT
    async addComment() {
        this.response['messageDetail'] = "Comment could not be added at the moment";
        try {
            //get postData
            const PostId = await DB.findSingleValue('Post', 'post_id', this.input.post_id, 'id');
            if (PostId) {
                //setting UserId, postID into this.input
                this.input.UserId = this.userData.id;
                this.input.PostId = PostId;
                this.input.comment_id = Security.generateUniqueId(10);
                
                //save into db
                let result = await CommentSch.create(this.input);
                if (result) {
                    //set response
                    this.response['status'] = true;
                    this.response['message'] = "Success";
                    this.response['messageDetail'] = "Comment successfully added";
                    this.response['responseData'] = result.dataValues;
                }
            }

        } catch (err) {
            Comment.logError('Create Comment [COMMENT CLASS]', err);
        }

        return this.response;
    }

    // UPDATE COMMENT
    async updateComment() {
        this.response['messageDetail'] = "Comment could not be updated, you may not be eligible to update comment or the comment is not available";
        try {
            const { comment_id } = this.input;
            const { id: UserId } = this.userData;

            if (comment_id) {
                //save into db
                let updateCommentData = await CommentSch.update(
                    this.input, { where: { comment_id, UserId } },
                );
    
                // data is stored
                if (updateCommentData[0]) {
                    //set response
                    this.response['status'] = true;
                    this.response['message'] = "Success";
                    this.response['messageDetail'] = "Comment successfully updated";
                }
            }

        } catch (err) {
            Comment.logError('Update Comment [COMMENT CLASS]', err);
        }

        return this.response;
    }

    // DELETE COMMENT
    async deleteComment() {
        this.response['messageDetail'] = "Comment could not be deleted, you may not be eligible to delete comment or the comment is not available";
        try {
            const { comment_id } = this.input;
            const { id: UserId } = this.userData;
            
            if (comment_id) {
                //find one and delete if valid
                const deleteComment = await CommentSch.destroy({ where: { comment_id, UserId } });
    
                if (deleteComment) {
                    //set response
                    this.response['status'] = true;
                    this.response['message'] = "Success";
                    this.response['messageDetail'] = "Comment successfully deleted";
                }
            }

        } catch (err) {
            Comment.logError('Delete Comment [COMMENT CLASS]', err);
        }

        return this.response;
    }
}

module.exports = Comment;