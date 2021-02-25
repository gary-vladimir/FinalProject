var moment = require('moment');
//library for handling dates
const loader = document.getElementById('loader');
const loaderBack = document.getElementById('background_loading');
const weatherImg = document.getElementById('weather');
const weatherTemp = document.getElementById('temperature');
const weatherDes = document.getElementById('description');
const weatherTitle = document.getElementById('desTitle');
const image = document.getElementById('landscape');
const isIn = document.getElementById('isIn');
const minDate = document.getElementById('departure');

//adds min max attribute to departure input type date
setMinMaxAtt();

//cheking if the user saved a trip, if that is the case
//it will update the ui with the saved trip info
getServerData();
//-------------------------------------------------------------//
//start by getting the coordinates
function getcoordinates(event) {
    //preventing default
    event.preventDefault();
    //getting keys from server side
    fetch('http://localhost:8000/get_data')
        .then((res) => res.json())
        .then((keys) => {
            const GEONAMES_USERNAME = keys.GEONAMES_USERNAME;
            const PIXABAY_API_KEY = keys.PIXABAY_API_KEY;
            const WEATHERBIT_API_KEY = keys.WEATHERBIT_API_KEY;

            //getting user input
            const des = document.getElementById('destination').value;
            let dep = document.getElementById('departure').value;
            document.getElementById('departure').style.backgroundColor =
                'white';

            //checking if the form was empty
            if (des === '' || dep === '') {
                console.log('user enter no input');
                return 'empty';
            }

            //console logging for debug
            console.log(dep);
            console.log(des);

            //showing loading icon
            showLoading(true);
            //fetching lat and lng from geonames api
            fetch(
                `http://api.geonames.org/searchJSON?q=${des}&maxRows=1&username=${GEONAMES_USERNAME}`
            )
                //handeling response as json
                .then((response) => response.json())
                .then((data) => {
                    //reciving city country lat and lng
                    console.log(data);

                    const country = data.geonames[0].countryName;
                    const countryCode = data.geonames[0].countryCode;
                    const lat = data.geonames[0].lat;
                    const lng = data.geonames[0].lng;
                    console.log(country, lat, lng);

                    //calling the get image function
                    getImage(
                        country,
                        countryCode,
                        lat,
                        lng,
                        dep,
                        PIXABAY_API_KEY,
                        WEATHERBIT_API_KEY
                    );
                });
        });
}

//-------------------------------------------------------------//

//getting image from pixabay api
function getImage(
    country,
    countryCode,
    lat,
    lng,
    depDate,
    PIXABAY_API_KEY,
    WEATHERBIT_API_KEY
) {
    console.log('Fetching pixabay');

    //fetching pixabay image
    fetch(
        `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${country}&orientation=horizontal&category=buildings&per_page=3`
    )
        //handling response
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            const img = data.hits[0].webformatURL;
            console.log(img);

            //cheking if it's going to display current or predicted weather
            const dif = current(depDate);

            if (dif <= 7) {
                console.log('get current weather');
                fetchCurrentWeather(
                    lat,
                    lng,
                    country,
                    countryCode,
                    img,
                    dif,
                    WEATHERBIT_API_KEY
                );
            } else {
                console.log('get predicted weather');
                fetchFutureWeather(
                    lat,
                    lng,
                    country,
                    countryCode,
                    img,
                    dif,
                    WEATHERBIT_API_KEY
                );
            }
        });
}

//-------------------------------------------------------------//
//function that fetches the current weather from weatherbit
function fetchCurrentWeather(
    lat,
    lng,
    country,
    countryCode,
    img,
    dif,
    WEATHERBIT_API_KEY
) {
    console.log('fetching');
    //fetching weatherbit current weather
    fetch(
        `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${WEATHERBIT_API_KEY}`
    )
        //handling response
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            //getting temperature icon description and city
            let city = data.data[0].city_name;
            let temperature = data.data[0].temp;
            let icon = data.data[0].weather.icon;
            let description = data.data[0].weather.description;
            console.log(city, temperature, icon, description);

            //hide loading icon
            showLoading(false);

            const isInTime = dif + ' days';
            //updating ui
            updateUI(
                icon,
                description,
                temperature,
                city,
                country,
                countryCode,
                isInTime,
                img
            );
        });
}
//-------------------------------------------------------------//

//function that gets the future weather from weatherbit
function fetchFutureWeather(
    lat,
    lng,
    country,
    countryCode,
    img,
    dif,
    WEATHERBIT_API_KEY
) {
    console.log('fetching');

    //fetching weatherbit forecast
    fetch(
        `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${WEATHERBIT_API_KEY}`
    )
        //handling response
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            //getting temperature icon description and city
            //of the day of departure
            let city = data.city_name;
            let temperature = data.data[dif].temp;
            let icon = data.data[dif].weather.icon;
            let description = data.data[dif].weather.description;
            console.log(city, temperature, icon, description);

            //hide loading icon
            showLoading(false);

            const isInTime = dif + ' days';
            //updating ui
            updateUI(
                icon,
                description,
                temperature,
                city,
                country,
                countryCode,
                isInTime,
                img
            );
        });
}
//-------------------------------------------------------------//

//function that updates the UI with icon description temperature and location
function updateUI(
    icon,
    description,
    temperature,
    city,
    country,
    countryCode,
    isInTime,
    img
) {
    image.src = img;
    isIn.innerHTML = isInTime;
    weatherImg.src = `./src/client/styles/svg/${icon}.svg`;
    weatherDes.innerHTML = `${description}`;
    //rounding temperature for better presentation
    weatherTemp.innerHTML = `${Math.round(temperature)}°C`;
    //if the country + city are more than 18 charecters
    //it will show the country code
    if (country.length + city.length > 19) {
        weatherTitle.innerHTML = `${city} ${countryCode}`;
    } else {
        weatherTitle.innerHTML = `${city} ${country}`;
    }

    //if the user clicks save trip
    //it will send the data to the server
    let save = document.getElementById('saveTrip');
    save.addEventListener('click', function () {
        console.log('sending data to server');
        postData('/add', {
            icon,
            description,
            temperature,
            city,
            country,
            countryCode,
            isInTime,
            img,
        });
    });
}

//-------------------------------------------------------------//

//function that returns the departure date diference with the current date
function current(depDate) {
    var now = moment().format('YYYY-MM-DD');
    var departure = moment(depDate).format('YYYY-MM-DD');

    now = now.split('-');
    departure = departure.split('-');

    //month starts at 0 that's why we subtract 1
    var a = moment([Number(now[0]), Number(now[1]) - 1, Number(now[2])]);
    var b = moment([
        Number(departure[0]),
        Number(departure[1]) - 1,
        Number(departure[2]),
    ]);

    const dif = b.diff(a, 'days');
    console.log(dif);
    return dif;
}

//-------------------------------------------------------------//

//function that shows loading icon
function showLoading(userInput) {
    if (userInput) {
        loaderBack.style.display = 'block';
        loader.style.display = 'block';
    } else {
        loaderBack.style.display = 'none';
        loader.style.display = 'none';
    }
}

//-------------------------------------------------------------//

export {
    showLoading,
    current,
    updateUI,
    fetchCurrentWeather,
    fetchFutureWeather,
    getImage,
    getcoordinates,
};

//------------------------------------------------------------//
//function that adds min and max attributes to input date
function setMinMaxAtt() {
    let date = moment().format('YYYY-MM-DD');
    console.log(date);
    minDate.setAttribute('min', date);
    //

    let date2 = moment().add(15, 'days').format('YYYY-MM-DD');
    console.log(date2);
    minDate.setAttribute('max', date2);
}

// get project data and update the UI
async function getServerData() {
    const response = await fetch('/return');
    const latestEntry = await response.json();
    // checking if there is a icon attribute
    if (latestEntry && latestEntry.icon) {
        updateUI(
            latestEntry.icon,
            latestEntry.description,
            latestEntry.temperature,
            latestEntry.city,
            latestEntry.country,
            latestEntry.countryCode,
            latestEntry.isInTime,
            latestEntry.img
        );
    }
}

/* Function to POST data */
async function postData(url, data) {
    await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        // Body data type must match "Content-Type" header
        body: JSON.stringify(data),
    });
}
