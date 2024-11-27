const PostSch = require(SCHEMA + 'post.schema');

const General = require(MISC_CON + 'general.cla');
// const Security = require(MISC_CON + 'security.cla');

class Post {
    static async create_post (inputs, userData){
        let error = {}
        let errRes = { status: true, data: {} }
        let { title, content, tags } = inputs;
        let { id: created_by } = userData;
        
        const title_exists = await PostSch.findOne({title, created_by});

        //check if title is empty
        if(!title || General.isEmptyString(title)){
            error['title'] = "title is required";
        }else if (title_exists){    
            error['title'] = "you have already created a blog post with the same title";
        }

        //check if content is empty
        if(!content || General.isEmptyString(content)){
            error['content'] = "content is required";
        }

        //check if tags is empty
        if(!tags || General.isEmptyString(tags)){
            error['tags'] = "tags is required";
        }

        //if there is no error
        if(General.isEmptyObject(error)){
            errRes['status'] = false;
        }else{
            errRes['data'] = error
        }

        return errRes;
    }
}

module.exports = Post;