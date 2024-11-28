const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Security = require(MISC_CON + 'security.cla');

class User extends Model {}

User.init(
  {
    // Model attributes are defined here
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
      defaultValue: 1
    },
    reg_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User', // We need to choose the model name
    tableName: 'users', //table name
    timestamps: true, //enable timestamps
    updatedAt: false // disable updated_at
  },
);

//create table automatically
sequelize.sync({ force: false })

module.exports = User;