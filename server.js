if (process.env.NODE_ENV !== "production") {
    // require('dotenv').config()
    const dotenv = require('dotenv').config()
}

// Importing all Libraies that we installed using npm
const express = require("express")
const app = express()
const bcrypt = require("bcrypt") // Importing bcrypt package
const passport = require("passport")
const initializePassport = require("./passport-confiig")
const flash = require("express-flash")
const session = require("express-session")
// const methodOverride = require("method-override")



initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)


const users = []

app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, /// We won't resave the session variable if nothing has changed
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport,session())

const PORT = 9000

// Configuring the register post functionality
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))
app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            
        })
        console.log(users); // Dsiplays newly registered users in the console
        res.redirect("/login")

    } catch (e) {
        console.log(e);
        res.redirect("/register")
    }
})

// Routes
app.get('/', (req, res) => {
    res.render("index.ejs")
})

app.get('/login', (req, res) => {
    res.render("login.ejs")
})

app.get('/register', (req, res) => {
    res.render("register.ejs")
})
// end of Routes

console.log(users); // Dsiplays newly registered users in the console

app.listen(PORT,(req, res) => {
    console.log(`http://localhost:${PORT}`)
}) 