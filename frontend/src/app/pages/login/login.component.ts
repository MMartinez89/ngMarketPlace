import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms'
import{SweetAlert}from '../../function';
import {UsersService} from '../../service/users.service';
import {UsersModel} from '../../models/users.model';
import {ActivatedRoute} from '@angular/router';

declare var JQuery:any;
declare var $:any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user:any;
  rememberMe:boolean = false;

  constructor(private userService: UsersService, private activatesRoute: ActivatedRoute) { 
    this.user = new UsersModel();
  }

  ngOnInit(): void {
    //*******ACTION DE RECORDAR CREDENCIAL DE CORREO */

    if(localStorage.getItem("rememberMe") && localStorage.getItem("rememberMe") == "yes"){
      this.user.email = localStorage.getItem("email");
      this.rememberMe = true;

    }

     //VALIDACION DEL FORMULARIO DE BOOTSTRAP 4
     (function() {
      'use strict';
      window.addEventListener('load', function() {
        // Get the forms we want to add validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener('submit', function(event:any) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
    })();
    //VERIFICAR CUENTA DE CORREO ELECTRONICO
    if(this.activatesRoute.snapshot.queryParams["oobCode"] != undefined &&
       this.activatesRoute.snapshot.queryParams["mode"] == "verifyEmail" ){
        let body = {
          oobCode: this.activatesRoute.snapshot.queryParams["oobCode"]
        }
        this.userService.confirmEmailVerificationFnc(body).subscribe((res:any)=>{
          console.log("res",res)
          if(res["emailVerified"]){
            //ACTUALIAZAR LA CONFIRMACION DEL CORREO EN EL DATA BASE 
            this.userService.getFilterData("email", res["email"]).subscribe((res:any)=>{
              for(let i in res){
                let id = Object.keys(res).toString();
                let value = {
                  needConfirm:true
                }
                this.userService.patchData(id,value).subscribe((res:any)=>{
                  if(res["needConfirm"]){
                    SweetAlert.fnc("success","!Email confirm. Login now!", "login");
                  }
                })
              }
            })
          }
        }, err =>{
          if(err.error.error.message == "INVALID_OOB_CODE"){
            SweetAlert.fnc("error", "The email has alredy been confirm", "login");
          }
        });
    }

    //CONFIRMAR CAMBIO DE CONTRASENA
    if(this.activatesRoute.snapshot.queryParams["oobCode"] != undefined &&  this.activatesRoute.snapshot.queryParams["mode"] == "resetPassword"){
      let body ={
        oobCode: this.activatesRoute.snapshot.queryParams["oobCode"]
      }
      this.userService.verifyPasswordResetCodeFnc(body).subscribe((res:any)=>{
        if(res["requestType"] ==  "PASSWORD_RESET"){
          $("#newPassword").modal()
        }
      });
    }
  }

  validate(input:any){
    
    let pattern:any;
  
    if($(input).attr("name") == "password"){
      pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/
    }
    if(!pattern.test(input.value)){
      $(input).parent().addClass("was-validated"); //parent() =  se situa en el elemento padre
      input.value = "";
    }
  }

  onSubmit(f:NgForm){
    console.log("respuesta",f);
    if(f.invalid){
      return
    }
    SweetAlert.fnc("loading", "Loading ...", null);
    //VALIDAR QUE EL CORREO ESTE VERIFICADO
    this.userService.getFilterData("email", this.user.email).subscribe((res1:any)=>{
      for(const i in res1){
        if(res1[i].needConfirm){
          //LOGIN EN FIREBASE AUTHENTICATION
          this.user.returnSecureToken = true;
          delete this.user.idToken
          this.userService.loginAuth(this.user).subscribe((res2:any)=>{
            //ALMACENAR EL ID_TOKEN
            let id = Object.keys(res1).toString();
            let value = {
            idToken: res2["idToken"]
            }
            this.userService.patchData(id,value).subscribe((res3:any)=>{
              if(res3["idToken"] != ""){
              
              SweetAlert.fnc("close", null, null);
              
              //ALMACENAMOS EL TOKEN DE SEGURODAD EN EL LOCAL STORAGE
              localStorage.setItem("idToken", res3["idToken"]); //setItem("item", valor a guardar) es par generar un nuevo Item
              //ALMACENAMOS EL EMAIL EN EL LOCAL STORAGE
              localStorage.setItem("email", res2["email"]);
              //ALMACENAMOS LA FECHA DE EXPIRACION DEL LOCAL STORAGE
              let today =  new Date();
              today.setSeconds(res2["expiresIn"]);
              //today.setSeconds(30);
              localStorage.setItem("expiresIn", today.getTime().toString());
              //*****ALMACENAMOS RECORDAR EMAIL EN EL LOCALSTORAGE */
              if(this.rememberMe){

                localStorage.setItem("rememberMe", "yes");

              }else{

                localStorage.setItem("rememberMe", "no")

              }
              //REDIRECIONAMOS AL USUARIO A LA PAGINA DE SU CUENTA 
              window.open("account", "_top");
              }
            });
          },err=>{
            SweetAlert.fnc("error", err.error.error.message,null);
          });
        }else{
          SweetAlert.fnc("error","Need confirm your email",null)
        }
      }
    });
    
  }
  //****ENVIAR SOLICITUD PARA RECUPERAR CONTRASENA */
  resetPassword(value:any){

    SweetAlert.fnc("loading","Loading...", null);
    let body = {
      requestType: "PASSWORD_RESET",
      email: value
    }

    this.userService.sendPasswordResetEmailFnc(body).subscribe((res:any)=>{
      if(res["email"] == value){
        SweetAlert.fnc("success","Check your email to change password", "login");
        console.log(res)
      }

    });

  }
   //****ENVIAR NUEVA CONTRASENA */
   newPassword(value:any){
    if(value !=""){
      SweetAlert.fnc("loading","Loading...", null);
      let body = {
        oobCode: this.activatesRoute.snapshot.queryParams["oobCode"],
        newPassword: value
      }

      this.userService.confirmPasswordResetFnc(body).subscribe((res:any)=>{
        if(res["requestType"] == "PASSWORD_RESET"){
          SweetAlert.fnc("success","Password change successful, Login now", "login");
          console.log(res)
        }

      });
    }
  }
}
