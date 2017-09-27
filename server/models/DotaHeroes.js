/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const DotaHeroes = sequelize.define('DotaHeroes', {
    id: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    primary_attr: {
      type: DataTypes.STRING,
      allowNull: true
    },
    attack_type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 0
    },
    roles: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 0
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 0
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'dota_heroes',
    createdAt: false,
    updatedAt: 'updated_at',
    classMethods: {
    },
    associate: function (models) {
      DotaHeroes.hasOne(models.UserDotaHeroes, {foreignKey: 'hero_id', as: 'hero'})
    }
  });

  return DotaHeroes;
};
