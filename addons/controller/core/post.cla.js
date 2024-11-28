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

    // SEARCH POST
    async searchPost() {
        const { query, cur_page} = this.req.query
        this.response['message_detail'] = `No result found for ${query} keyword, check your keyword and try again`;

        try {
            //if query is empty or invalid
            if (!query || General.isValidData(query)) {
                this.response['message_detail'] = `Invalid search keyword, check your keyword`;
            } else {
                const limit = 10;
                const page = (cur_page > 1) ? cur_page : 1;
                const offset = (page - 1) * limit;

                PostSch.findAll(
                    {
                        where: {
                            [Op.or]:
                                [
                                    { title: { [Op.like]: 'Jo%' } },
                                    { content: { [Op.like]: 'Jo%' } }
                                ]
                        }
                    }, 
                    {
                        offset, limit
                    }
                );
            }



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
            Post.logError('Search Post [POST CLASS]', err);
        }

        return this.response;
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

            if (post_id) {
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

            if (post_id) {
                //find one and delete if valid
                const deletePost = await PostSch.destroy({ where: { post_id, UserId } });
    
                if (deletePost) {
                    //set response
                    this.response['status'] = true;
                    this.response['message'] = "Success";
                    this.response['message_detail'] = "Post successfully deleted";
                }
            }
        } catch (err) {
            Post.logError('Delete Post [POST CLASS]', err);
        }

        return this.response;
    }
}

module.exports = Post;