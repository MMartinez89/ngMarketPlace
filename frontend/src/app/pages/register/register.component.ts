import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import firebase from "firebase/app";
import "firebase/auth";

import {UsersModel} from '../../models/users.model';
import {UsersService} from '../../service/users.service';
import {Capitalize, SweetAlert} from '../../function';


declare var JQuery:any;
declare var $:any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user:UsersModel;
  constructor(private usersService: UsersService) { 
    this.user = new UsersModel();
  }
  
  ngOnInit(): void {
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
  }

  //VALIDACION DE LA EXPRECION REGULAR DEL FORMULARIO
  validate(input:any){
    
    let pattern:any;
    if($(input).attr("name") == "userName"){
      pattern = /^[A-Za-z]{2,12}$/;
      input.value = input.value.toLowerCase();
      this.usersService.getFilterData("username",input.value).subscribe((res:any)=>{
       if(Object.keys(res).length > 0){
          $(input).parent().addClass("was-validated");
          input.value = "";
          SweetAlert.fnc("error", "Username alredy exists", null);
          return;
        }
      })
    }
    if($(input).attr("name") == "password"){
      pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/
    }
    if(!pattern.test(input.value)){
      $(input).parent().addClass("was-validated"); //parent() =  se situa en el elemento padre
      input.value = "";
    }
  }
  // CAPITALIZAR LA PRIMERA LETRA DE NOMBRE Y APELLIDO
  capitalize(input:any){
    input.value = Capitalize.fnc(input.value);
  }

  onSubmit(f:NgForm){
  //ENVIO DEL FORMULARIO
    
    if(f.invalid){
      return 
    }
    SweetAlert.fnc("loading", "Loading ...", null)
    this.user.returnSecureToken = true;
    delete this.user.idToken;
    this.usersService.registerAut(this.user).subscribe((res:any)=>{
      //console.log(res);
      if(res["email"] == this.user.email){

        let body ={
          requestType: 'VERIFY_EMAIL',
          idToken: res["idToken"]
        };

        this.usersService.senEmailVerificationFnc(body).subscribe((res:any)=>{
         
          if(res["email"] == this.user.email){
            this.user.displayName = `${this.user.first_name} ${this.user.last_name}`
            this.user.method = 'direct';
            this.user.needConfrim = false;
            this.user.username = this.user.username.toLowerCase();
            //REGISTRO EN LA BASE DE DATOS DE FIREBASE
            this.usersService.registerDataBase(this.user).subscribe((res1:any)=>{ 
              SweetAlert.fnc("success", "Confirm your account in your email (check spam)", "login");
            });
          }

        });
      }
    }, (err)=>{
      SweetAlert.fnc("error", err.error.error.message, null);
    });
  }

  facebookRegister(){
    let localUserService = this.usersService;
    let localUser = this.user;
    //PASOS https://firebase.google.com/docs/web/setup
    //1. CREAR UNA NUEVA APLICACION EN SETTING DE FIREBASE
    //2.npm install --save firebase
    //3. AGREGAR import firebase from "firebase/app" ;
    //4. AGREGAR import "firebase/auth";

    //INICIALIZAR FIREBASE EN TU PROYECTO

    const firebaseConfig = {
      apiKey: "AIzaSyAwIu-uWRLt1gL_q1ajsSjoRPxQ0ck3RFw",
      authDomain: "marketplace-5acdd.firebaseapp.com",
      databaseURL: "https://marketplace-5acdd-default-rtdb.firebaseio.com",
      projectId: "marketplace-5acdd",
      storageBucket: "marketplace-5acdd.appspot.com",
      messagingSenderId: "307422671043",
      appId: "1:307422671043:web:882d9e1a9290178da43276"
    }
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log(firebase);
     //https://firebase.google.com/docs/auth/web/facebook-login
    //****CREAR UNA INSTANCIA DEL OBJECTO PROOVEDOR DE FACEBOOK */
    var provider = new firebase.auth.FacebookAuthProvider();

    //**ACCEDER A UNA VENTANA EMERGENTE  Y CON CERTIFICADO SSL (https) */
    // ng serve --ssl true --ssl-cert "/path/to/file.crt" --ssl-key "/path/to/file.key"
    firebase.auth().signInWithPopup(provider).then((result:any) => {
      // The signed-in user info.
      var user = result.user;

      if(user.J){
        let userModel: UsersModel = {
          displayName: user.displayName,
          email: user.email,
          idToken: user.b.b.h,
          method: "Facebook",
          //needConfrim: true,
          username: user.email.split('@')[0],
          picture: user.photoURL
        }

        //*********** EVITAR QUE SE DUPLIQUEN LOS REGISTRO EN FIREBASE DATABASE */

        localUserService.getFilterData("email",user.email).subscribe((res:any)=>{
          if(Object.keys(res).length > 0){
            SweetAlert.fnc("error",`You are already sing, please Loading with, ${res[Object.keys(res)[0]].method} method`, "login");
          }else{
            localUserService.registerDataBase(userModel).subscribe((res:any)=>{
              if(res["name"] !=""){
                SweetAlert.fnc("success", "Place Login with Facebook", "login")
              }
            });
          }
        })   
      }  
  })
  .catch((error) => {
    
    var errorMessage = error.message;
    SweetAlert.fnc("error", errorMessage, "register" );
  });
  }
  googleRegister(){
    let localUserService = this.usersService;
    let localUser = this.user;
    //PASOS https://firebase.google.com/docs/web/setup
    //1. CREAR UNA NUEVA APLICACION EN SETTING DE FIREBASE
    //2.npm install --save firebase
    //3. AGREGAR import firebase from "firebase/app" ;
    //4. AGREGAR import "firebase/auth";

    //INICIALIZAR FIREBASE EN TU PROYECTO

    const firebaseConfig = {
      apiKey: "AIzaSyAwIu-uWRLt1gL_q1ajsSjoRPxQ0ck3RFw",
      authDomain: "marketplace-5acdd.firebaseapp.com",
      databaseURL: "https://marketplace-5acdd-default-rtdb.firebaseio.com",
      projectId: "marketplace-5acdd",
      storageBucket: "marketplace-5acdd.appspot.com",
      messagingSenderId: "307422671043",
      appId: "1:307422671043:web:882d9e1a9290178da43276"
    }
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log(firebase);
     
    //****CREAR UNA INSTANCIA DEL OBJECTO PROOVEDOR DE GOOGLE */
    var provider = new firebase.auth.GoogleAuthProvider();

    //**ACCEDER A UNA VENTANA EMERGENTE  Y CON CERTIFICADO SSL (https) */
   
    firebase.auth().signInWithPopup(provider).then((result:any) => {
      console.log(result)
      // The signed-in user info.
      var user = result.user;

      if(user.J){
        let userModel: UsersModel = {
          displayName: user.displayName,
          email: user.email,
          idToken: user.b.b.h,
          method: "Google",
          //needConfrim: true,
          username: user.email.split('@')[0],
          picture: user.photoURL
        }

        //*********** EVITAR QUE SE DUPLIQUEN LOS REGISTRO EN FIREBASE DATABASE */

        localUserService.getFilterData("email",user.email).subscribe((res:any)=>{
          if(Object.keys(res).length > 0){
            SweetAlert.fnc("error",`You are already sing, please Loading with, ${res[Object.keys(res)[0]].method} method`, "login");
          }else{
            localUserService.registerDataBase(userModel).subscribe((res:any)=>{
              if(res["name"] !=""){
                SweetAlert.fnc("success", "Place Login with Google", "login")
              }
            });
          }
        })   
      }  
  })
  .catch((error) => {
    
    var errorMessage = error.message;
    SweetAlert.fnc("error", errorMessage, "register" );
  });
   

  }

}
