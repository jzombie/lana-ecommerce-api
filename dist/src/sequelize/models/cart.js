"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("cart", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER(10).UNSIGNED
        },
        uuid: {
            allowNull: false,
            type: DataTypes.STRING(36)
        }
    }, {
        tableName: "cart",
        timestamps: false
    });
};
//# sourceMappingURL=cart.js.map