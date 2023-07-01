import express from "express";
import { UserModel } from "../DAO/models/users.model.js";

export const loginRouter = express.Router();

// loginRouter.get("/", async (req, res) => {
//   res.send("hola mundo");
// });

loginRouter.post("/register", async (req, res) => {
  const { firstName, lastName, age, email, password } = req.body;
  if (!firstName || !lastName || !age || !email || !password) {
    return res.status(400).render("error-page", {
      msg: "faltan datos",
      link: "/register",
      textLink: "Volver al registro",
    });
  }
  try {
    await UserModel.create({
      firstName,
      lastName,
      age,
      email,
      password,
      rol: "user",
    });
    req.session.firstName = firstName;
    req.session.lastName = lastName;
    req.session.email = email;
    req.session.rol = "user";
    return res.redirect("/products");
  } catch (e) {
    console.log(e);
    return res.status(400).render("error-page", {
      msg: "controla tu email y intenta mas tarde",
      textLink: "Volver al registro",
    });
  }
});

loginRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).render("error-page", {
      msg: "faltan datos",
      link: "/login",
      textLink: "Volver a login",
    });
  }
  try {
    const foundUser = await UserModel.findOne({ email });
    console.log(foundUser);
    if (foundUser && foundUser.password === password) {
      req.session.firstName = foundUser.firstName;
      req.session.lastName = foundUser.lastName;
      req.session.email = foundUser.email;
      req.session.rol = foundUser.rol;
      return res.redirect("/products");
    } else {
      return res.status(400).render("error-page", {
        msg: "email o pass incorrectos",
        link: "/login",
        textLink: "Volver al registro",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).render("error-page", {
      msg: "error inesperado en servidor",
      link: "/register",
      textLink: "Volver al registro",
    });
  }
});

loginRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.render("error-page", {
        msg: "no se pudo cerrar la session",
        link: "/products",
        textLink: "Volver a productos",
      });
    }
    return res.redirect("/login");
  });
});
