import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import {UsersService} from '../service/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService:UsersService, private router: Router ){}
  canActivate(): Promise<boolean> {
      return new Promise((resolve:any) =>{
          this.userService.authActivate().then(res =>{
            if(!res){
              this.router.navigateByUrl('/login');
              resolve(false);
            }else{
              resolve(true);
            }
          });
      });
  }
  
}
