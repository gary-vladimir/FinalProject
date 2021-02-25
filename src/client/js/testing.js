var moment = require('moment');
//function that returns the departure date diference with the current date
function current(depDate, date) {
    var now = moment(date).format('YYYY-MM-DD');
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

export { current };
