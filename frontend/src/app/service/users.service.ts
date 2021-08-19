import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UsersModel} from '../models/users.model'
import {SweetAlert} from '../function';
import {ProductsService} from './products.service';


declare var JQuery:any;
declare var $:any;

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
  private changePassword:string = environment.changePassword;

  constructor(private httpClient: HttpClient, private productsService: ProductsService) {

   }

   //REGISTRO EN FIREBASE AUTHENTICATION
   registerAut(user: UsersModel){
    return this.httpClient.post(`${this.register}`,user);
   }

   //REGISTRO EN FIREBASE DATA BASE
   registerDataBase(user: UsersModel){
     delete user.first_name;
     delete user.last_name;
     delete user.password;
     delete user.returnSecureToken;
     return this.httpClient.post(`${this.fireBase}users.json`,user)
   }

   getFilterData(orderBy: string, equalTo: any){
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

   changePasswordFnc(body: object){
     return this.httpClient.post(`${this.changePassword}`, body)
   }

   //Tomar informacion de un solo usuario
   getUniqueData(value: string){
     return this.httpClient.get(`${this.fireBase}users/${value}.json`);
   }

   //Funcion para agregar productos a la lista de deseos
   addWishList(product: string){
    this.authActivate().then((res:any)=>{
    
      if(!res){
        SweetAlert.fnc("error","The user must be logged in", null);
        return;
      }else{
        //Traemos la lista de deseos que ya tenga el usuario
        this.getFilterData("idToken", localStorage.getItem("idToken")).subscribe((res:any)=>{

          let id = Object.keys(res).toString();

          for(const i in res){
            //Preguntamos si existe la lista de deseo en ese usuario
            if(res[i].wishList != undefined){
             //Preguntamos si existe la lista de deseos

             let wishList = JSON.parse(res[i].wishList);
             let lenght: number = 0;

             //Preguntamos si existe un producto en la lista de deseos
             if(wishList.length > 0){
              wishList.forEach((list:any, index:any)=>{
                //Preguntamos si no a agregado el producto a la lista de deseos
                if(list == product){
                  lenght --;
                }else{
                  lenght ++;
                }

              });
              if(lenght != wishList.length){

                SweetAlert.fnc("error", "It already exists in yor whishList",null);
              }else{
                wishList.push(product);
                let body = {
                  wishList : JSON.stringify(wishList)
                }
                this.patchData(id,body).subscribe((res:any)=>{
                  if(res["wishList"] !=""){

                    let totalWishList = Number($(".totalWishList").html());
                    $(".totalWishList").html(totalWishList+1);
                    SweetAlert.fnc("success", "Product add to whish List", null);
                  }
                });
              }
             }else{
              wishList.push(product);
              let body = {
                wishList : JSON.stringify(wishList)
              }
              this.patchData(id,body).subscribe((res:any)=>{
                if(res["wishList"] !=""){
                  let totalWishList = Number($(".totalWishList").html());
                  $(".totalWishList").html(totalWishList+1);
                  SweetAlert.fnc("success", "Product add to whish List", null);
                }
              });
             }
             //Cuando no exita lista de deseos inicialmente
            }else{
              let body = {
                wishList : `["${product}"]`
              }
              this.patchData(id,body).subscribe((res:any)=>{
                if(res["wishList"] !=""){
                  let totalWishList = Number($(".totalWishList").html());
                  $(".totalWishList").html(totalWishList+1);
                  SweetAlert.fnc("success", "Product add to whish List", null);
                }
              });
            }
          }
         

        });
      }
    });
   }
   //Funcion para agregar productos al carrito de compras
   addShoppingCart(item:any){
     //Filtramos el producto en la data
    this.productsService.getFilterData("url", item.product).subscribe((res:any)=>{
      for(let i in res){
        if(res[i]["stock"] == 0){
          SweetAlert.fnc("error","Out of stock",null);
          return;
        }

         //Preguntamos si el Item de detalle viene vacio
        if(item["details"].length == 0){
          if(res[i].specification != ""){
            let specification = JSON.parse(res[i].specification);
            item["details"] = `[{`;
            for(const j in specification){
              let property = Object.keys(specification[j]).toString();
              item["details"] += `"${property}":"${specification[j][property[0]]}",`
            }
            item["details"] = item["details"].slice(0, -1)//.splice(0,-1) elimina el ultimo caracter de la cadena de texto
            item["details"] += `}]`
          }
        }
      } 
      
    });
    //Agregamos al local storage la variable del llistado de compras
    if(localStorage.getItem("list")){
     
      let arrayList = JSON.parse(localStorage.getItem("list") || '{}');
       //Preguntar si el producto se repite
       let count = 0;
       let index: any;
       for(let i in arrayList){
         
         if(arrayList[i].product == item.product && arrayList[i].details.toString() == item["details"].toString()){
          count --;
          index = i;
         }else{
           count ++;
         }
         
      }
      //Validamos si el producto se repite
      if(count == arrayList.length){
        arrayList.push(item);
      }else{
        arrayList[index].unit = arrayList[index].unit +  item.unit;
      }
      
      localStorage.setItem("list", JSON.stringify(arrayList));
      SweetAlert.fnc("success","Produc added to Shopping Cart",item.url);
    }else{
      let arrayList = [];
      arrayList.push(item);
      localStorage.setItem("list", JSON.stringify(arrayList));
      SweetAlert.fnc("success","Produc added to Shopping Cart",item.url);
    }
   }

   getCountries(){
     return this.httpClient.get('./assets/json/country.json');
   }
}
