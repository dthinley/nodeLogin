var express 				= require("express");
var mongoose 				=require("mongoose");
var passport 				= require("passport");
var bodyParser 				=require("body-parser");
var LocalStrategy 			= require("passport-local");
var passportLocalMongoose 	= require("passport-local-mongoose");
var User					= require("./models/user");

mongoose.connect("mongodb://localhost/auth_demo_app");

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
	secret: "I am king",
	resave: false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//========
// ROUTES
//========


app.get("/", function(req, res){
	res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
	res.render("secret");
});

//===========
//AUTH ROUTES
//===========
app.get("/register", function(req, res){
	res.render("register");
});
//handling user sign up
app.post("/register", function(req,res){
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}),
	req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render('register');
		} passport.authenticate("local")(req, res, function(){
			res.redirect("/secret");
		});

	});

});
//============
//LOGIN ROUTES
//============
//RENDER LOGIN FORM

app.get("/login", function(req, res){
	res.render("login");
});

//login logic
//MIDDLEWARE
app.post("/login", passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "login"
}), function(req, res){

});


//=============
//LOGOUT ROUTES
//=============
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

//=============
//MIDDLEWARE
//=============

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, () => {
  console.log('Listening on localhost:3000')
})