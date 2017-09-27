/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const UserDotaStats = sequelize.define('UserDotaStats', {
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
    win: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    lose: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    solo_mmr: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    party_mmr: {
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
    tableName: 'users_dota_stats'
  });

  return UserDotaStats;
};
