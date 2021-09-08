const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/signup", async (req, res) => {
    res.render("auths/signup");
});

router.post("/signup", async (req, res) => {
    const {username, password} = req.body;
    if(username === "" || password === ""){
        res.render("auths/signup", {errorMessage: "Fill the username and password"});
        return;
    }

    const user = await User.findOne({username});
    if(user !== null){
        res.render("auths/signup", {errorMessage: "User already exists!!"});
        return;
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await User.create(
        {
            username,
            password: hashedPassword,
        }
    );
    res.redirect("/");
});

router.get("/login", async (req, res) => {
    res.render("auths/login");
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    if(username === "" || password === ""){
        res.render("auths/login", {errorMessage: "Fill the username and password"});
        return;
    }

    const user = await User.findOne({username});
    if(user === null){
        res.render("auths/login", {errorMessage: "Invalid User"});
        return;
    }

    if(bcrypt.compareSync(password, user.password)){
        req.session.currentUser = user;
        res.redirect("/");
    } else{
        res.render("auths/login", {errorMessage: "Invalid User"});
    }
});

router.post("/logout", async (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;