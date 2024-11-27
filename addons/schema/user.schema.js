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
    mobile_number: { //user mobile number
        type : String,
        unique : true,
        required : [true, 'mobile number is not specified'],
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
    transaction_pin: {
        type: String,
        required: [true, 'transaction pin is not specified'],
        default: null,
        trim : true 
    },
    user_level: { 
        type : Number,
        enum : [1, 2, 3],
        default : 1
    },
    gender: { 
        type : String,
        enum : ['male','female'],
        required : [true, 'gender is not specified'],
    },
    dob: { 
        type : String,
    },
    address: { // address, city, state
        type : Object,
    },
    status: { 
        type : String,
        enum : ['active','suspended'],
        default : 'active'
    },
    reg_date: { 
        type : Date, 
        default : Date.now()
    },
    email_verification: { 
        type : Boolean,
        default : false
    },
    mobile_number_verification: { 
        type : Boolean,
        default : false
    },
    pin_status: {
        type : Boolean,
        default : false
    },
    token: { //for unique generated token
        type : String,
        default: null
    },
    user_account:{
        type: Object,
        default: null
    },
    user_settings:{
        type: Object,
        default: null
    },
    user_bank_account:{
        type: Object,
        default: null
    },
    user_kyc_data:{
        type: Object,
        default: null
    },
    user_ext_data:{
        type: Object,
        default: null
    }
});


userSchema.pre('save', function(next) {
    //set unique id
    this.unique_id = "user" + Security.generateUniqueId(10);

    //encrypt email
    if (this.isModified('email')) {
        this.email = Security.sel_encry(this.email.toLowerCase(), 'email');
    }

    //encrypt mobile_number
    if (this.isModified('mobile_number')) {
        this.mobile_number = Security.sel_encry(this.mobile_number, 'mobile_number');
    }

    //encrypt username
    if (this.isModified('username')) {
        this.username = Security.sel_encry(this.username.toLowerCase(), 'username');
    }

    //encrypt first_name
    if (this.isModified('first_name')) {
        this.first_name = Security.sel_encry(this.first_name.toLowerCase(), 'first_name');
    }

    //encrypt last_name
    if (this.isModified('last_name')) {
        this.last_name = Security.sel_encry(this.last_name.toLowerCase(), 'last_name');
    }

    //hash password
    if (this.isModified('password')) {
        this.password = Security.hash_password(this.password);
    }

    // set user account
    this.user_account = { balance: "0.00"};
    
    next();
});

userSchema.pre('findByIdAndUpdate', function (next) {
    //hash password
    if (this.getUpdate().password) {
        this.getUpdate().password = Security.hash_password(this.getUpdate().password)
    }

    // //hash transaction pin
    // if (this.getUpdate().transaction_pin) {
    //     // this.getUpdate().transaction_pin = Security.hash_password(this.getUpdate().transaction_pin) 
    //     this.getUpdate().transaction_pin = this.getUpdate().transaction_pin + "234";

    // }

    // //encrypt email
    // if (this.getUpdate().email) {
    //     this.getUpdate().email = Security.sel_encry(this.getUpdate().email.toLowerCase(), 'email')
    // }
    
    next();
});

userSchema.pre('findOneAndUpdate', function (next) {
    //hash password
    if (this.getUpdate().password) {
        this.getUpdate().password = Security.hash_password(this.getUpdate().password)
    }
    
    next();
});

const User = mongoose.model('users', userSchema);

module.exports = User;