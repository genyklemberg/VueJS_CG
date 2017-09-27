/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const UserCsgoStats = sequelize.define('UserCsgoStats', {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    total_kills: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    total_deaths: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    total_wins: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    total_damage_done: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    total_money_earned: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    total_kills_headshot: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    updatedAt: 'updated_at',
    createdAt: false,
    tableName: 'users_csgo_stats'
  });

  return UserCsgoStats;
};
