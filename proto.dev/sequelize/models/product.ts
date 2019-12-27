/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("product", {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    sku: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT(),
      allowNull: false
    },
    inventory_qty: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    }
  }, {
    tableName: "product",

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,
  });
};
