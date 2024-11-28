const mongoose = require('mongoose');
const { Schema } = mongoose;

const Security = require(MISC_CON + 'security.cla');

const userSchema = new Schema({
    unique_id: { //for unique id
        type : String,
        unique : true,
        trim : true 
    },
    email: {  //user email
        type : String,
        unique : true,
        required : [true, 'email is not specified'],
        trim : true 
    },
    username: {  //user username
        type : String,
        unique : true,
        required : [true, 'username is not specified'],
        trim : true 
    },
    first_name: { 
        type : String,
        required : [true, 'first name is not specified'],
        trim : true 
    },
    last_name: { 
        type : String,
        required : [true, 'last name is not specified'],
        trim : true 
    },
    password: { 
        type : String,
        required : [true, 'password is not specified'],
        trim : true 
    },
    user_level: { 
        type : Number,
        enum : [1, 2, 3],
        default : 1
    },
    status: { 
        type : String,
        enum : ['active','suspended'],
        default : 'active'
    },
    reg_date: { 
        type : Date, 
        default : Date.now()
    }
});


userSchema.pre('save', function (next) {
    //set unique id
    this.unique_id = "user" + Security.generateUniqueId(10);

    //hash password
    if (this.isModified('password')) {
        this.password = Security.hash_password(this.password);
    }
    
    next();
});

const User = mongoose.model('users', userSchema);

module.exports = User;