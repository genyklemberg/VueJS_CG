/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Games = sequelize.define('Game', {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'games',
    createdAt: false,
    updatedAt: false,
    classMethods: {
    },
    associate: function (models) {
    }
  });
  return Games;
};
