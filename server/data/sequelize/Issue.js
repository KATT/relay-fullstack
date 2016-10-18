export default (sequelize, DataTypes) => {
  const Issue = sequelize.define('Issue', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: models => { // eslint-disable-line
        const { TodoItem } = models;

        Issue.TodoItem = Issue.hasMany(TodoItem);
        TodoItem.Issue = TodoItem.belongsTo(Issue);
      },
    }
  });

  return Issue;
};
