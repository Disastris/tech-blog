const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
//const routes = require("./controllers");
//const helpers = require("./utils/helpers");
const { User } = require("./models"); // normally in controllers

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
//const hbs = exphbs.create({ helpers });
const hbs = exphbs.create({});

const sess = {
  secret: "Super secret secret",
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//app.use(routes);
//Page of all users for the system administrator
//contollers/homeRoutes.js
app.get("/", async (req, res) => {
  const userData = await User.findAll({});
  //res.json(userData);

  // const users = userData.get({ plain: true }); // converts into array / object without extra sequelize stuff

  res.render("all-users", {
    users: userData,
    logged_in: req.session.logged_in,
  });
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
