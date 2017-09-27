/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var UserConfirms = sequelize.define('UserConfirms', {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    action: {
      type: DataTypes.STRING
    },
    hash: {
      type: DataTypes.STRING
    },
    store_data: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users_confirms',
    createdAt: 'created_at',
    updatedAt: false,
    classMethods: {
      associate: function(models) {
        UserConfirms.hasOne(models.User, {foreignKey: "user_id"})
      }
    }
  });

  return UserConfirms;
};
