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
  await sequelize.sync({ force: true });

  const issues = [];
  const nIssues = 10;
  for (let i = 0; i < nIssues; i++) {
    const name = `Issue ${i + 1}`;
    const issue = await models.Issue.create({ name });
    issues.push(issue);
  }


  for (const issue of issues) {
    const nTodos = _.random(1, 5);
    for (let i = 0; i < nTodos; i++) {
      const name = `TodoItem ${i + 1} for ${issue.name}`;

      await issue.createTodoItem({ name });
    }
  }

  await models.User.create({
    name: 'Test user',
    username: 'test',
    email: 'test@dice.fm',
  });
}

export default sequelize;
