const app = require("express")();
const PORT = 3000;
const path = require('path');

const session = require('express-session');
app.use(session({
    secret: 'keyboard cat' ,
    resave: false ,
    saveUninitialized: true,
}));

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "" ,
    clientSecret: "" ,
    callbackURL: "http://localhost:3000/auth/google/callback"
},

function (accessToken , refreshToken , profile , done) {
    console.log(profile);
    return done(null,profile);
}
));

passport.serializeUser(function (user, done){
    done(null, user);
});

passport.deserializeUser(function (user, done){
    done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/google',
passport.authenticate('google' ,{ scope: ['https://www.googleapis.com/auth/plus.login']})
);

app.get('/auth/google/callback',
passport.authenticate('google' , {failureRedirect: '/login'}),
function (req, res){
    //Sucessful authentication , redirect success page.
    res.sendFile(path.join(__dirname,'/success.html'));
}
);


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,'/index.html'));
  });

app.listen(PORT , () => {
console.log(`Server is running on port ${PORT}`);
});