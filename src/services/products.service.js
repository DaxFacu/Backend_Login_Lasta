import { ProductModel } from "../DAO/models/products.model.js";

class ProductsService {
  async getAllProducts() {
    const products = await ProductModel.find();

    return products;
  }

  async createProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
    id
  ) {
    console.log(title);
    const productCreated = await ProductModel.create({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
      id,
    });
    return productCreated;
  }

  async updateProduct(
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) {
    const productUpdated = await ProductModel.updateOne(
      { _id: id },
      { title, description, code, price, status, stock, category, thumbnail }
    );
    return productUpdated;
  }

  async deleteProduct(id) {
    const deleted = await ProductModel.deleteOne({ _id: id });
    return deleted;
  }
}

export const productsService = new ProductsService();
