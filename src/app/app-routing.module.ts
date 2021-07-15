import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Guest } from './guest/guest.component';
import { Login } from './login/login.component';
import { Register } from './register/register.component';
import { Admin } from './admin/admin.component';
import { RUser } from './ruser/ruser.component';
import { RealEstateComponent } from './realestate/realestate.component';
import { Agent } from './agent/agent.component';


const routes: Routes = [
  {path: "", component: Login},
  {path: "register", component: Register},
  {path: "guest", component: Guest},
  {path: "admin", component: Admin},
  {path: "user", component: RUser},
  {path: "realestate", component: RealEstateComponent},
  {path: "agent", component: Agent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
