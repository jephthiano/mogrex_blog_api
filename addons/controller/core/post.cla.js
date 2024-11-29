const { Post: PostSch } = require(SCHEMA + 'schema');
const { Op } = require('sequelize');

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
    async getPost(type) {
        //initializing variables
        let where = {};
        let { query, tag, current_page } = this.req.query
        this.response['messageDetail'] = `No result found, check your keyword and try again`;
        console.lg
        //setting the query
        query = (type === 'search') ? query : (type === 'filter') ? tag : 'getall';
            
        try {
            //if query is empty or invalid
            if (!query || !General.isValidData(query)) {
                this.response['messageDetail'] = `Invalid search keyword, check your keyword`;
            } else {
                const limit = 10; //setting limit
                const page = (current_page > 1) ? current_page : 1; // setting the current page
                const offset = (page - 1) * limit; // setting the offset

                //setting [where] depending of it is search, filter, user or general fetch
                if (type === 'search') {
                    //for search
                    where = {
                        [Op.or]: [
                                    { title: { [Op.like]: `%${query}%` } },
                                    { content: { [Op.like]: `%${query}%` } },
                                    { tags: { [Op.like]: `%${query}%` } },
                                ]
                    }
                } else if (type === 'filter') {
                    //for tags
                    where = { tags: { [Op.like]: `%${query}%` } }
                } else if (type === 'user') {
                    // for current user posts
                    where = { UserId: this.userData.id}
                }
                
                //fetch result [return result or empty object]
                let result = await PostSch.findAll(
                    { where, offset, limit, order: [['createdAt', 'DESC']] }
                ) || {};

                //set response
                this.response['status'] = true;
                this.response['message'] = "Success";
                this.response['messageDetail'] = "";
                this.response['responseData'] = {
                    current_page: page,
                    total: 300,
                    total_result: result.length,
                    result,
                };
                
            }
        } catch (err) {
            Post.logError('Search Post [POST CLASS]', err);
        }

        return this.response;
    }



    // CREATE POST
    async createPost() {
        this.response['messageDetail'] = "Post could not be created at the moment";
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
                this.response['messageDetail'] = "Post successfully created";
                this.response['responseData'] = result.dataValues;
            }
        } catch (err) {
            Post.logError('Create Post [POST CLASS]', err);
        }

        return this.response;
    }

    // UPDATE POST
    async updatePost() {
        this.response['messageDetail'] = "Post could not be updated, you may not be eligible to update post or the post is not available";
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
                    this.response['messageDetail'] = "Post successfully updated";
                }
            }

        } catch (err) {
            Post.logError('Update Post [POST CLASS]', err);
        }

        return this.response;
    }

    // DELETE POST
    async deletePost() {
        this.response['messageDetail'] = "Post could not be deleted, you may not be eligible to delete post or the post is not available";
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
                    this.response['messageDetail'] = "Post successfully deleted";
                }
            }
        } catch (err) {
            Post.logError('Delete Post [POST CLASS]', err);
        }

        return this.response;
    }
}

module.exports = Post;