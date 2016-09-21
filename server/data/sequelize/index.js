import Sequelize from 'sequelize';

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

sequelize.define('Issue', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});


sequelize.sync({ force: true });


export default sequelize;
