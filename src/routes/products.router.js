import express from "express";
import { productsService } from "../services/products.service.js";
import { ProductModel } from "../DAO/models/products.model.js";
export const routerProducts = express.Router();

routerProducts.get("/", async (req, res) => {
  try {
    const { page, limit, category, status, sort } = req.query;

    var querySelect = undefined;
    if (category) {
      querySelect = { category: category };
    } else if (status) {
      querySelect = { status: status };
    } else {
      querySelect = undefined;
    }
    console.log(querySelect);
    const products = await ProductModel.paginate(
      { ...querySelect },
      {
        limit: limit || 10,
        page: page || 1,
        sort: { price: sort },
      }
    );
    return res.status(200).json({
      status: "success",

      payload: products,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      // prevLink: products.prevLink,
      // nextLink: products.nextLink,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

routerProducts.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;
    const productCreated = await productsService.createProduct(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail
    );

    return res.status(201).json({
      status: "success",
      msg: "user created",
      data: productCreated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

routerProducts.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;

    const productUptaded = await productsService.updateProduct(
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail
    );
    return res.status(201).json({
      status: "success",
      msg: "product uptaded",
      data: productUptaded,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

routerProducts.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await productsService.deleteProduct(id);
    return res.status(200).json({
      status: "success",
      msg: "product deleted",
      data: {},
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});
