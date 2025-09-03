if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express');
const app = express();
const port = 8081;
const mongoose = require('mongoose')
const mongo_url = `mongodb+srv://jagadalepranali81:${process.env.MONGO_PASSWORD}@cluster0.edb97dr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const MongoStore = require('connect-mongo')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

const store = MongoStore.create({
    mongoUrl: mongo_url,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600
})

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized : true,
    cookie:{
        expires:Date.now()+3*24*60*60*1000,
        maxAge:3*24*60*60*1000,
        httpOnly:true
    }
};
 
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/demouser",async(req,res)=>{
    let fakeUser = new User({
        email:"pranalijagadale678@gmail.com",
        username:"pranalij"
    });

    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
})

app.use((req,res,next)=>{
    res.locals.succes  = req.flash("succes");
    res.locals.error  = req.flash("error");
    res.locals.currentUser  = req.user;
    next();
})

const listingsRouter = require('./routes/listing');  
const reviewsRouter = require('./routes/reviews');
const userRouter = require('./routes/userRouter');

async function main() {
    try {
        await mongoose.connect(mongo_url);
    }
    catch (err) {
        throw err;
    }
}
main()
    .then(() => {
        console.log("connection done");
    })
    .catch(err => {
        console.log(err);
    })



// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "my home",
//         description : "on beach",
//         price: 1200,
//         location:"goa",
//         country:"india"
//     })
//      await sampleListing.save();
//     console.log("sample saved");
//     res.send("succesful");
// })

app.use("/listings" ,listingsRouter);
app.use("/listings/:id/reviews" ,reviewsRouter);
app.use("/" ,userRouter);

// app.all("*",(req, res, next)=>{
//     next(new ExpressError(404, "page not found :("))
// })

app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

app.use((err, req, res, next) => {
    let { status, message } = err;
    // res.status(status).send(message);
    res.render("error", { message })
})

app.use((err, req, res, next) => {
    res.send("something went wrong :(");
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
});
