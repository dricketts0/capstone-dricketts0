const express = require('express'); 
const exphbs = require('express-handlebars');
const routes = require('./routes');

const app = express();
app.engine('hbs', exphbs({ extname: 'hbs' }));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }));
app.use('/', routes);  

const listener = app.listen(3000, () => {
    console.log('server listening on port ' + listener.address().port);
});
