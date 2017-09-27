/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('NewsLikes', {
    news_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    active: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    tableName: 'news_likes',
    timestamps: false,
    createdAt: false
  });
};
