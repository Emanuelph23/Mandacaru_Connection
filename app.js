const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const flash = require('express-flash');

const app = express();

const conn = require('./db/conn');
//Models
const Tought = require('./models/Tought');
const User = require('./models/User');

//Import Routes
const routes = require('./routes/toughtsRoutes');

// Handlebars Middleware
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session Middleware
app.use(
    session({
        name: 'session',
        secret: 'us_secret',
        resave: false,
        saveUninitialized: false,
        store: new fileStore({
            logFn: function () {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true,
        },
    })
);

// Express Flash Messages Middleware
app.use(flash());

// Static Folder Middleware
app.use(express.static('public'));

//Set Session to Response
app.use((req, res, next) => {

    if(req.session.userid){
        res.locals.session = req.session;
    }

    next();

});

//Routes
app.use('/', routes);

conn
    .sync()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((error) => console.log(error));