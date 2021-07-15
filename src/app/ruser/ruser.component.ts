import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { Component, ComponentFactoryResolver } from "@angular/core";
import { Form, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Gallery, GalleryItem, ImageItem } from "ng-gallery";
import { Lightbox } from "ng-gallery/lightbox";
import { Archive } from "../classes/archive.model";
import { Offer } from "../classes/offer.model";
import { RealEstate } from "../classes/realestate.model";
import { User } from "../classes/user.model";
import { LoginService } from "../login.service";

@Component({
  selector: 'app-ruser',
  templateUrl: 'ruser.component.html',
  styleUrls: ['./ruser.component.css'],
  providers: [DatePipe]
})
export class RUser{

  user: User;
  updateInfo = false;
  add_realestate = false;
  my_realestates = false;
  editrealestate = false;
  show_offers = false;
  chat = false;
  show_archive = false;
  realEstates: Array<RealEstate>;
  myRealEstates: Array<RealEstate>;
  promotedEstates: Array<RealEstate>
  realEstateToEdit: RealEstate;
  offers: Array<Offer>;
  image: File;
  imagePath;
  items: GalleryItem[];


  //new
  channelList: Array<{usernameFrom:string,messages:Array<{date:Date, name:string, text:string, usernameFrom:string, usernameTo:string, agent:string, read:boolean}>}> = new Array<{usernameFrom:string,messages:Array<{date:Date, name:string, text:string, usernameFrom:string, usernameTo:string, agent:string, read:boolean}>}>();
  index: number = -1;
  messages;
  newMessage;
  usernameFrom: string;
  all_offers: Array<Offer> = new Array<Offer>();
  myBlocks: Array<{usernameTo:string, usernameFrom:string}> = new Array<{usernameTo:string, usernameFrom:string}>();
  myArchives: Array<Archive> = new Array<Archive>();

  constructor(private service: LoginService,private http: HttpClient, public gallery:Gallery, public lightbox: Lightbox, private router: Router, private datePipe: DatePipe){
    this.user = this.service.getLUser();
    this.http.post<Array<RealEstate>>('http://localhost:3000/findPromoted',{})
      .subscribe((value) => {
        this.promotedEstates = value;
        this.items = this.promotedEstates.map(item => new ImageItem({ src: item.images[0]}));
      });
    this.findConversations();
    this.getMyRealEstates();
    this.getMyBlocks();
    this.getAllOffers();
    this.service.setRUser(this);
  }


  update(user: User){

    this.service.update(user);
    this.user = this.service.getLUser();
  }

  add_RealEstate(){
    this.add_realestate = true;
    this.updateInfo = false;
    this.my_realestates = false;
    this.editrealestate = false;
    this.show_offers = false;
    this.chat=false;
  }

  changePersonalInfo(){
    this.updateInfo = true;
    this.add_realestate = false;
    this.my_realestates = false;
    this.editrealestate = false;
    this.show_offers = false;
    this.chat=false;
  }

  getUser(){
    return this.user;
  }

  setUpdateInfo(value: boolean){
    this.updateInfo = value;
  }

  search(form: NgForm){
    if (!form.value.town && !form.value.priceFrom && !form.value.priceTo){
      this.realEstates=null;
      return;
    }
    const data = new FormData();
    data.append("town", form.value.town);
    if (!form.value.priceFrom){
      form.value.priceFrom='0';
    }
    data.append("priceFrom", form.value.priceFrom);

    if (!form.value.priceTo){
      form.value.priceTo = '99999999';
    }
    data.append("priceTo", form.value.priceTo);

    this.http.post<Array<RealEstate>>('http://localhost:3000/search',{
        town: form.value.town,
        priceFrom: form.value.priceFrom,
        priceTo: form.value.priceTo,
        accepted: true
      }
      )
      .subscribe((value) => {
        this.add_realestate = false;
        this.updateInfo = false;
        this.my_realestates = false;
        this.show_offers = false;
        this.chat=false;
        this.realEstates = value;
      });
  }

  openRealEstate(realEstate: RealEstate){
    this.service.openRealEstate(realEstate);
  }

  logout(){
    this.router.navigate(['']);
  }

  onImageUploaded(event: Event){

    this.image = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePath = reader.result as string;
    };
    reader.readAsDataURL(this.image);

    const data = new FormData();
    data.append("username", this.user.username);
    data.append("image", this.image,this.user.username);
    this.http.post<User>('http://localhost:3000/updatePicture',
      data
    ).subscribe((value) => {
      this.user = value;

    });
  }

  getMyRealEstates(){
    this.http.post<Array<RealEstate>>('http://localhost:3000/getMyRealEstates',{
        owner: this.user.username,
        accepted: true
      })
      .subscribe((value) => {
        this.myRealEstates = value;

      });
  }

  show_my_realestates(){
    this.my_realestates=true;
    this.add_realestate = false;
    this.updateInfo = false;
    this.editrealestate = false;
    this.show_offers = false;
    this.chat=false;
    this.getMyRealEstates();
  }

  editRealEstate(re: RealEstate){
    this.editrealestate = true;
    this.my_realestates=false;
    this.add_realestate = false;
    this.updateInfo = false;
    this.show_offers = false;
    this.chat=false;
    this.realEstateToEdit = re;
  }

  updateRealEstate(re: RealEstate){
    this.http.post<Array<User>>('http://localhost:3000/updateRealEstate',re)
    .subscribe((value) => {
      this.show_my_realestates();
    });
  }

  showOffers(re: RealEstate){
    this.http.post<Array<Offer>>('http://localhost:3000/getOffers',{
      name: re.name
    })
    .subscribe((value) => {
      this.editrealestate = false;
      this.my_realestates=false;
      this.add_realestate = false;
      this.updateInfo = false;
      this.show_offers = true;
      this.chat=false;
      this.offers = value;
    });
  }

  showConversation(index: number){
    this.index = index;

    if (this.channelList[index].messages[this.channelList[index].messages.length-1].usernameTo == this.user.username){
      this.http.post<string>('http://localhost:3000/readMessage',{
        name: this.channelList[index].messages[this.channelList[index].messages.length-1].name,
        usernameFrom: this.channelList[index].usernameFrom,
        usernameTo: this.user.username
      })
      .subscribe((value) => {
        this.channelList[index].messages[this.channelList[index].messages.length-1].read = true;
      });
    }
  }

  findConversations(){
    this.channelList=new Array<{usernameFrom:string,messages:Array<{date:Date, name:string, text:string, usernameFrom:string, usernameTo:string, agent:string, read:boolean}>}>();
    this.http.post<string>('http://localhost:3000/findChannels',{usernameTo: this.user.username})
      .subscribe((value) => {
        JSON.parse(value).forEach(element => {
          this.channelList.push(element);
        });
      });
  }

  sendMessage(name: string, usernameTo: string){

    this.http.post<Message>('http://localhost:3000/sendMessage',{
      name: name,
      usernameFrom: this.service.getLUser().username,
      usernameTo: usernameTo,
      agent: "",
      text: this.newMessage,
      date: Date.now(),
      read: false
    })
    .subscribe((value) => {
      this.newMessage='';
      this.channelList=new Array<{usernameFrom:string,messages:Array<{date:Date, name:string, text:string, usernameFrom:string, usernameTo:string, agent:string, read:boolean}>}>();
      this.findConversations();
      this.getMyArchives();
      this.index=0;

    });

  }

  niceDate(date:Date):string{
    return this.datePipe.transform(date,'yyyy.MM.dd hh:mm');
  }

  isMyRealEstate(name:string):boolean{
    return (this.myRealEstates.find(element => element.name==name) != undefined);
  }

  getAllOffers(){
    this.http.post<Array<Offer>>('http://localhost:3000/getAllOffersFalse',{})
    .subscribe((value) => {
      this.all_offers = value;
      console.log("Offers");
      console.log(this.all_offers);
    });
  }

  didHeOffered(name:string, username:string){
    return (this.all_offers.find(element => element.name==name && element.usernameBuyer==username && element.accepted==false) != undefined);
  }

  giveOffer(name:string,usernameOwner:string){
    this.http.post<Offer>('http://localhost:3000/addOffer',{
      name: name,
      usernameOwner: usernameOwner,
      usernameBuyer: this.user.username,
      price: 0,
      buyerImage: this.user.imagePath,
      accepted: false,
      confirmed: false
    })
    .subscribe((value) => {
      this.getAllOffers();
    });
  }

  acceptOffer(name:string,usernameBuyer:string){
    this.http.post<Offer>('http://localhost:3000/acceptOffer',{
      name: name,
      usernameOwner: this.user.username,
      usernameBuyer: usernameBuyer
    })
    .subscribe((value) => {
      this.getAllOffers();
    });
  }

  rejectOffer(name:string,usernameBuyer:string){
    this.http.post<Offer>('http://localhost:3000/deleteOffer',{
      name: name,
      usernameOwner: this.user.username,
      usernameBuyer: usernameBuyer
    })
    .subscribe((value) => {
      this.getAllOffers();
    });
  }

  showChat(){
    this.chat=true;
    this.updateInfo = false;
    this.add_realestate = false;
    this.my_realestates = false;
    this.editrealestate = false;
    this.show_offers = false;
    this.findConversations();
    this.getAllOffers();
    this.getMyBlocks();
    this.getMyArchives();
  }

  getMyBlocks(){
    this.http.post<string>('http://localhost:3000/getMyBlocks',{
      username: this.user.username
    })
    .subscribe((value) => {
      this.myBlocks = JSON.parse(value);
      console.log(this.myBlocks);
    });
  }

  Block(username:string){
    this.http.post<string>('http://localhost:3000/block',{
      usernameFrom: this.user.username,
      usernameTo: username
    })
    .subscribe((value) => {
      this.getMyBlocks();
      this.getMyArchives();
    });
  }

  Unblock(username:string){
    this.http.post<string>('http://localhost:3000/unblock',{
      usernameFrom: this.user.username,
      usernameTo: username
    })
    .subscribe((value) => {
      this.getMyBlocks();
      this.getMyArchives();
    });
  }

  didIBlockedHim(username:string){
    return (this.myBlocks.find(element => element.usernameFrom==this.user.username && element.usernameTo==username) != undefined);
  }

  didHeBlockedMe(username:string){
    return (this.myBlocks.find(element => element.usernameFrom==username && element.usernameTo==this.user.username) != undefined);
  }

  getMyArchives(){
    this.http.post<Array<Archive>>('http://localhost:3000/getMyArchives',{
      usernameFrom: this.user.username
    })
    .subscribe((value) => {
      this.myArchives = value;
    });
  }

  archive(username:string){
    this.http.post<string>('http://localhost:3000/archive',{
      usernameFrom: this.user.username,
      usernameTo: username
    })
    .subscribe((value) => {
      this.getMyArchives();
    });
  }

  dearchive(username:string){
    console.log("dearhive");
    this.http.post<string>('http://localhost:3000/dearchive',{
      usernameFrom: this.user.username,
      usernameTo: username
    })
    .subscribe((value) => {
      this.getMyArchives();
    });
  }

  didIArchivedHim(username:string): boolean{
    return (this.myArchives.find(element => element.usernameFrom==this.user.username && element.usernameTo==username) != undefined);
  }

  showArhive(){
    this.chat=true;
    this.updateInfo = false;
    this.add_realestate = false;
    this.my_realestates = false;
    this.editrealestate = false;
    this.show_offers = false;
    this.show_archive=true;
    this.index = -1;
  }

  showConversations(){
    this.chat=true;
    this.updateInfo = false;
    this.add_realestate = false;
    this.my_realestates = false;
    this.editrealestate = false;
    this.show_offers = false;
    this.show_archive=false;
    this.index = -1;
  }
}
