var mongoose = require('mongoose');
mongoose.Promise = global.Promise; // mongoose mpromise-warning, see http://mongoosejs.com/docs/promises.html
mongoose.connect('mongodb://localhost/typing', function () {
  console.log('mongodb connected');
});
module.exports = mongoose;