const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
    unique_id: { //for unique id
        type : String,
        unique : true,
        trim : true 
    },
    title: { 
        type : String,
        required : [true, 'title is not specified'],
        trim : true 
    },
    content: { 
        type : String,
        required : [true, 'content is not specified'],
        trim : true 
    },
    tags: { 
        type : String,
        required : [true, 'tags is not specified'],
        trim : true 
    },
    status: {
        type : String,
        enum : ['active','suspended'],
        default : 'active'
    },
    created_at: { 
        type : Date, 
        default : Date.now()
    },
    updated_at: { 
        type : Date, 
        default : Date.now()
    },
    created_by: { 
        type : String,
        required : [true, 'user_id is not specified'],
        trim : true 
    },
});

blogSchema.pre('findByIdAndUpdate', function (next) {
    
    //set updated at
    this.updated_at = new Date();
    
    next();
});

const blog = mongoose.model('blog', blogSchema);

module.exports = blog;