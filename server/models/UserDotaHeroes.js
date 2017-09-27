/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const UserDotaHeroes = sequelize.define('UserDotaHeroes', {
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
    hero_id: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    games: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    win: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    last_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    tableName: 'users_dota_heroes',
    classMethods: {
      getUserHeroes: function (user_id) {
        return this.findAll({
          where: {user_id},
          include: [
            {
              model: sequelize.models.DotaHeroes,
              as: 'hero',
              attributes: ['name', 'img']
            }
          ],
          attributes: ['games', 'win', 'last_time', 'hero_id']
        })
      }
    },
    associate: function (models) {
      UserDotaHeroes.belongsTo(models.DotaHeroes, {foreignKey: 'hero_id', as: 'hero'})
    }
  });

  return UserDotaHeroes;
};
