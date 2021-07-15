import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Chart } from "chart.js";
import { Archive } from "../classes/archive.model";
import { Offer } from "../classes/offer.model";
import { RealEstate } from "../classes/realestate.model";
import { User } from "../classes/user.model";
import { LoginService } from "../login.service";

@Component({
  selector: 'app-agent',
  templateUrl: 'agent.component.html',
  styleUrls: ['./agent.component.css'],
  providers: [DatePipe]
})
export class Agent{

  add_Real_Estate = false;
  add_User=false;
  delete_Users=false;
  requests_Users=false;
  requests_Real_Estate=false;
  all_Real_Estates=false;
  promoted_Real_Estates=false;
  show_charts=true;
  show_offers=false;
  show_accepted_offers=false;
  show_confirmed_offers=false;


  user: User;
  request_realEstates: Array<RealEstate> = new Array<RealEstate>();
  all_realEstates: Array<RealEstate> = new Array<RealEstate>();
  promoted_realEstates: Array<RealEstate> = new Array<RealEstate>();
  acceptedOffers : Array<Offer> = new Array<Offer>();
  confirmedOffers : Array<Offer> = new Array<Offer>();
  //Chart
  towns: Array<String> = new Array<String>();
  valueByTown: Array<number> = new Array<number>();
  myChart: Chart;
  myChart1: Chart;
  myChart2: Chart;
  myChart3: Chart;
  RentSell: Array<number> = new Array<number>();

  //Chat box
  myRealEstates: Array<RealEstate>;
  channelList: Array<{usernameFrom:string,messages:Array<{date:Date, name:string, text:string, usernameFrom:string, usernameTo:string, agent:string, read:boolean}>}> = new Array<{usernameFrom:string,messages:Array<{date:Date, name:string, text:string, usernameFrom:string, usernameTo:string,agent:string, read:boolean}>}>();
  index: number = -1;
  chat = false;
  myArchives: Array<{usernameTo:string, usernameFrom:string}> = new Array<{usernameTo:string, usernameFrom:string}>();
  myBlocks: Array<{usernameTo:string, usernameFrom:string}> = new Array<{usernameTo:string, usernameFrom:string}>();
  all_offers: Array<Offer> = new Array<Offer>();
  show_archive = false;
  newMessage;

  constructor(private router: Router, private service:LoginService, private http: HttpClient, private datePipe:DatePipe){
    this.user=this.service.getLUser();
    this.get_requested_estates();
    this.updateCharts();
    this.getMyRealEstates();
    this.getAllOffers();
  }

  add_real_estate(){
    this.add_Real_Estate=true;
    this.add_User=false;
    this.delete_Users=false;
    this.requests_Users=false;
    this.requests_Real_Estate=false;
    this.show_charts=false;
    this.show_offers=false;
    this.all_Real_Estates=false;
    this.promoted_Real_Estates=false;
    this.show_confirmed_offers=false;
  }

  show_real_estate_requests(){
    this.add_Real_Estate=false;
    this.add_User=false;
    this.delete_Users=false;
    this.requests_Users=false;
    this.requests_Real_Estate=true;
    this.show_charts=false;
    this.show_offers=false;
    this.all_Real_Estates=false;
    this.promoted_Real_Estates=false;
    this.show_accepted_offers = false;
    this.show_confirmed_offers=false;
  }

  statistic(){
    this.add_User = false;
    this.delete_Users = false;
    this.requests_Users=false;
    this.add_Real_Estate=false;
    this.requests_Real_Estate=false;
    this.show_charts=true;
    this.show_offers=false;
    this.all_Real_Estates=false;
    this.promoted_Real_Estates=false;
    this.show_accepted_offers = false;
    this.show_confirmed_offers=false;
    this.updateCharts();
  }

  accepted_offers(){
    this.add_Real_Estate=false;
    this.add_User=false;
    this.delete_Users=false;
    this.requests_Users=false;
    this.requests_Real_Estate=false;
    this.show_charts=false;
    this.show_offers=false;
    this.all_Real_Estates=false;
    this.promoted_Real_Estates=false;
    this.chat=false;
    this.show_accepted_offers = true;
    this.show_confirmed_offers=false;
    this.getAcceptedOffers();
  }

  confirmed_offers(){
    this.add_Real_Estate=false;
    this.add_User=false;
    this.delete_Users=false;
    this.requests_Users=false;
    this.requests_Real_Estate=false;
    this.show_charts=false;
    this.show_offers=false;
    this.all_Real_Estates=false;
    this.promoted_Real_Estates=false;
    this.chat=false;
    this.show_accepted_offers = false;
    this.show_confirmed_offers=true;
    this.getConfirmedOffers();
  }

///////////////////////////
  getAcceptedOffers(){
    this.http.post<Array<Offer>>('http://localhost:3000/getAllOffers',{}).subscribe((value) => {
      this.acceptedOffers = value;
    });
  }

  getConfirmedOffers(){
    this.http.post<Array<Offer>>('http://localhost:3000/getConfirmedOffers',{}).subscribe((value) => {
      this.confirmedOffers = value;
    });
  }

  get_requested_estates(){
    this.http.post<Array<RealEstate>>('http://localhost:3000/search',{
      priceFrom:0,
      priceTo: 100000000000,
      accepted: false
    }).subscribe((value) => {
      this.request_realEstates = value;
    });
  }

  acceptRealEstate(realEstate: RealEstate){
    realEstate.accepted = true;
    this.http.post<Array<RealEstate>>('http://localhost:3000/updateRealEstate',realEstate)
    .subscribe((value) => {
      this.get_requested_estates();
    });
  }

  promoteRealEstate(realEstate: RealEstate){
    realEstate.promoted = true;
    this.http.post<Array<RealEstate>>('http://localhost:3000/updateRealEstate',realEstate)
    .subscribe((value) => {
      this.findAllRealEstates();
    });
  }

  unpromoteRealEstate(realEstate: RealEstate){
    realEstate.promoted = false;
    this.http.post<Array<RealEstate>>('http://localhost:3000/updateRealEstate',realEstate)
    .subscribe((value) => {
      this.findPromotedRealEstates();
    });
  }

  show_real_estates(){
    this.add_User = false;
    this.delete_Users = false;
    this.requests_Users=false;
    this.add_Real_Estate=false;
    this.requests_Real_Estate=false;
    this.show_charts=false;
    this.show_offers=false;
    this.all_Real_Estates=true;
    this.promoted_Real_Estates=false;
    this.findAllRealEstates();
  }

  show_promoted_estates(){
    this.add_User = false;
    this.delete_Users = false;
    this.requests_Users=false;
    this.add_Real_Estate=false;
    this.requests_Real_Estate=false;
    this.show_charts=false;
    this.show_offers=false;
    this.all_Real_Estates=false;
    this.promoted_Real_Estates=true;
    this.findPromotedRealEstates();
  }

  findAllRealEstates(){
    this.http.post<Array<RealEstate>>('http://localhost:3000/search',{
        town: null,
        priceFrom: 0,
        priceTo: 9999999,
        accepted: true,
        promoted: false
      }
      )
      .subscribe((value) => {
        this.all_realEstates = value;
      });
  }

  findPromotedRealEstates(){
    this.http.post<Array<RealEstate>>('http://localhost:3000/search',{
      town: null,
      priceFrom: 0,
      priceTo: 9999999,
      accepted: true,
      promoted: true
    }
    )
    .subscribe((value) => {
      this.promoted_realEstates = value;
    });
  }

  updateCharts(){
    this.towns = new Array<String>();
    this.valueByTown = new Array<number>();
    this.RentSell = new Array<number>();

    this.http.post<string>('http://localhost:3000/getEstatesByTown',{})
    .subscribe((value) => {

      JSON.parse(value).forEach(element => {
        this.towns.push(element._id);
        this.valueByTown.push(element.count);
      });

      this.myChart = new Chart("myChart", {
        type: 'doughnut',
        data: {
          labels: this.towns,
          datasets: [{
            label: '# of Votes',
            data: this.valueByTown,
            backgroundColor: [
              'rgba(240, 52, 52, 1)',
              'rgba(25, 181, 254, 1)',
              'rgba(254, 241, 96, 1)',
              'rgba(38, 194, 129, 1)',
              'rgba(189, 195, 199, 1)'
            ],
            borderColor: [
              'rgba(240, 52, 52, 1)',
              'rgba(25, 181, 254, 1)',
              'rgba(254, 241, 96, 1)',
              'rgba(38, 194, 129, 1)',
              'rgba(189, 195, 199, 1)'
            ],
            borderWidth: 1
          }]
        }
      });
    });

    this.http.post<string>('http://localhost:3000/getEstatesByRentOrSell',{ type: "Apartment" })
    .subscribe((value) => {
      this.myChart1 = new Chart("myChart1", {
        type: 'doughnut',
        data: {
          labels: ['Rent apartment', 'Sell apartment'],
          datasets: [{
            label: '# of Votes',
            data: [JSON.parse(value).number1,JSON.parse(value).number2 ],
            backgroundColor: [
              'rgba(240, 52, 52, 1)',
              'rgba(25, 181, 254, 1)'
            ],
            borderColor: [
              'rgba(240, 52, 52, 1)',
              'rgba(25, 181, 254, 1)'
            ],
            borderWidth: 1
          }]
        }
      });
    });

    this.http.post<string>('http://localhost:3000/getEstatesByRentOrSell',{ type: "House" })
    .subscribe((value) => {
      this.myChart2 = new Chart("myChart2", {
        type: 'doughnut',
        data: {
          labels: ['Rent house', 'Sell house'],
          datasets: [{
            label: '# of Votes',
            data: [JSON.parse(value).number1,JSON.parse(value).number2 ],
            backgroundColor: [
              'rgba(240, 52, 52, 1)',
              'rgba(25, 181, 254, 1)'
            ],
            borderColor: [
              'rgba(240, 52, 52, 1)',
              'rgba(25, 181, 254, 1)'
            ],
            borderWidth: 1
          }]
        }
      });
    });

    this.http.post<string>('http://localhost:3000/getEstatesByPrice',{
      to1: 50000,
      to2: 100000,
      to3: 150000,
      to4: 200000
    })
    .subscribe((value) => {
      this.myChart3 = new Chart("myChart3", {
        type: 'doughnut',
        data: {
          labels: ['0-50k', '50-100k', '100-150k', '150-200k', '>200k'],
          datasets: [{
            label: '# of Votes',
            data: [JSON.parse(value).number1,JSON.parse(value).number2,JSON.parse(value).number3,JSON.parse(value).number4, JSON.parse(value).number5],
            backgroundColor: [
              'rgba(240, 52, 52, 1)',
              'rgba(25, 181, 254, 1)',
              'rgba(254, 241, 96, 1)',
              'rgba(38, 194, 129, 1)',
              'rgba(189, 195, 199, 1)'
            ],
            borderColor: [
              'rgba(240, 52, 52, 1)',
              'rgba(25, 181, 254, 1)',
              'rgba(254, 241, 96, 1)',
              'rgba(38, 194, 129, 1)',
              'rgba(189, 195, 199, 1)'
            ],
            borderWidth: 1
          }]
        }
      });
    });
  }

  logout(){
    this.router.navigate(['']);
  }


  //Chat box
  getMyRealEstates(){
    this.http.post<Array<RealEstate>>('http://localhost:3000/getMyRealEstates',{
        owner: "agency",
        accepted: true
      })
      .subscribe((value) => {
        this.myRealEstates = value;
      });
  }

  showConversation(index: number){
    this.index = index;

    if (this.channelList[index].messages[this.channelList[index].messages.length-1].usernameTo == "agency"){
      this.http.post<string>('http://localhost:3000/readMessage',{
        name: this.channelList[index].messages[this.channelList[index].messages.length-1].name,
        usernameFrom: this.channelList[index].usernameFrom,
        usernameTo: "agency"
      })
      .subscribe((value) => {
        this.channelList[index].messages[this.channelList[index].messages.length-1].read = true;
      });
    }
  }

  showChat(){
    this.chat=true;
    this.add_Real_Estate=false;
    this.add_User=false;
    this.delete_Users=false;
    this.requests_Users=false;
    this.requests_Real_Estate=false;
    this.show_charts=false;
    this.show_offers=false;
    this.all_Real_Estates=false;
    this.promoted_Real_Estates=false;
    this.findConversations();
    this.getMyArchives();
    this.getMyBlocks();

  }

  findConversations(){
    this.channelList=new Array<{usernameFrom:string,messages:Array<{date:Date, name:string, text:string, usernameFrom:string, usernameTo:string, agent:string, read:boolean}>}>();
    this.http.post<string>('http://localhost:3000/findChannels',{usernameTo: "agency"})
      .subscribe((value) => {
        console.log(value);
        JSON.parse(value).forEach(element => {
          this.channelList.push(element);
        });
      });
  }

  getMyArchives(){
    this.http.post<Array<Archive>>('http://localhost:3000/getMyArchives',{
      usernameFrom: 'agency'
    })
    .subscribe((value) => {
      this.myArchives = value;
    });
  }

  getMyBlocks(){
    this.http.post<string>('http://localhost:3000/getMyBlocks',{
      username: "agency"
    })
    .subscribe((value) => {
      this.myBlocks = JSON.parse(value);
    });
  }

  didIArchivedHim(username:string){
    return (this.myArchives.find(element => element.usernameFrom=='agency' && element.usernameTo==username) != undefined);
  }

  didIBlockedHim(username:string){
    return (this.myBlocks.find(element => element.usernameFrom=='agency' && element.usernameTo==username) != undefined);
  }

  didHeBlockedMe(username:string){
    return (this.myBlocks.find(element => element.usernameFrom==username && element.usernameTo=='agency') != undefined);
  }

  isMyRealEstate(name:string):boolean{
    return (this.myRealEstates.find(element => element.name==name) != undefined);
  }

  didHeOffered(name:string, username:string){
    return (this.all_offers.find(element => element.name==name && element.usernameBuyer==username && element.accepted==false) != undefined);
  }

  sendMessage(name: string, usernameTo: string){

    this.http.post<Message>('http://localhost:3000/sendMessage',{
      name: name,
      usernameFrom: 'agency',
      usernameTo: usernameTo,
      agent: this.user.username,
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

  archive(username:string){
    console.log("arhive");
    this.http.post<string>('http://localhost:3000/archive',{
      usernameFrom: 'agency',
      usernameTo: username
    })
    .subscribe((value) => {
      this.getMyArchives();
    });
  }

  showArhive(){
    this.chat=true;
    this.show_offers = false;
    this.show_archive=true;
    this.index = -1;
  }

  dearchive(username:string){
    this.http.post<string>('http://localhost:3000/dearchive',{
      usernameFrom: 'agency',
      usernameTo: username
    })
    .subscribe((value) => {
      this.getMyArchives();
    });
  }

  showConversations(){
    this.chat=true;
    this.show_offers = false;
    this.show_archive=false;
    this.index = -1;
  }

  Block(username:string){
    this.http.post<string>('http://localhost:3000/block',{
      usernameFrom: 'agency',
      usernameTo: username
    })
    .subscribe((value) => {
      this.getMyBlocks();
      this.getMyArchives();
    });
  }

  Unblock(username:string){
    this.http.post<string>('http://localhost:3000/unblock',{
      usernameFrom: 'agency',
      usernameTo: username
    })
    .subscribe((value) => {
      this.getMyBlocks();
      this.getMyArchives();
    });
  }

  confirmOffer(offer: Offer){
    this.http.post<string>('http://localhost:3000/confirmOffer',{
      name: offer.name,
      usernameBuyer: offer.usernameBuyer,
      usernameOwner: offer.usernameOwner,
      price: offer.price,
      buyerImage: offer.buyerImage,
      accepted: offer.accepted,
      confirmed: offer.confirmed
    })
    .subscribe((value) => {
      this.getAcceptedOffers();
    });
  }

  acceptOffer(name:string,usernameBuyer:string){
    console.log(this.all_offers);
    console.log(this.all_offers.find(element => element.name==name && usernameBuyer==usernameBuyer));
    const offer = this.all_offers.find(element => element.name==name && usernameBuyer==usernameBuyer);
    console.log(offer);
    this.confirmOffer(offer);
  }

  getAllOffers(){
    this.http.post<Array<Offer>>('http://localhost:3000/getAllOffersFalse',{})
    .subscribe((value) => {
      this.all_offers = value;
    });
  }
}
