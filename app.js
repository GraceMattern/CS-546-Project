const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');

const session = require('express-session')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

const path = require('path');
app.use("/public", static);

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// register custom handlebars
var hbs = exphbs.create({});
hbs.handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.handlebars.registerHelper('ifGLE', function(arg1, arg2, options) {
    return (parseInt(arg1) >= parseInt(arg2)) ? options.fn(this) : options.inverse(this);
});

app.use(cookieParser());

app.use(express.json());

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
}))

// logging middleware
app.use('/', async (req, res, next) => {
    if(req.session.user) {
        console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (Authenticated User)`);
    }
    else {
        console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (Non-Authenticated User)`);
    }    
    next();
});

// authentication middleware
app.get('/private',async (req, res,next) => {
    // console.log(`app: ${req.session.user}`)
    if(req.session.user){
        next();
    } else  {
        res.status(403).render('login/error', {title: 'Error', error: 'Not logged in'});
    }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
