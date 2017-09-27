/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    steam_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    confirmed: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    manual_stats_update: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: false,
    classMethods: {
      searchUser: function (searchString) {
        return this.findOne({
          where: {
            $or: [
              { email: { $eq: searchString } },
              { name: { $eq: searchString } },
              { nickname: { $eq: searchString } }
            ]
          }
        })
      },
      searchUserByName: function (searchString, id) {
        return this.findAll({
          where: {
            id: {
              $ne: id
            },
            $or: [
              { email: { like: `%${searchString}%` } },
              { name: { like: `%${searchString}%` } },
              { nickname: { like: `%${searchString}%` } }
            ]
          },
          attributes: ['id', 'name', 'nickname', 'avatar']
        })
      },
      getUser: function (id) {
        return this.findOne({
          where: { id },
          include: [
            sequelize.models.UserDotaStats,
            sequelize.models.UserCsgoStats,
            {
              model: sequelize.models.Tags,
              as: 'tags',
              through: {
                attributes: []
              },
              attributes: ['id', 'name'],
              required: false
            },
            {
              model: sequelize.models.TeamUser,
              as: 'team',
              where: {confirmed: 1},
              attributes: ['team_id', 'confirmed', 'created_at'],
              required: false
            }
          ],
          attributes: ['id', 'name', 'nickname', 'confirmed', 'avatar', 'email', 'steam_id', 'manual_stats_update']
        })
      },
      getPublicUser: function (id) {
        return this.findOne({
          where: { id },
          include: [
            sequelize.models.UserDotaStats,
            sequelize.models.UserCsgoStats,
            {
              model: sequelize.models.Tags,
              as: 'tags',
              through: {
                attributes: []
              },
              attributes: ['id', 'name'],
              required: false
            },
            {
              model: sequelize.models.TeamUser,
              as: 'team',
              where: {confirmed: 1},
              attributes: ['team_id', 'confirmed', 'created_at'],
              required: false
            }
          ],
          attributes: ['id', 'name', 'nickname', 'avatar', 'steam_id', 'created_at']
        })
      }
    },
    associate: function (models) {
      User.hasMany(models.UserConfirms, {foreignKey: "user_id"});
      User.hasOne(models.UserDotaStats, {foreignKey: "user_id"});
      User.hasOne(models.UserDotaHeroes, {foreignKey: "user_id"});
      User.hasOne(models.UserCsgoStats, {foreignKey: "user_id"});
      User.hasOne(models.UserFriends, {as: 'friend', foreignKey: "id"});
      User.hasMany(models.UserNotifications, {as: 'author', foreignKey: "author_id"});
      User.hasMany(models.UserNotifications, {as: 'user', foreignKey: "user_id"});
      User.hasOne(models.TeamUser, {as: "team", foreignKey: "user_id"});
      User.belongsToMany(models.Team, {through: models.TeamUser, foreignKey: "user_id", as: "users"});
      User.belongsToMany(models.Tags, {through: models.UserTags, foreignKey: "user_id", as: "tags"});
      User.hasMany(models.News, {as: 'user', foreignKey: 'author_id'});
    }
  });

  return User;
};
