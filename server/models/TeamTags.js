/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const TeamTags = sequelize.define('TeamTags', {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    team_id: {
      type: DataTypes.INTEGER(12)
    },
    tag_id: {
      type: DataTypes.INTEGER(12)
    }
  }, {
    tableName: 'teams_tags',
    timestamps: false,
    createdAt: false,
    classMethods: {
    },
    associate: function(models) {
      TeamTags.belongsTo(models.Tags, {foreignKey: "tag_id"});
      TeamTags.belongsTo(models.Team, {foreignKey: "team_id"});
    }
  });

  return TeamTags;
};
