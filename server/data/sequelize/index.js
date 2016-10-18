import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

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


export async function scaffold() {
  // Scaffold some Issues
  await sequelize.sync({ force: true });

  const issuesData = _.times(20, i => ({
    name: `Issue ${i}`,
  }));
  const issues = await models.Issue.bulkCreate(issuesData);


  const todoItemsData = [];
  issues.forEach((issue) => {
    _.times(_.random(1, 10), (i) => {
      const name = `TodoItem ${i} for ${issue.name}`;
      const issueId = issue.id;

      todoItemsData.push({ issueId, name });
    });
  });

  // const todoItems = await models.TodoItem.bulkCreate(issuesData);
}

export default sequelize;
