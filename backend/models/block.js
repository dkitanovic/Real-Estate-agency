const mongoose = require('mongoose');

var connection = mongoose.createConnection("mongodb+srv://kitanovic:kitanovic@cluster0.txyqk.mongodb.net/block?retryWrites=true&w=majority");

const blockSchema = mongoose.Schema({
  usernameFrom: { type: String },
  usernameTo: { type: String }
});

var Block=connection.model('Block', blockSchema);

module.exports = Block;
