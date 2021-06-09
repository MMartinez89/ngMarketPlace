import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../../service/users.service';
@Component({
  selector: 'app-account-breadcrumb',
  templateUrl: './account-breadcrumb.component.html',
  styleUrls: ['./account-breadcrumb.component.css']
})
export class AccountBreadcrumbComponent implements OnInit {

  displayName: string = "";

  constructor(private usersService: UsersService) { }
 
  ngOnInit(): void {
    this.usersService.authActivate().then(res=>{
      if(res){
        this.usersService.getFilterData("idToken", localStorage.getItem("idToken")).subscribe((res:any)=>{
          
          for(const i in res){
            this.displayName = res[i].displayName;  
          }
        });
      }
    });
  }

  logOut(){
   localStorage.removeItem("idToken");
   localStorage.removeItem("expiresIn");
   window.open("login","_top")
  }

}
