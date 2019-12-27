/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("cart_product", {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    cart_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      // TODO: Apply references
    },
    product_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      // TODO: Apply references
    }
  }, {
    tableName: "cart_product",

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,
  });
};
