const express = require('express');
const exphba = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const { Pool } = require('pg');

const Factory = require('./regFactory');
const Routes = require('./regRoutes');

const app = express();

const connectionString = 'postgres://muzzaujaysjazq:69196cbdb92a6efe12591b4da277cf9e2f185639fac870a60509cb6db5bfe4e4@ec2-34-249-247-7.eu-west-1.compute.amazonaws.com:5432/ded39ads80c6bl';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.connect();

const factory = Factory(pool);
const regRoutes = Routes(pool, factory);

app.use(session({
    secret: 'keyboard cat5 run all 0v3r',
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());

app.engine('handlebars', exphba({ defaultLayout: 'main', layoutsDir: `${__dirname}/views/layouts` }));
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', regRoutes.root);

app.get('/reg_numbers', regRoutes.regNumbers);

app.get('/reg_numbers/:number', regRoutes.regNumbersFilter);

app.get('/reset', regRoutes.reset);

app.post('/show', regRoutes.show);

const PORT = process.env.PORT || 3012;

app.listen(PORT, () => {
    console.log('App starting on port', PORT);
});
