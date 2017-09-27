/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Tags = sequelize.define('Tags', {
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
    tableName: 'tags',
    createdAt: false,
    updatedAt: false,
    classMethods: {
      findOrCreateTag: function (name, news_id) {
        return this.findOrCreate({
          where: {
            name
          },
          defaults: {
            name
          }
        }).then(function (result) {
          sequelize.models.NewsTags.create({
            news_id,
            tag_id:  result[0].dataValues.id
          });
        });
      },
      searchTags: function (name) {
        return this.findAll({
          where: {
            name: { like: `%${name}%` }
          }
        });
      }
    },
    associate: function (models) {
      Tags.belongsToMany(models.Team, {through: models.TeamTags, foreignKey: "tag_id"});
      Tags.belongsToMany(models.News, {through: models.NewsTags, foreignKey: "tag_id"});
      Tags.belongsToMany(models.User, {through: models.UserTags, foreignKey: "tag_id"});
    }
  });
  return Tags;
};
