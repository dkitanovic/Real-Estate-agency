const mongoose = require('mongoose');

var connection = mongoose.createConnection("mongodb+srv://kitanovic:kitanovic@cluster0.txyqk.mongodb.net/messages?retryWrites=true&w=majority");

const messageSchema = mongoose.Schema({
  name: { type: String },
  usernameFrom: { type: String },
  usernameTo: { type: String },
  agent: { type: String },
  text: { type: String },
  date: { type: Date },
  read: { type: Boolean}
});

var Message=connection.model('Message',messageSchema);

module.exports = Message;
