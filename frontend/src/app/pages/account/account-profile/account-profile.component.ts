import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {UsersService} from '../../../service/users.service';
import {SweetAlert, Tooltip} from '../../../function';
import {ActivatedRoute} from '@angular/router';
import{environment} from '../../../../environments/environment'

declare var JQuery:any;
declare var $:any;

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.css']
})
export class AccountProfileComponent implements OnInit {

  vendor: boolean = false;
  displayName:string = "";
  userName: string = "";
  email: string = "";
  picture: string = "";
  preLoad: boolean = false;
  method: boolean =false;
  server:string = environment.Server;
  image: any;

  constructor(private usersService: UsersService, private activatedRoute: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.preLoad = true;
    //***VALIDAMOS SI EL USUARIO ESTA AUTENTICADO */
    this.usersService.authActivate().then(res=>{
      if(res){
        this.usersService.getFilterData("idToken", localStorage.getItem("idToken")).subscribe((res:any)=>{
          for(const i in res){
            if(res[i].vendor != undefined){
              this.vendor = true;
            } 
            //***AGREGAMOS NOMBRE COMPLETO */
            this.displayName = res[i].displayName;

            //**AGREGAMOS EL userName */
            this.userName = res[i].username;

            //**AGREGAMOS EL EMAIL */
            this.email = res[i].email;

            //**AGREFAMOS EL IMAGEN */
            for(const i in res){
              if(res[i].picture != undefined){
                if(res[i].method != "direct"){
                  this.picture = res[i].picture;
                }else{
                  this.picture = `assets/img/users/${res[i].username}/${res[i].picture}`;
                }
              }else{
                this.picture = `assets/img/users/default/default.png`;
              }
            //**AGREGAMOS EL METODO DE REGISTRO */
            if(res[i].method !="direct"){
              this.method = true
            }
            this.preLoad = false;
            }
          }
        });
      }
    });
    Tooltip.fnc();

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

    //*****Script para subir imagen con el input de boostrap */
    // Add the following code if you want the name of the file appear on select
    $(".custom-file-input").on("change", function(this:any) {
      var fileName = $(this).val().split("\\").pop();
      $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
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

  //****ENVIAR NUEVA CONTRASENA */
  newPassword(value:any){
    if(value !=""){
      SweetAlert.fnc("loading","Loading...", null);
      let body = {
        idToken: localStorage.getItem("idToken"),
        password: value,
        eturnSecureToken: true
      }

      this.usersService.changePasswordFnc(body).subscribe((res:any)=>{

           //ALMACENAMOS EL TOKEN DE SEGURODAD EN EL LOCAL STORAGE
           localStorage.setItem("idToken", res["idToken"]);
           let today =  new Date();
           today.setSeconds(res["expiresIn"]);
           localStorage.setItem("expiresIn", today.getTime().toString());
           SweetAlert.fnc("success","Password change Successful","account");
      }, err =>{
        SweetAlert.fnc("error",err.error.error.message, null);
      });
    }
  }
  //***Validar imagen */
  validateImage(e:any){
    this.image = e.target.files[0];
    //**Validamos el formato*/
    if(this.image["type"] !== "image/jpeg" && this.image["type"] !== "image/png" ){
      SweetAlert.fnc("error","The image must be in JPG or PNG format",null);
      return; 
    }
    //**Validamos e; tamano de la imagen */
    else if(this.image["size"]> 2000000){
      SweetAlert.fnc("error","The image must weigh more than 2MB",null);
      return; 
    }
    //**Mostramos la imagen temporal */
    else{
      let data = new FileReader(); //lector de archivo
      data.readAsDataURL(this.image);
      $(data).on("load", function(event:any){
        let path = event.target.result;
        $(".changePicture").attr("src", path)
      })
    }
  }
  upLoadImage(){
    const formData = new FormData;
    formData.append("file", this.image)
    this.http.post(this.server, formData).subscribe((res:any)=>{
      console.log("res",res)
    });
  }
}
