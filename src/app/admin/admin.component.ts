import { HttpClient } from "@angular/common/http";
import { Component, ComponentFactoryResolver, OnInit } from "@angular/core";
import { RealEstate } from "../classes/realestate.model";
import { User } from "../classes/user.model";
import { LoginService } from "../login.service";
import { Chart, registerables } from 'chart.js';
import { Offer } from "../classes/offer.model";
import { Router } from "@angular/router";
Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  templateUrl: 'admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class Admin{

  add_User=false;
  delete_Users=false;
  requests_Users=false;
  add_Real_Estate=false;
  requests_Real_Estate=false;
  show_charts=true;
  show_offers=false;

  user: User;
  usersAccepted: Array<User>;
  usersNotAccepted: Array<User>;
  realEstates: Array<RealEstate>;
  offers: Array<Offer>;
  percentage: number;
  //Chart
  towns: Array<String> = new Array<String>();
  valueByTown: Array<number> = new Array<number>();
  myChart: Chart;
  myChart1: Chart;
  myChart2: Chart;
  myChart3: Chart;
  RentSell: Array<number> = new Array<number>();
  //
  constructor(private service: LoginService, private http: HttpClient, private router:Router){
    this.user = this.service.getLUser();
    this.get_Accepted_Users();
    this.get_requests();
    this.get_requested_estates();
    this.get_offers();
    this.updateCharts();
  }

  add_user(){
    this.add_User = true;
    this.delete_Users = false;
    this.requests_Users=false;
    this.add_Real_Estate=false;
    this.requests_Real_Estate=false;
    this.show_charts=false;
    this.show_offers=false;
  }

  delete_users(){
    this.add_User = false;
    this.delete_Users = true;
    this.requests_Users=false;
    this.add_Real_Estate=false;
    this.requests_Real_Estate=false;
    this.show_charts=false;
    this.show_offers=false;
  }

  show_requests(){
    this.add_User = false;
    this.delete_Users = false;
    this.requests_Users=true;
    this.add_Real_Estate=false;
    this.requests_Real_Estate=false;
    this.show_charts=false;
  }

  show_sells(){
    this.add_Real_Estate=false;
    this.add_User=false;
    this.delete_Users=false;
    this.requests_Users=false;
    this.requests_Real_Estate=false;
    this.show_charts=false;
    this.show_offers=true;
  }

  add_real_estate(){
    this.add_Real_Estate=true;
    this.add_User=false;
    this.delete_Users=false;
    this.requests_Users=false;
    this.requests_Real_Estate=false;
    this.show_charts=false;
    this.show_offers=false;
  }

  show_real_estate_requests(){
    this.add_Real_Estate=false;
    this.add_User=false;
    this.delete_Users=false;
    this.requests_Users=false;
    this.requests_Real_Estate=true;
    this.show_charts=false;
    this.show_offers=false;
  }

  statistic(){
    this.add_User = false;
    this.delete_Users = false;
    this.requests_Users=false;
    this.add_Real_Estate=false;
    this.requests_Real_Estate=false;
    this.show_charts=true;
    this.show_offers=false;
    this.updateCharts();
  }

  set_add_User(value:boolean){
    this.add_User = value;
  }
//////////
  get_Accepted_Users(){
    this.http.post<Array<User>>('http://localhost:3000/getUsers',{accepted: true})
    .subscribe((value) => {
      this.usersAccepted = value;
    });
  }

  get_requested_estates(){
    this.http.post<Array<RealEstate>>('http://localhost:3000/search',{
      priceFrom:0,
      priceTo: 100000000000,
      accepted: false
    }).subscribe((value) => {
      this.realEstates = value;
    });
  }

  deleteUser(user: User){
    this.http.post<String>('http://localhost:3000/deleteUser',{username: user.username})
    .subscribe((value) => {
      this.get_Accepted_Users();
      this.get_requests();
    });
  }

  get_requests(){
    this.http.post<Array<User>>('http://localhost:3000/getUsers',{accepted: false})
    .subscribe((value) => {
      this.usersNotAccepted = value;
    });
  }

  acceptUser(user: User){
    user.accepted=true;
    this.http.post<Array<User>>('http://localhost:3000/update',user)
    .subscribe((value) => {
      this.get_requests();
      this.get_Accepted_Users();
    });
  }

  acceptRealEstate(realEstate: RealEstate){
    realEstate.accepted = true;
    this.http.post<Array<RealEstate>>('http://localhost:3000/updateRealEstate',realEstate)
    .subscribe((value) => {
      this.get_requested_estates();

    });
  }

  get_offers(){
    this.http.post<Array<Offer>>('http://localhost:3000/getConfirmedOffers',{}
    ).subscribe((value) => {
      this.offers = value;
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

  setPercentage(){
    console.log(this.percentage);
    localStorage.setItem("percentage",JSON.stringify(this.percentage));
    console.log("setPercentage");
  }

  calculateMoney(){
    return this.offers.reduce((acc, cur) => acc + cur.price, 0) * JSON.parse(localStorage.getItem("percentage"))/100;
  }
}
