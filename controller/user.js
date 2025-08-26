const User = require('../models/user');

module.exports.renderSignUp = (req, res) => {
    res.render("./users/signup");
}

module.exports.signUp =  async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            username: username,
            email: email
        })

        const registredUser = await User.register(newUser, password);
        req.login(registredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("succes", "welcome to wonderlust");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}

module.exports.renderLogin =  (req, res) => {
    res.render("./users/login");
}

module.exports.login =  async (req, res) => {
    req.flash("succes", "welcome back to wonderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("succes", "You are logged out now");
        res.redirect("/listings");
    });
}