import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Login } from './login/login.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Register } from './register/register.component';
import { Guest } from './guest/guest.component';
import { RUser } from './ruser/ruser.component';
import { UpdateInfo } from './ruser/updateinfo/updateinfo.component';
import { AddRealEstate } from './ruser/add_realestate/add_realestate.component';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule }  from 'ng-gallery/lightbox';
import { RealEstateComponent } from './realestate/realestate.component';
import { Add_User } from './admin/add_user/add_user.component';
import { Admin } from './admin/admin.component';
import { AdminAddRealEstate } from './admin/add_realestate/add_realestate.component';
import { EditRealEstate } from './ruser/editrealestate/editrealestate.component';
import { Agent } from './agent/agent.component';
;


@NgModule({
  declarations: [
    AppComponent,
    Login,
    Register,
    Guest,
    RUser,
    UpdateInfo,
    AddRealEstate,
    RealEstateComponent,
    Admin,
    Add_User,
    AdminAddRealEstate,
    EditRealEstate,
    Agent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatRadioModule,
    GalleryModule,
    LightboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
