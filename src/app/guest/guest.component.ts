import { formatNumber } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Gallery, GalleryItem, ImageItem,ImageSize,ThumbnailsPosition } from "ng-gallery";
import { Lightbox } from "ng-gallery/lightbox";
import { RealEstate } from "../classes/realestate.model";

@Component({
    selector: 'app-guest',
    templateUrl: 'guest.component.html',
    styleUrls: ['./guest.component.css']
})
export class Guest implements OnInit{

  realEstates: Array<RealEstate>;
  promotedEstates: Array<RealEstate>;
  items: GalleryItem[];

  constructor(private http: HttpClient, public gallery:Gallery, public lightbox: Lightbox, public router:Router){
  }

  ngOnInit(){
    this.http.post<Array<RealEstate>>('http://localhost:3000/findPromoted',{})
      .subscribe((value) => {
        this.promotedEstates = value;
        this.items = this.promotedEstates.map(item => new ImageItem({ src: item.images[0]}));
      });
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
        this.realEstates = value;
      });
  }


  login(){
    this.router.navigate(['']);
  }

  register(){
    this.router.navigate(['register']);
  }
}
