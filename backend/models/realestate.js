const { ArrayType } = require('@angular/compiler');
const mongoose = require('mongoose');

var connection = mongoose.createConnection("mongodb+srv://kitanovic:kitanovic@cluster0.txyqk.mongodb.net/realEstates?retryWrites=true&w=majority");

const realEstateSchema = mongoose.Schema({
  name: { type: String },
  town: { type: String },
  address: { type: String },
  township: { type: String },
  type: { type: String },
  floor: { type: Number },
  maximumFloor: { type: Number },
  area: { type: Number },
  rooms: { type: Number },
  furnished: { type: String },
  owner: { type: String },
  RentOrSell: { type: String },
  price: { type: Number },
  images: { type: Array },
  accepted: { type: Boolean },
  sold: { type: Boolean },
  promoted: {type: Boolean}
});

var RealEstate=connection.model('RealEstate',realEstateSchema);

module.exports = RealEstate;
