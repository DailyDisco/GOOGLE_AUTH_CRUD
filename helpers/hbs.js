const moment = require('moment');

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format);
    }
}

// this is for the date to be formatted in a certain way