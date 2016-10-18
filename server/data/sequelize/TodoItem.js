export default (sequelize, DataTypes) => {
  const TodoItem = sequelize.define('TodoItem', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  });

  return TodoItem;
};
