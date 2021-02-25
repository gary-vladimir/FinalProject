const dotenv = require('dotenv');

dotenv.config();

function keys(varname) {
    const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME;
    const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;
    const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
    return varname;
}

export { keys };
