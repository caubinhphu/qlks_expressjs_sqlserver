const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const leTanRoute = require('./routers/letan.router');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('ashdgf33%^aasdf'));

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));


app.get('/', (req, res, next) => res.send('Hello'));


app.use('/letan', leTanRoute);

app.listen(3000, () => console.log('Server is running'));