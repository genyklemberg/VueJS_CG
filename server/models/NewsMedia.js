/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const NewsMedia = sequelize.define('NewsMedia', {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    news_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    preview: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'news_media',
    createdAt: 'created_at',
    updatedAt: false,
    classMethods: {
      getWhoShared: function (original_id) {
        return this.findAll({
          where: { original_id },
          include: [
            {
              model: sequelize.models.User,
              as: 'user',
              attributes: ['id', 'nickname', 'avatar']
            }
          ],
          attributes: [],
          group: ['user.id'],
          order: 'id DESC'
        });
      },
    },
    associate: function(models) {
    }
  });
  return NewsMedia;
};
