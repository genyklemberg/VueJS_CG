/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const TeamUser = sequelize.define('TeamUser', {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    team_id: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    confirmed: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    manage: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    posting: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    edit: {
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
    tableName: 'teams_users',
    createdAt: 'created_at',
    updatedAt: false,
    classMethods: {
      findUserTeam: function (user_id) {
        return this.findOne({
          where: {
            user_id
          }
        });
      }
    },
    associate: function(models) {
      TeamUser.belongsTo(models.Team, {foreignKey: "team_id"});
      TeamUser.belongsTo(models.User, {foreignKey: "user_id"});
      TeamUser.hasOne(models.UserNotifications, {as: 'teamInvite', foreignKey: "id"});
    }
  });

  return TeamUser;
};
