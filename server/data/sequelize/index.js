import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';

const {
  PG_MAIN_DB,
  PG_MAIN_USER,
  PG_MAIN_PASSWORD,
  PG_MAIN_HOST,
} = process.env;

const sequelize = new Sequelize(
  PG_MAIN_DB,
  PG_MAIN_USER,
  PG_MAIN_PASSWORD,
  {
    dialect: 'postgres',
    host: PG_MAIN_HOST,
    // logging: false,
  },
);


const models = {};

// method taken from https://github.com/sequelize/express-example/blob/master/models/index.js
fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0)
  .filter(file => fs.statSync(path.join(__dirname, file)).isFile())
  .filter(file => file !== 'index.js')
  .forEach((file) => {
    const Model = sequelize.import(path.join(__dirname, file));
    models[Model.name] = Model;
  });

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});


sequelize.sync({ force: true });


export default sequelize;
