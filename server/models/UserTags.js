/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const UserTags = sequelize.define('UserTags', {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(12)
    },
    tag_id: {
      type: DataTypes.INTEGER(12)
    }
  }, {
    tableName: 'users_tags',
    timestamps: false,
    createdAt: false,
    classMethods: {
    },
    associate: function(models) {
      UserTags.belongsTo(models.Tags, {foreignKey: "tag_id"});
      UserTags.belongsTo(models.User, {foreignKey: "user_id"});
    }
  });

  return UserTags;
};
