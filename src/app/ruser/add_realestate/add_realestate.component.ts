import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { LoginService } from "src/app/login.service";

@Component({
  selector: 'app-ruser-add_realestate',
  templateUrl: 'add_realestate.component.html',
  styleUrls: ['./add_realestate.component.css']
})
export class AddRealEstate{
  type:String;
  images: FileList;
  text= "Ajde da te vidimo";

  constructor(private http: HttpClient, private service: LoginService){
  }

  submitRealEstate(form: NgForm){
    const data = new FormData();
    data.append("name", form.value.name);
    data.append("town", form.value.town);
    data.append("address", form.value.address);
    data.append("township", form.value.township);
    data.append("type", form.value.type);
    data.append("floor", form.value.floor);

    if (!form.value.maximumFloor){
      form.value.maximumFloor = form.value.floor;
    }

    data.append("maximumFloor", form.value.maximumFloor);
    data.append("area", form.value.area);
    data.append("rooms", form.value.rooms);
    data.append("furnished", form.value.furnished);

    if (form.value.owner == 'agency')
      data.append("owner", form.value.owner);
    else data.append("owner", this.service.getLUser().username);

    data.append("RentOrSell", form.value.RentOrSell);
    data.append("price",form.value.price);
    data.append("accepted", "false");
    data.append("sold", "false");
    data.append("promoted", "false");
    Array.from(this.images).forEach(image =>
      data.append('images', image)
    );

    this.http.post<string>('http://localhost:3000/submitRealEstate',
        data
      )
      .subscribe((value) => {
        this.text="Bravo majstore";
      });
  }

  isSelected(type:String){
    return type=='Apartment';
  }

  onImagesUploaded(event: Event){
    this.images = (event.target as HTMLInputElement).files;
  }


}
