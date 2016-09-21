export default (sequelize, DataTypes) => {
  const Issue = sequelize.define('Issue', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Issue;
};
