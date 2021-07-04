import { Component, OnInit } from '@angular/core';
import{Search, DinamicPrice} from '../../function'
import {CategoriesService} from '../../service/categories.service';
import {environment} from '../../../environments/environment';
import {SubCategoriesService} from '../../service/sub-categories.service';
import {UsersService} from '../../service/users.service';
import {ProductsService}from '../../service/products.service';


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
              private producstService: ProductsService) { 
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
            this.shoppingCart.push({
              url: res[f].url,
              name: res[f].name,
              category: res[f].category,
              image: res[f].image,
              delivery_time: res[f].delivery_time,
              quantity: list[i].unit,
              price: DinamicPrice.fnc(res[f])[0],
              shipping: Number(res[f].shipping)*Number(list[i].unit),
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
      console.log("total", totalPrice);
      $(".subTotalHeader").html(`$${totalPrice}`);
     },totalProduct.length * 500);
   
    }
  }

}