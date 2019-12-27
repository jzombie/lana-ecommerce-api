/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("cart", {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false
    }
  }, {
    tableName: "cart",

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,
  });
};
