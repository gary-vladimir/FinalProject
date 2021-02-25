let projectData = {};

const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

dotenv.config();

const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME;
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use(express.static('dist'));

app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
});

app.get('/get_data', (req, res) => {
    res.send({
        GEONAMES_USERNAME: GEONAMES_USERNAME,
        WEATHERBIT_API_KEY: WEATHERBIT_API_KEY,
        PIXABAY_API_KEY: PIXABAY_API_KEY,
    });
});

const port = 8000;

const server = app.listen(port, listening);

function listening() {
    console.log(server);
    console.log(`running on localhost: ${port}`);
    console.log(GEONAMES_USERNAME);
    console.log(WEATHERBIT_API_KEY);
    console.log(PIXABAY_API_KEY);
}

// GET route
app.get('/return', getData);
//sending last saved trip data
function getData(request, response) {
    response.send(projectData);
}

// POST route
app.post('/add', postData);
//receving saved trip data
function postData(request, response) {
    projectData = request.body;
    response.send({ message: 'Post received' });
    console.log(projectData);
}
