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

User.belongsToMany(Repo, { as: 'repo', through: 'UserRepos' });
Repo.belongsToMany(User, { as: 'user', through: 'UserRepos' });

Repo.belongsToMany(User, { as: 'favorite', through: 'Favorites' });
User.belongsToMany(Repo, { as: 'userFavorite', through: 'Favorites' });

try {
  await sequelize.sync();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize;