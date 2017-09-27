/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const UserNotifications = sequelize.define('UserNotifications', {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    author_id: {
      type: DataTypes.INTEGER(12),
      allowNull: true,
      default: 0
    },
    user_id: {
      type: DataTypes.INTEGER(12),
      allowNull: true,
    },
    team_request_id: {
      type: DataTypes.INTEGER(12),
      allowNull: true,
    },
    friend_request_id: {
      type: DataTypes.INTEGER(12),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    checked: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users_notifications',
    createdAt: 'created_at',
    updatedAt: false,
    classMethods: {
      createNotification: function (author_id, user_id, title, message, friend_request_id, team_request_id) {
        return this.create({ author_id, user_id, title, message, friend_request_id, team_request_id })
      },
    },
    associate: function(models) {
      UserNotifications.belongsTo(models.User, { as: 'author', foreignKey: 'author_id'});
      UserNotifications.belongsTo(models.TeamUser, { as: 'teamInvite', foreignKey: 'team_request_id'});
      UserNotifications.belongsTo(models.UserFriends, { as: 'friendInvite', foreignKey: 'friend_request_id'});
    }
  });

  return UserNotifications;
};
