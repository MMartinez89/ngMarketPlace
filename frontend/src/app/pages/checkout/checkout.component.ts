import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms'
import {Router} from '@angular/router';
import {UsersModel} from '../../models/users.model';
import {  UsersService} from '../../service/users.service';
import {SweetAlert} from '../../function';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  user:UsersModel;
  id:string = "";
  saveAddress: boolean = false;
  countries:any = null;
  dialCode:string = "";

  constructor( private router: Router, private usersService: UsersService) { 
   this.user= new UsersModel();
  }

  ngOnInit(): void {

    //Validar si existe el usuario logeado 
    this.usersService.authActivate().then((res:any)=>{
      if(res){
        this.usersService.getFilterData("idToken", localStorage.getItem("idToken")).subscribe((res:any)=>{
          this.id = Object.keys(res).toString();
          for(const i in res){
            this.user.displayName = res[i].displayName;
            this.user.username = res[i].username;
            this.user.email = res[i].email;
            this.user.country = res[i].country;
            this.user.city = res[i].city;
            this.user.phone = res[i].phone;
            this.user.address = res[i].adrress;

            //Listado de paises

            this.usersService.getCountries().subscribe((res:any)=>{
              this.countries = res;
            });
          }
        })
      }
    });


    if(localStorage.getItem("list")){
      let list = JSON.parse(localStorage.getItem("list")||"");
      if(list.length == 0){
        this.router.navigateByUrl("/shopping-cart");
        return;
      }
    }else{
      this.router.navigateByUrl("/shopping-cart");
      return;
    }

  }

  //Guardar datos de envio 
  saveAddressfnc(inputCountry:any, inputCity:any, inputPhone:any, inputAddress:any,inputSaveAddress:any){
    if(this.saveAddress){
      if(inputCountry.value != "" && inputCity.value !="" && inputPhone.value != "" && inputAddress.value != ""){

        let body ={
          country: this.user.country,
          city: this.user.city,
          phone: this.user.phone,
          address: this.user.address
        }
        this.usersService.patchData(this.id, body).subscribe((res:any)=>{
          SweetAlert.fnc("success", "Your data was updated", null);
        });
      }else{
        inputSaveAddress.checked = false;
        SweetAlert.fnc("error", "Please fill in the required fileds", null);
      }
    }
  }

  onSubmit(f:any){

  }

  //Agregamos codigo dial al input phone
  changeCountry(inputCountry:any){
    this.countries.forEach((country:any)=>{
      if(inputCountry.value == country.name){
        this.dialCode = country.dial_code;
        this.user.country_code = country.code;
      }
    })
  }

}
