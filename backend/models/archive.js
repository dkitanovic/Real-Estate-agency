const mongoose = require('mongoose');

var connection = mongoose.createConnection("mongodb+srv://kitanovic:kitanovic@cluster0.txyqk.mongodb.net/archive?retryWrites=true&w=majority");

const archiveSchema = mongoose.Schema({
  usernameFrom: { type: String },
  usernameTo: { type: String }
});

var Archive=connection.model('Archive', archiveSchema);

module.exports = Archive;
