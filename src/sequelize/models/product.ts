import { Sequelize } from "sequelize-typescript";

module.exports = (sequelize: Sequelize, DataTypes: {[key: string]: any}) => {
  return sequelize.define("product", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    sku: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(5)
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(45)
    },
    price: {
      allowNull: false,
      type: DataTypes.FLOAT()
    },
    inventory_qty: {
      allowNull: false,
      type: DataTypes.INTEGER(10)
    }
  }, {
    tableName: "product",

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,
  });
};
