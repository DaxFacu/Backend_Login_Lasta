import express from "express";
import handlebars from "express-handlebars";
import { ProductManager } from "./ProductManager.js";
// import { CartManager } from "./CartManager.js";
import { routerProducts } from "./routes/products.router.js";
import { routerCarts } from "./routes/cart.router.js";
import { viewsRouter } from "./routes/views.router.js";
import { routerUsers } from "./routes/users.router.js";
import { loginRouter } from "./routes/login.router.js";
import { Server } from "socket.io";
import { __dirname } from "./utils/utils.js";
import { connectMongo } from "./utils/conection.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import FileStore from "session-file-store";
const FileStoreSession = FileStore(session);

const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectMongo();

const productManager = new ProductManager("Products.json");

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://facundolasta:Mn1EJoLYsEyEsZPg@back-test.otvhkve.mongodb.net/?retryWrites=true&w=majority",
      ttl: 86400 * 7,
    }),
    secret: "un-re-secreto",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/api/products", routerProducts);

app.use("/api/carts", routerCarts);

app.use("/api/users", routerUsers);

const httpServer = app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});

export const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

socketServer.on("connection", (socket) => {
  console.log("Cliente conectado");
  const products = productManager.getProducts();
  socket.emit("realtimeproducts", products);
});

app.use("/", viewsRouter);
app.use("/realtimeproducts", viewsRouter);
app.use("/products", viewsRouter);
app.use("/api/sessions", loginRouter);
app.get("*", (req, res) => {
  res.status(404).send({ status: "error", data: "Página no encontrada" });
});
