import { Sequelize } from "sequelize-typescript";

module.exports = (sequelize: Sequelize, DataTypes: {[key: string]: any}) => {
  return sequelize.define("cart_product", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    cart_id: {
      allowNull: false,
      type: DataTypes.INTEGER(10).UNSIGNED
      // TODO: Apply references
    },
    product_id: {
      allowNull: false,
      type: DataTypes.INTEGER(10).UNSIGNED
      // TODO: Apply references
    }
  }, {
    tableName: "cart_product",

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true
  });
};
