import { HttpClient } from "@angular/common/http";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "../login.service";

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class Login{

  text = "";
  constructor(private http: HttpClient, private router: Router, private service: LoginService){

  }



  login(form: NgForm){
    if (form.invalid){
      this.text = "All fields are required";
      return;
    }
    this.service.find(form.value.username, form.value.password);
  }

  register(){
    this.router.navigate(["/register"]);
  }

  continue(){
    this.service.continue();
  }




}
