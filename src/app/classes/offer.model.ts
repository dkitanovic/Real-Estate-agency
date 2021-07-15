export interface Offer{
  id: string;
  name: string;
  usernameBuyer: string;
  usernameOwner: string;
  price: number;
  buyerImage: string;
  accepted: boolean;
  confirmed: boolean;
}
