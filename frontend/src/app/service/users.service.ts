import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UsersModel} from '../models/users.model'

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private fireBase:string = environment.fireBase;
  private register:string = environment.register;
  private login:string = environment.login;
  private senEmailVerification: string = environment.sendEmailVerification;
  private confirmEmailVerification: string = environment.confirmEmailVerification;
  private getUserData:string = environment.getUserData;
  private sendPasswordResetEmail:string = environment.sendPasswordResetEmail;
  private verifyPasswordResetCode:string = environment.verifyPasswordResetCode;
  private confirmPasswordReset:string = environment.confirmPasswordReset;

  constructor(private httpClient: HttpClient) {

   }

   //REGISTRO EN FIREBASE AUTHENTICATION
   registerAut(user: UsersModel){
    return this.httpClient.post(`${this.register}`,user);
   }

   //REGISTRO EN FIREBASE DATA BASE
   registerDataBase(user: UsersModel){
     delete user.password;
     delete user.returnSecureToken;
     return this.httpClient.post(`${this.fireBase}users.json`,user)
   }

   getFilterData(orderBy: string, equalTo: string){
    return this.httpClient.get(`${this.fireBase}users.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);
   }

   loginAuth(user: UsersModel){
     return this.httpClient.post(`${this.login}`, user);
   }

   senEmailVerificationFnc(body:object){
    return this.httpClient.post(`${this.senEmailVerification}`, body)
   }

   confirmEmailVerificationFnc(body:object){
    return this.httpClient.post(`${this.confirmEmailVerification}`, body)
   }

   patchData(id: string, value: object){
      return this.httpClient.patch(`${this.fireBase}users/${id}.json`, value);
   }

   //****VALIDAR idToken de Autenticacion **** */

   authActivate(){

      return new Promise(resolve =>{
        //*****VALIDAR QUE EL IDTOKEN SEA REAL**** */
        if(localStorage.getItem("idToken")){
          let body = {
            idToken: localStorage.getItem("idToken")
          }
           this.httpClient.post(`${this.getUserData}`,body).subscribe((res:any)=>{
             //******VALIDAMOS FECHA DE EXPIRACION****** */
            if(localStorage.getItem("expiresIn")){
              let expiresIn = Number(localStorage.getItem("expiresIn"));
              let expiresDate = new Date();
              expiresDate.setTime(expiresIn);
              if(expiresDate > new Date()){

                resolve(true);

              }else{

                localStorage.removeItem("idToken");
                localStorage.removeItem("expiresIn");
                resolve(false);

              }
            }else{

              localStorage.removeItem("idToken");
              localStorage.removeItem("expiresIn");
              resolve(false);

            }
            
            resolve(true);

          },err=>{

            localStorage.removeItem("idToken");
            localStorage.removeItem("expiresIn");
            resolve(false);

          });
        }else{

          localStorage.removeItem("idToken");
          localStorage.removeItem("expiresIn");
          resolve(false);

        }
        
      })
   }
   //****RESETEAR CONTRASENA */
   sendPasswordResetEmailFnc(body:object){
     return this.httpClient.post(`${this.sendPasswordResetEmail}`,body)
   }

   //********CONFIRMAR EL CAMBIO DE LA CONTRASENA */
   verifyPasswordResetCodeFnc(body:object){
     return this.httpClient.post(`${this.verifyPasswordResetCode}`, body);
   }
   //*******ENVIAR NUEVA CONTRASENA */
   confirmPasswordResetFnc(body:object){
     return this.httpClient.post(`${this.confirmPasswordReset}`,body);
   }


}
