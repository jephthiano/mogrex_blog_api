const { Sequelize, DataTypes, Model } = require('sequelize');

const Security = require(MISC_CON + 'security.cla');

const sequelize = new Sequelize('mogrex_blog', 'root', 'jephthahJEHOVAHgod332$', {
    host: 'localhost',
    dialect: 'mysql'
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
        
//create table automatically
sequelize.sync({ force: false })


//USER SCHEMA
class User extends Model {}
User.init(
  {
    // Model attributes are defined here
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    user_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        // Hashing the value with an appropriate cryptographic hash function is better.
        this.setDataValue('password', Security.hash_password(value));
      },
    },
    user_level: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 1
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active"
    },
  },
  {
    // Other model options go here
    sequelize, //pass the connection instance
    modelName: 'User', // We need to choose the model name
    tableName: 'users', //table name
    timestamps: true, //enable timestamps
    updatedAt: false // disable updated_at
  },
);



//POST SCHEMA
class Post extends Model {}
Post.init(
  {
    // Model attributes are defined here
    post_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active"
    },
  },
  {
    // Other model options go here
    sequelize, //pass the connection instance
    modelName: 'Post', // We need to choose the model name
    tableName: 'posts', //table name
    timestamps: true, //enable timestamps
  },
);

//COMMENT SCHEMA
class Comment extends Model {}
Comment.init(
  {
    // Model attributes are defined here
    comment_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, //pass the connection instance
    modelName: 'Comment', // We need to choose the model name
    tableName: 'comments', //table name
    timestamps: true, //enable timestamps
  },
);


//REPLY SCHEMA
class Reply extends Model {}
Reply.init(
  {
    // Model attributes are defined here
    reply_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, //pass the connection instance
    modelName: 'Reply', // We need to choose the model name
    tableName: 'replies', //table name
    timestamps: true, //enable timestamps
  },
);

//LIKE SCHEMA
class Like extends Model {}
Like.init(
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    like_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, //pass the connection instance
    modelName: 'Like', // We need to choose the model name
    tableName: 'likes', //table name
    timestamps: true, //enable timestamps
    updatedAt: false // disable updated_at
  },
);

//SETTINGS RELATIONSHIPS

//user relationship [post, comment, reply and like]
User.hasMany(Post, { as: 'userPost' });
User.hasMany(Comment, { as: 'userComment' });
User.hasMany(Reply, { as: 'userReply' });


//post relationship [upper: user] [lower: comment and like]
Post.belongsTo(User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })

Post.hasMany(Comment, { as: 'postComment' });


//comment relationship [upper: user and post] [lower: reply and like]
Comment.belongsTo(User, { onDelete: 'CASCADE', onUpdate: 'CASCADE', })
Comment.belongsTo(Post, { onDelete: 'CASCADE', onUpdate: 'CASCADE', })

Comment.hasMany(Reply, { as: 'commentReply' });


//reply relationship  [upper: user and comment] [lower: like]
Reply.belongsTo(User, { onDelete: 'CASCADE', onUpdate: 'CASCADE', })
Reply.belongsTo(Comment, { onDelete: 'CASCADE', onUpdate: 'CASCADE', })

module.exports = {
  User, Post, Comment, Reply, Like
};