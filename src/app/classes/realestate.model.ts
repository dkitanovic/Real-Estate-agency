export interface RealEstate{
  name: string;
  town: string;
  township: string;
  address: string;
  type: string;
  area: Number;
  floor: Number;
  maximumFloor: Number;
  rooms: Number;
  furnished: string;
  images: Array<string>;
  RentOrSell: string;
  price: Number;
  owner: string;
  accepted: boolean;
  sold: boolean;
  promoted: boolean;
}
