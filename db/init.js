import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import UserSchema from '#models/user.js';
import RepoSchema from '#models/repo.js';

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres'
})

export const User = UserSchema(sequelize, DataTypes);
export const Repo = RepoSchema(sequelize, DataTypes);

Repo.belongsTo(User);
User.hasMany(Repo);

User.belongsToMany(Repo, { as: 'connectedUsers', through: 'UserRepos' });
Repo.belongsToMany(User, { as: 'connectedRepos', through: 'UserRepos' });

Repo.belongsToMany(User, { as: 'favorites', through: 'Favorites' });
User.belongsToMany(Repo, { as: 'favorites', through: 'Favorites' });

try {
  await sequelize.sync();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize;