import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../service/users.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {

     this.usersService.authActivate().then((res:any)=>{
       if(!res){
          window.open("login","_top")
       }
     });

  }

}
