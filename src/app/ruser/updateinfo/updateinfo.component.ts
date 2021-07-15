import { Component } from "@angular/core";
import { User } from "src/app/classes/user.model";
import { RUser } from "../ruser.component";

@Component({
  selector: 'app-ruser-updateinfo',
  templateUrl: 'updateinfo.component.html',
  styleUrls: ['./updateinfo.component.css']
})
export class UpdateInfo{

    user: User;
    name;
    surname;
    username;
    password;
    email;
    state;
    town;
    type;

    constructor(private ruser: RUser){
      this.user = this.ruser.getUser();
      this.field();
    }

    field(){
      this.name = this.user.name;
      this.surname = this.user.surname;
      this.username = this.user.username;
      this.password = this.user.password;
      this.email = this.user.email;
      this.state = this.user.state;
      this.town = this.user.town;
      this.type = this.user.type;
    }

    field_oposite(){
      this.user.name = this.name;
      this.user.surname = this.surname;
      this.user.username = this.username;
      this.user.password = this.password;
      this.user.email = this.email;
      this.user.state = this.state;
      this.user.town = this.town;
      this.user.type = this.type;
    }

    back(){
      this.ruser.setUpdateInfo(false);
      this.field();
    }

    save(){
      this.field_oposite();
      this.ruser.update(this.user);
      this.user = this.ruser.getUser();
      this.field();
    }




}
