const mongoose = require('mongoose');

var connection = mongoose.createConnection("mongodb+srv://kitanovic:kitanovic@cluster0.txyqk.mongodb.net/offers?retryWrites=true&w=majority");

const offerSchema = mongoose.Schema({
  name: { type: String },
  usernameBuyer: { type: String },
  usernameOwner: { type: String },
  price: { type: Number },
  buyerImage: { type: String },
  accepted: { type: Boolean },
  confirmed: { type: Boolean }
});

var Offer=connection.model('Offer',offerSchema);

module.exports = Offer;
