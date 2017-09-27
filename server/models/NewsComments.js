/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  let NewsComments = sequelize.define('NewsComments', {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    news_id: {
      type: DataTypes.INTEGER(12),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER(12),
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'news_comments',
    createdAt: 'created_at',
    updatedAt: false,
    classMethods: {
      getComment: function (id) {
        return this.findOne({
          where: {id},
          include: [
            {
              model: sequelize.models.User,
              as: 'user',
              attributes: ['id', 'name', 'avatar'],
              required: false
            }
          ]
        })
      },
      getNewsComment: function (news_id) {
        return this.findAll({
          where: {news_id},
          include: [
            {
              model: sequelize.models.User,
              as: 'user',
              attributes: ['id', 'name', 'avatar'],
              required: false
            }
          ],
          limit: 10,
          order: 'id ASC'
        })
      },
    },
    associate: function (models) {
      NewsComments.belongsTo(models.User, {foreignKey: "user_id", as: "user"});
    }
  });

  return NewsComments;
};
