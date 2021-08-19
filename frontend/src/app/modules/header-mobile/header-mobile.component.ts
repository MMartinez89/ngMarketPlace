import { Component, OnInit } from '@angular/core';
import {Search, DinamicPrice, SweetAlert} from '../../function';
import {CategoriesService} from '../../service/categories.service';
import {environment} from '../../../environments/environment';
import {SubCategoriesService} from '../../service/sub-categories.service';
import {UsersService} from '../../service/users.service';
import {ProductsService} from '../../service/products.service';
import {Router} from '@angular/router';

declare var JQuery:any;
declare var $:any;

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.css']
})
export class HeaderMobileComponent implements OnInit {

   fireBase:string =  environment.fireBase;
   categories: any;
   render:boolean = true;
   categoriesList:any[] = [];
   authValidate: boolean = false;
   picture: string = "";
   totalShoppingCart = 0;
   shoppingCart: any[] = [];
   subTotal:string = `<h3>Sub Total:<strong class="subTotalHeader"><div class="spinner-border"></div></strong></h3>`;
   renderShopping =  true;
  constructor(private categoriaService: CategoriesService,
              private subCategoriesService: SubCategoriesService,
              private usersService: UsersService,
              private productsService: ProductsService,
              private router: Router) { }

  ngOnInit(): void {

     /********VALIDAR SI EXISTE EL USUARIO  */
     this.usersService.authActivate().then(res=>{
      if(res){
        this.authValidate = true;
        this.usersService.getFilterData("idToken", localStorage.getItem("idToken")).subscribe((res:any)=>{
          
          for(const i in res){
            if(res[i].picture != undefined){
            //if(res[i].picture != "" || res[i].picture == undefined){
              if(res[i].method != "direct"){
                this.picture = `<img src = "${res[i].picture}" class = "img-fluid rounded-circle  ml-auto">`
              }else{
                this.picture = `<img src = "assets/img/users/${res[i].username.toLowerCase()}/${res[i].picture}" class = "img-fluid rounded-circle  ml-auto">`
              }
            }else{
              this.picture = `<i class="icon-user"></i>`;
            }
          }
        });
      }
    });

    this.categoriaService.getData().subscribe((res:any)=>{
      //console.log("RESPUESTA", res);
      this.categories = res;
      for(let i in res){
        this.categoriesList.push(res[i].name);
      }
    });

    //ACTIVAMOS EL EFECTO TOOGLE //

    //$(document).on() trabaja cuando el DOM esta cargado 
    $(document).on("click", ".sub-toggle",function(this:any){
      //.parent()va al padre
      //.childer() va al hijo 
      $(this).parent().children('ul').toggle();  
    });
    //Tomamos la data del carrito de compras 
    if(localStorage.getItem("list")){
      let list = JSON.parse(localStorage.getItem("list") || '{}')
      this.totalShoppingCart = list.length;
      for(let i in list){
        //Filtramos los productos del carrito de compras
        this.productsService.getFilterData("url", list[i].product).subscribe((res:any)=>{
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

    if(search.length == 0 || Search.fnc(search) == undefined){
      return
    }
    window.open(`search/${Search.fnc(search)}`, '_top');
  }
  callback(){
    if(this.render){
      this.render=false;
      let arraySubcategories:Array<any> = [];
      //Separar las categorias
     this.categoriesList.forEach(category=>{
        this.subCategoriesService.getFilterData("category", category).subscribe((res:any)=>{
          //hacemos un recorrido por la coleccion general de subcategories y calificamos 
          //deacuerdo a la categoria que corresponda
          for(let i in res){
           arraySubcategories.push(
             {
            "category": res[i].category,  
            "subCategory": res[i].name,
            "url": res[i].url,
             }
           );
          }
          //recorremos el array de objetos nuevos para buscar coincidencias con los nombres de categorias
          for(let f in arraySubcategories){
            if(category == arraySubcategories[f].category){

              $(`[category='${category}']`).append(
                    `
              <li class="current-menu-item ">
                <a href="products/${arraySubcategories[f].url}">${arraySubcategories[f].category}"></a>
              </li>
              `
              );
          
            }
          }
        });
     });
    }
  }

  callbackShopping(){
    if(this.renderShopping){
     this.renderShopping = false 
     
     //Sumar valores para el precio total
     let totalProduct = $(".ps-product--cart-mobile")

     setTimeout(function(){
      let price = $(".pShoppingHeaderM .end-price");
      let quantity = $(".qShoppingHeaderM");
      let shipping = $(".sShoppingHeaderM");

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

  removeProduct(product:string, details:any){
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
