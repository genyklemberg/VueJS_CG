/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const News = sequelize.define('News', {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    game_id: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    original_id: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    original_author_id: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    author_id: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    chapters: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    published: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "0"
    },
    isTeam: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "0"
    },
    like_count: {
      type: DataTypes.INTEGER(12),
      defaultValue: 0,
      allowNull: true
    },
    share_count: {
      type: DataTypes.INTEGER(12),
      defaultValue: 0,
      allowNull: true
    },
    views_count: {
      type: DataTypes.INTEGER(12),
      defaultValue: 1,
      allowNull: true
    },
    comment_count: {
      type: DataTypes.INTEGER(12),
      defaultValue: 0,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'news',
    createdAt: 'created_at',
    updatedAt: false,
    classMethods: {
      getAllPublishedNews: function()  {
        return this.findAll({
          where: {
            published: 1
          },
          include: [
            {
              model: sequelize.models.Tags,
              through: {
                attributes: []
              },
              as: 'tags',
              attributes: ['name']
            },
            {
              model: sequelize.models.User,
              as: 'user',
              attributes: ['id', 'name', 'avatar'],
              required: false
            },
            {
              model: sequelize.models.Team,
              as: 'team',
              attributes: ['id', 'name', 'avatar'],
              required: false
            },
            {
              model: sequelize.models.User,
              as: 'user_original',
              attributes: ['id', 'name', 'avatar'],
              required: false
            },
            {
              model: sequelize.models.News,
              as: 'original',
              attributes: ['id', 'created_at'],
              required: false
            }
          ],
          limit: 10,
          attributes: ['id', 'content', 'chapters', 'created_at', 'like_count', 'share_count', 'author_id', 'original_author_id', 'original_id', 'views_count', 'comment_count', 'isTeam'],
          order: 'id DESC'
        })
      },
      getSingleNews: function(id)  {
        return this.findOne({
          where: {
            published: 1,
            id
          },
          include: [
            {
              model: sequelize.models.Tags,
              through: {
                attributes: []
              },
              as: 'tags',
              attributes: ['name']
            },
            {
              model: sequelize.models.User,
              as: 'user',
              attributes: ['id', 'name', 'nickname', 'avatar'],
              required: false
            },
            {
              model: sequelize.models.Team,
              as: 'team',
              attributes: ['id', 'name', 'avatar'],
              required: false
            },
            {
              model: sequelize.models.User,
              as: 'user_original',
              attributes: ['id', 'name', 'avatar'],
              required: false
            },
            {
              model: sequelize.models.News,
              as: 'original',
              attributes: ['id', 'created_at'],
              required: false
            }
          ],
          attributes: ['id', 'content', 'chapters', 'created_at', 'like_count', 'share_count', 'author_id', 'original_author_id', 'original_id', 'views_count', 'comment_count', 'isTeam']
        })
      },
      getAllPublishedNewsAuthor: function (id, isTeam) {
        return this.findAll({
          where: {
            published: 1,
            isTeam,
            author_id: id
          },
          include: [
            {
              model: sequelize.models.Tags,
              through: {
                attributes: []
              },
              as: 'tags',
              attributes: ['name']
            },
            {
              model: sequelize.models.Team,
              as: 'team',
              required: false,
              attributes: ['id', 'name', 'avatar']
            },
            {
              model: sequelize.models.User,
              as: 'user',
              attributes: ['id', 'name', 'avatar'],
              required: false
            },
            {
              model: sequelize.models.User,
              as: 'user_original',
              attributes: ['id', 'name', 'avatar'],
              required: false
            },
            {
              model: sequelize.models.News,
              as: 'original',
              attributes: ['id', 'created_at'],
              required: false
            }
          ],
          limit: 10,
          attributes: ['id', 'content', 'chapters', 'created_at', 'like_count', 'share_count', 'author_id', 'original_author_id', 'original_id', 'views_count', 'comment_count', 'isTeam'],
          order: 'id DESC'
        })
      },
      getWhoShared: function (original_id) {
        return this.findAll({
          where: { original_id },
          include: [
            {
              model: sequelize.models.User,
              as: 'user',
              attributes: ['id', 'name', 'nickname', 'avatar']
            }
          ],
          attributes: [],
          group: ['user.id'],
          order: 'id DESC'
        });
      },
    },
    associate: function(models) {
      News.belongsToMany(models.Tags, {through: models.NewsTags, foreignKey: "news_id", as: "tags"});
      News.belongsTo(models.User, {foreignKey: "author_id", as: "user"});
      News.belongsTo(models.User, {foreignKey: "original_author_id", as: "user_original"});
      News.belongsTo(models.Team, {foreignKey: "author_id", as: "team"});
      News.belongsTo(models.News, {foreignKey: "original_id", as: "original"});
    }
  });
  return News;
};
