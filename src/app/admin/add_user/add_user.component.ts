import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Admin } from "../admin.component";

@Component({
  selector: 'app-admin-add_user',
  templateUrl: 'add_user.component.html',
  styleUrls: ['./add_user.component.css']
})
export class Add_User{

  text: string;
  image : File;
  imagePath: string = "";


  constructor(private http:HttpClient, private admin:Admin){

  }

  add(form: NgForm){
    if(form.invalid){
      this.text = "All field are required";
      return;
    }
    if (form.value.password != form.value.confirmPassword){
      this.text="Passwords are not the same";
      return;
    }
    const data = new FormData();
    data.append("name", form.value.name);
    data.append("surname", form.value.surname);
    data.append("username", form.value.username);
    data.append("password", form.value.password);
    data.append("email", form.value.email);
    data.append("state", form.value.state);
    data.append("town", form.value.town);
    data.append("image", this.image, form.value.username);
    data.append("type",form.value.type);
    this.http.post<string>('http://localhost:3000/add',
        data
      )
      .subscribe((value) => {
        this.text= value;
        this.admin.set_add_User(false);
        this.admin.get_requests();
        this.admin.get_Accepted_Users();
      });
  }

  onImageUploaded(event: Event){
    this.image = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePath = reader.result as string;
    };
    reader.readAsDataURL(this.image);
  }
}
