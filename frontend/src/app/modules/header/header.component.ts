import { Component, OnInit } from '@angular/core';
import{Search, DinamicPrice, SweetAlert} from '../../function'
import {CategoriesService} from '../../service/categories.service';
import {environment} from '../../../environments/environment';
import {SubCategoriesService} from '../../service/sub-categories.service';
import {UsersService} from '../../service/users.service';
import {ProductsService}from '../../service/products.service';
import {Router} from '@angular/router'


declare var JQuery: any;
declare var $:  any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  //path:string = Path.url;
  fireBase: string = environment.fireBase;
  categories: any;
  arrayTitleList: any[] = [];
  render: boolean = true;
  renderShopping: boolean = true;
  authValidate: boolean = false;
  picture: string = "";
  wishList:number = 0;
  shoppingCart: any[] = [];
  totalShoppingCart:number = 0;
  subTotal:string = `<h3>Sub Total:<strong class="subTotalHeader"><div class="spinner-border"></div></strong></h3>`;
  constructor(private categoriesService: CategoriesService,
              private subCategoriesService: SubCategoriesService,
              private usersService: UsersService,
              private producstService: ProductsService,
              private router: Router) { 
  }

  ngOnInit(): void {
    /********VALIDAR SI EXISTE EL USUARIO  */
    this.usersService.authActivate().then(res=>{
      if(res){
        this.authValidate = true;
        this.usersService.getFilterData("idToken", localStorage.getItem("idToken")).subscribe((res:any)=>{
          
        
          for(const i in res){

            //Mostramos cantidad de producto en la lista de deseos
            if(res[i].wishList != undefined){
              this.wishList = Number(JSON.parse(res[i].wishList).length)
            }
          

            //Mostramos foto del usuario
            
            if(res[i].picture != undefined){
              if(res[i].method != "direct"){
                this.picture = `<img src = "${res[i].picture}" class = "img-fluid rounded-circle ml-auto">`
              }else{
                this.picture = `<img src = "assets/img/users/${res[i].username.toLowerCase()}/${res[i].picture}" class = "img-fluid rounded-circle ml-auto">`
              }
            }else{
              this.picture = `<i class="icon-user"></i>`;
            }
          }
        });
      }
    });
    /* TOMAMOS LA DATA DE LA CATEGORIA  */
    this.categoriesService.getData().subscribe((res:any)=>{
      this.categories =  res;

      //recorremos la coleccion de categorias para tomar la lista de titulos 

      let i;
      for(i in res){
        this.arrayTitleList.push(JSON.parse(res[i].title_list));
        //console.log("RESPUESTA", this.arrayTitleList);
      }
    });
    //Tomamos la data del carrito de compras en el LocalStorage
    if(localStorage.getItem("list")){
      let list = JSON.parse(localStorage.getItem("list") || '{}');
      this.totalShoppingCart = list.length;
      //recorremos los articulos del llistado
      for(let i in list){
        //Filtramos los productos del carrito de compras
        this.producstService.getFilterData("url", list[i].product).subscribe((res:any)=>{
          for(const f in res){

            let details = `<div class="list-details small text-secundary">`;

            if(list[i].details.length > 0){
              let specification = JSON.parse(list[i].details);
              
              for(const i in specification){
                let property = Object.keys(specification[i]);
                for(const j in property){
                  details += `<div>${property[j]}: ${specification[i][property[j]]}</div>`
                }
              }
            }else{
              //Mostrar detalle por defecto
              if(res[f].specifitacion != ""){
                let specification =  JSON.parse(res[f].specification);
                for(const i in specification){
                  let property = Object.keys(specification[i]).toString();
                  details += `<div>${property}: ${specification[i][property][0]}</div>`
                }
              }
            }

            details+= `</div>`

            this.shoppingCart.push({
              url: res[f].url,
              name: res[f].name,
              category: res[f].category,
              image: res[f].image,
              delivery_time: res[f].delivery_time,
              quantity: list[i].unit,
              price: DinamicPrice.fnc(res[f])[0],
              shipping: Number(res[f].shipping)*Number(list[i].unit),
              details: details,
              listDetails: list[i].details
            });
          }
        });
      }
    }
  }

  goSearch(search:String){
    if(search.length == 0 || Search.fnc(search)== undefined){
      return
    }

    window.open(`search/${Search.fnc(search)}`, '_top');
  }
  callback(){
    if(this.render){
      this.render = false;
      let arraySubcategories:Array<any> = [];

      //console.log("RENDER", this.render);
      this.arrayTitleList.forEach(titleList =>{
        //console.log("TITLE LIST", titleList);
        //let i;
        for(let i=0;i < titleList.length; i++){
          //console.log("RESPUESTA", titleList[i]);
          this.subCategoriesService.getFilterData("title_list", titleList[i]).subscribe((res:any)=>{
          //console.log("Respuesta",res);
           arraySubcategories.push(res);

           let arrayTitleName:Array<any> = [];
           for(let f in arraySubcategories){
           // console.log("RESPUESTA", arraySubcategories[f]);
            for(let g in arraySubcategories[f]){
              arrayTitleName.push(
                {
                  "titleList": arraySubcategories[f][g].title_list,  
                  "subCategory": arraySubcategories[f][g].name,
                  "url": arraySubcategories[f][g].url,
                }
              );
            }
           }
           for(let f in arrayTitleName){
            if(titleList[i] == arrayTitleName[f].titleList){
              //console.log("titleList [i]", titleList[i]);
              //console.log("arrayTitleName[f].subCategory", arrayTitleName[f].subCategory);
              $(`[titleList='${titleList[i]}']`).append(
                `
                <li>
                  <a href="products/${arrayTitleName[f].url}">${arrayTitleName[f].subCategory}</a>
                </li>
                `
              );
            }
           }
           //console.log("res", arrayTitleName);
          });
        }
      });
    }
  }

  callbackShopping(){
    if(this.renderShopping){
     this.renderShopping = false 
     
     //Sumar valores para el precio total
     let totalProduct = $(".ps-product--cart-mobile")

     setTimeout(function(){
      let price = $(".pShoppingHeader .end-price");
      let quantity = $(".qShoppingHeader");
      let shipping = $(".sShoppingHeader");

      let totalPrice = 0;
 
      for(let i=0; i < price.length; i++){

      //Sumar precio con envio

        let shipping_price = Number($(price[i]).html()) + Number($(shipping[i]).html());

        totalPrice =  totalPrice + Number($(quantity[i]).html())*shipping_price;

      }
      $(".subTotalHeader").html(`$${totalPrice.toFixed(2)}`);
     },totalProduct.length * 500);
   
    }
  }

  removeProduct(product:string, details: any){
    if(localStorage.getItem("list")){
      let shoppingCart = JSON.parse(localStorage.getItem("list") || "{}");
      shoppingCart.forEach((list:any, index:any)=>{
        if(list.product == product && list.details == details.toString()){
          shoppingCart.splice(index, 1);
        }
      })
      //Actualizamos en el LocalStoreage la lista del carrito de compras
      localStorage.setItem("list", JSON.stringify(shoppingCart));
      SweetAlert.fnc("success","product removed", this.router.url)
    }
  }

}