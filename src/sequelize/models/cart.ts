import { Sequelize } from "sequelize-typescript";

module.exports = (sequelize: Sequelize, DataTypes: {[key: string]: any}) => {
  return sequelize.define("cart", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    uuid: {
      allowNull: false,
      type: DataTypes.STRING(36),
      unique: true
    }
  }, {
    tableName: "cart",

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true
  });
};
