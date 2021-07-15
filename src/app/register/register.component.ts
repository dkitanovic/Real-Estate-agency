import { Component } from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { LoginService } from "../login.service";


@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.css']
})
export class Register{

  text = "";
  image : File;
  imagePath: string = "";

  constructor(private http: HttpClient, private service: LoginService){

  }

  register(form: NgForm){
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
   // data.append("imagePath", this.imagePath);
    data.append("email", form.value.email);
    data.append("state", form.value.state);
    data.append("town", form.value.town);
    data.append("image", this.image, form.value.username);
    data.append("accepted", "no");

    this.http.post<string>('http://localhost:3000/register',
        data
      )
      .subscribe((value) => {
        this.text= value;
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
