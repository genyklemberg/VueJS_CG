/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const UserFriends = sequelize.define('UserFriends', {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    friend_id: {
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
    }
  }, {
    tableName: 'users_friends',
    createdAt: 'created_at',
    updatedAt: false,
    classMethods: {
      getUserFriends: function (user_id) {
        return this.findAll({
          where: {
            user_id,
            confirmed: true,
          },
          include: [
            {
              model: sequelize.models.User,
              as: 'friend',
              attributes: ['id', 'name', 'avatar']
            }
          ],
          attributes: ['created_at'],
          order: 'id DESC'
        })
      },
      findUserFriend: function (user_id, friend_id) {
        return this.findOne({
          where: {user_id, friend_id}
        })
      },
      createFriend: function (user_id, friend_id, confirmed) {
        return this.create({ user_id, friend_id, confirmed })
      },
    },
    associate: function (models) {
      UserFriends.hasOne(models.UserNotifications, {as: 'friendInvite', foreignKey: "id"});
      UserFriends.belongsTo(models.User, {as: 'friend', foreignKey: 'friend_id'});
    }
  });

  return UserFriends;
};
