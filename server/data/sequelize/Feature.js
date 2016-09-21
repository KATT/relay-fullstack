export default (sequelize, DataTypes) => {
  const { STRING } = DataTypes;

  const Feature = sequelize.define('Feature', {
    name: {
      type: STRING,
      allowNull: false,
    },
    description: {
      type: STRING,
      allowNull: false,
    },
    url: {
      type: STRING,
      allowNull: false,
    }
  });

  return Feature;
};
