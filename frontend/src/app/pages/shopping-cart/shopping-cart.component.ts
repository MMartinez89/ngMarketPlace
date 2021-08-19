import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subject} from 'rxjs';
import {ProductsService} from '../../service/products.service';
import{DinamicPrice, Quantity} from '../../function';
import {SweetAlert} from '../../function';
import {Router} from '@angular/router';
//@ts-ignore
import notie from 'notie';
//@ts-ignore
import {confirm} from 'notie'

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  totalShoppingCart:any[]=[];
  shoppingCart:any[] = [];
  dtTrigger: Subject<any> = new Subject();
  quantity: number = 1;
  render: boolean = true;
  totalP:string = `<div class="p-2"><h3>Total <span class = "totalP"><div class="spinner-border"></div></span></h3></div>`;
  popoverMessage: string = "Are you sure to remove it?";

  constructor(private producstService: ProductsService, private router: Router) { }

  ngOnInit(): void {
     //Agregamos lsa opciones de Data Tables
     this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true
     }
     if(localStorage.getItem("list")){
      let list = JSON.parse(localStorage.getItem("list") || '{}');
      this.totalShoppingCart = list.length;
      //recorremos los articulos del llistado
      let load = 0;
      for(let i in list){
        //load ++; 
        //Filtramos los productos del carrito de compras
        this.producstService.getFilterData("url", list[i].product).subscribe((res:any)=>{
          for(const f in res){
            load ++;
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
              if(load == list.length){
                this.dtTrigger.next();
              }
          }
        });
        
      }
    }
  }

  callback(){

    if(this.render){
      this.render = false;
      this.totalPrice(this.totalShoppingCart)

      setTimeout(function(){
        Quantity.fnc();
      },500);
     
    }

  }


  changeQuantity(quantity:any, unit: any, move:any, product:any, details:any){
    let number = 1;
    
    if(Number(quantity) > 9){
      quantity = 9;
    }

    if(Number(quantity) < 1){
      quantity = 1;
    }

    //Modificar cantidad deacuerdo a la direccion

    if(move == 'up' && Number(quantity) < 9){
      number = Number(quantity) + unit;
    }

    else if(move == 'down' && Number(quantity) > 1){
      number = Number(quantity) - unit;

    }else{
      number = Number(quantity);
    }
    
    //Actualizar la variable List en el LocalStorage

    if(localStorage.getItem("list")){
      let shoppingCart = JSON.parse(localStorage.getItem("list") || "{}");
      shoppingCart.forEach((list:any) =>{
        if(list.product == product && list.details == details.toString()){
          list.unit = number;
        }
      })
      localStorage.setItem("list", JSON.stringify(shoppingCart))
      this.totalPrice(shoppingCart.length)
    }
  }

  //Actualizar total y subtotal

  totalPrice(totalShoppingCart:any){
    setTimeout(function(){

      let price = $(".pShoppingCart .end-price");
      let quantity = $(".qShoppingCart")
      let shipping = $(".sShoppingCart");
      let subTotalPrice:any = $(".subTotalPrice");
      let total = 0

      for(let i = 0 ; i < price.length; i++){
      
        //Sumar precio con envio 
        let shipping_price = Number($(price[i]).html()) + Number($(shipping[i]).html());
        //Multiplicar cantidad por  precio con envio 
        let subTotal =  Number($(quantity[i]).val()) * shipping_price;

        //Mostramos subTotales de cada producto
        $(subTotalPrice[i]).html(`$${subTotal.toFixed(2)}`);

        //Definimos el total de los precios 
        total += subTotal;
      }

      $(".totalP").html(`$${total.toFixed(2)}`)


    },totalShoppingCart * 1000)
  }

  removeProduct(product:string,details: any){
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
 
  ngOnDestroy():void{
    this.dtTrigger.unsubscribe();
  }

}
