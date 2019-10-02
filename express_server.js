const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

function generateRandomString() {
  let result = "";
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  };
  return result;
};

//root
app.get("/", (req, res) => {
  res.send("Hello!");
});

//shows JSON data 
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//shows all urls
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

//page to create new urls
app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"] }
  res.render("urls_new", templateVars);
});

//create page for new url 
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"],
  };
  res.render("urls_show", templateVars);
});

//generate random string
//add new short url/long url pair to database
app.post("/urls", (req, res) => {
  let string = generateRandomString();
  urlDatabase[string] = req.body.longURL;
  res.redirect(`/urls/${string}`);
});

//short url on individual url page links to long url 
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})

//delete a url 
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//edit a url
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
})

//login
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
})

//logout
app.post("/logout", (req, res) => {
  res.clearCookie('username', req.body.username);
  res.redirect("/urls")
})

app.get("/register", (req, res) => {
  res.render("register");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});