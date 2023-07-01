//@ts-check
import { Schema, model } from "mongoose";

const schema = new Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: { type: Number },
      },
    ],
    required: true,
  },
});

schema.pre("findOne", function () {
  this.populate("products.product");
});

schema.pre("find", function () {
  this.populate("products.product");
});

export const CartModel = model("carts", schema);
