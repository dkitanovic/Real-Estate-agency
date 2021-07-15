const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
var connection = mongoose.createConnection("mongodb+srv://kitanovic:kitanovic@cluster0.txyqk.mongodb.net/users?retryWrites=true&w=majority");

const registerSchema = mongoose.Schema({
  name: { type: String },
  surname: { type: String },
  username: { type: String },
  password: { type: String },
  imagePath: { type: String },
  email: { type: String },
  state: { type: String },
  town: { type: String },
  type: { type: String},
  accepted: {type: Boolean}
});

var User=connection.model('User',registerSchema);

module.exports = User;
