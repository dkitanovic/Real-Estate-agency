import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoginService } from "../login.service";
import { RealEstate } from "../classes/realestate.model";
import { GalleryItem, ImageItem } from "ng-gallery";
import { Offer } from "../classes/offer.model";
import { DatePipe } from "@angular/common";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { RUser } from "../ruser/ruser.component";

@Component({
  selector: 'app-realestate',
  templateUrl: 'realestate.component.html',
  styleUrls: ['./realestate.component.css'],
  providers: [DatePipe]
})
export class RealEstateComponent{

  public realEstate: RealEstate;
  items: GalleryItem[];
  paymentMethod: string;
  message;

  constructor(private http: HttpClient, public service: LoginService,private datePipe: DatePipe){
    this.realEstate = service.getRealEstate();
    this.items = this.realEstate.images.map(item => new ImageItem({ src: item}));
    console.log(this.service.getRUser());
  }

  buyRealEstate(realEstate: RealEstate){
    this.http.post<Offer>('http://localhost:3000/addOffer',{
      name: this.realEstate.name,
      usernameOwner: this.realEstate.owner,
      usernameBuyer: this.service.getLUser().username,
      price: this.realEstate.price,
      buyerImage: this.service.getLUser().imagePath,
      accepted: false
    })
    .subscribe((value) => {
    });
  }

  openForm() {
    document.getElementById("myForm").style.display = "block";
  }

  sendMessage(){
    console.log(this.datePipe.transform(Date.now(), 'yyyy-MM-dd hh:mm:ss'));
    this.http.post<Message>('http://localhost:3000/sendMessage',{
      name: this.realEstate.name,
      usernameFrom: this.service.getLUser().username,
      usernameTo: this.realEstate.owner,
      agent: "",
      text: this.message,
      date: Date.now(),
      read: false
    })
    .subscribe((value) => {
    });
    this.message='';
  }

  closeForm() {
    document.getElementById("myForm").style.display = "none";
  }
}
