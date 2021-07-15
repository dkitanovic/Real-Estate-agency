import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Form } from "@angular/forms";
import { Router } from "@angular/router";
import { RealEstate } from "./classes/realestate.model";
import { User } from "./classes/user.model";
import { RUser } from "./ruser/ruser.component";

@Injectable({
  providedIn : 'root'
})
export class LoginService{
  message= "ttt";
  luser: User;
  realEstate : RealEstate;
  ruser: RUser;
  percentage: number;

  constructor(private http: HttpClient, private router: Router){

  }

  find(username: string, password: string){
    this.http.post<User>('http://localhost:3000/login',{
        username : username,
        password : password
      })
      .subscribe((value) => {
        this.luser = value;
        this.router.navigate(["/" + value.type]);
      });
  }

  update(user:User){
    console.log("sevice.update()");
    this.http.post<User>('http://localhost:3000/update',
      user
    ).subscribe((value) => {
        this.luser = value;
      });
  }

  continue(){
    this.router.navigate(["/guest"]);
  }

  getLUser(){
    console.log(this.luser);
    return this.luser;
  }

  openRealEstate(realEstate: RealEstate){
    this.realEstate = realEstate;
    this.router.navigate(['/realestate']);
  }

  getRealEstate(){
    return this.realEstate;
  }

  setRUser(ruser: RUser){
    this.ruser = ruser;
  }

  getRUser(){
    return this.ruser;
  }

  getPercentage(){
    return this.percentage;
  }

  setPercentage(value: number){
    this.percentage=value;
  }
}
