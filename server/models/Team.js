/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Team = sequelize.define('Team', {
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
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    owner_id: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'teams',
    createdAt: 'created_at',
    updatedAt: false,
    classMethods: {
      getUserTeam: function (id) {
        return this.findOne({
          where: {id},
          include: [
            {
              model: sequelize.models.User,
              through: {
                where: {confirmed: 1},
                attributes: ['edit', 'manage', 'posting']
              },
              as: 'users',
              attributes: ['id', 'name', 'avatar']
            },
            {
              model: sequelize.models.User,
              as: 'owner',
              attributes: ['id', 'name', 'avatar']
            },
            {
              model: sequelize.models.Tags,
              as: 'tags',
              through: {
                attributes: []
              },
              attributes: ['id', 'name'],
              required: false
            },
          ],
          attributes: ['id', 'game_id', 'name', 'avatar', 'owner_id', 'created_at']
        })
      }
    },
    associate: function (models) {
      Team.belongsToMany(models.Tags, {through: models.TeamTags, foreignKey: "team_id", as: "tags"});
      Team.belongsToMany(models.User, {through: models.TeamUser, foreignKey: "team_id", as: "users"});
      Team.belongsTo(models.User, {foreignKey: "owner_id", as: 'owner'})
    }
  });

  return Team;
};
