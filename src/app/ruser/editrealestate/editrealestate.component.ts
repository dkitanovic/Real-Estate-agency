import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component } from "@angular/core";
import { RealEstate } from "src/app/classes/realestate.model";
import { User } from "src/app/classes/user.model";
import { RealEstateComponent } from "src/app/realestate/realestate.component";
import { RUser } from "../ruser.component";

@Component({
  selector: 'app-ruser-editrealestate',
  templateUrl: 'editrealestate.component.html',
  styleUrls: ['./editrealestate.component.css']
})
export class EditRealEstate{

  name: string;
  town: string;
  township: string;
  address: string;
  type: string;
  area: Number;
  floor: Number;
  floorMaximum: Number;
  rooms: Number;
  furnished: string;
  images: Array<string>;
  RentOrSell: string;
  price: Number;
  owner: string;
  accepted: boolean;
  realEstate: RealEstate;
  constructor(public Owner: RUser){
    this.realEstate = this.Owner.realEstateToEdit;
  }

  isSelected(type:String){
    return type=='Apartment';
  }

  editRealEstate(){
    this.Owner.updateRealEstate(this.realEstate);
  }
}
