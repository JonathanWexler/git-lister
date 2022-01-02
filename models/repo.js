export default (sequelize, DataTypes) => {
  return sequelize.define('Repo', {
    title: {
      type: DataTypes.STRING,
    },
    githubId: {
      type: DataTypes.STRING
    },
    
    description: {
      type: DataTypes.STRING
    },
    author: {
      type: DataTypes.STRING
    },
    issuesCount: {
      type: DataTypes.INTEGER
    },
    lastUpdated: {
      type: DataTypes.DATE
    },
    isRepo: {
      type: DataTypes.BOOLEAN,
      default: true
    },
  }, {});
}