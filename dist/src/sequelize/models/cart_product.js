"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize, DataTypes) => {
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
        timestamps: false
    });
};
//# sourceMappingURL=cart_product.js.map