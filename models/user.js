export default (sequelize, DataTypes) => {
  return sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING
    },
    
    username: {
      type: DataTypes.STRING
    },
    githubId: {
      type: DataTypes.STRING
    },
    githubToken: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    bio: {
      type: DataTypes.TEXT
    },
    imageURL: {
      type: DataTypes.STRING
    },
    hash: {
      type: DataTypes.STRING
    },
  }, {});
}



