/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var NewsTags = sequelize.define('NewsTags', {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    news_id: {
      type: DataTypes.INTEGER(12)
    },
    tag_id: {
      type: DataTypes.INTEGER(12)
    }
  }, {
    tableName: 'news_tags',
    timestamps: false,
    createdAt: false,
    classMethods: {
    },
    associate: function(models) {
      NewsTags.belongsTo(models.Tags, {foreignKey: "tag_id"});
      NewsTags.belongsTo(models.News, {foreignKey: "news_id"});
    }
  });
  
  return NewsTags;
};
