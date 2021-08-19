import { Component, OnInit, Input } from '@angular/core';
import {ProductsService} from '../../../../service/products.service';
import {DinamicPrice} from '../../../../function';
import {UsersService} from '../../../../service/users.service';
import {Router} from '@angular/router';

declare var $:any;
declare var JQuery:any;

@Component({
  selector: 'app-bought-toggether',
  templateUrl: './bought-toggether.component.html',
  styleUrls: ['./bought-toggether.component.css']
})
export class BoughtToggetherComponent implements OnInit {

  @Input() childItem: any; 
  products: any[]=[];
  price: any[]=[];
  render:boolean =  true;

  constructor(private producService: ProductsService, private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.producService.getFilterData("title_list", this.childItem['title_list']).subscribe((res:any)=>{
      this.productsFnc(res);
    });
  }

  productsFnc(response:any){
    this.products.push(this.childItem);
    let getProduct: Array<any> = [];
    for(let i in response){
      getProduct.push(response[i])
    }
    //ORDERNAR DE MAYOR O MENOR VISUALIAZACIONES 
    getProduct.sort(function(a,b){
      return (b.views - a.views)
    });
    //FILTRAMOS SOLO UN PRODUCTO
    let random = Math.floor(Math.random()*getProduct.length);
    getProduct.forEach((product,index)=>{
      let notIndex =0;

      if(this.childItem["name"] == product["name"]){
        notIndex = index;
      }

      if(random == notIndex){
        let random = Math.floor(Math.random()*getProduct.length);
      }

      if(index != notIndex && index == random){
        this.products.push(product);
      }
    });
    for(const i in this.products){
         //PRICE
        this.price.push(DinamicPrice.fnc(this.products[i]))
    }
  }

  callback(){
    if(this.render){
      this.render =  false;
      let price = $(".endPrice .end-price");
      let total = 0;
      for(let i = 0; i< price.length;i ++){
        total += Number($(price[i]).html());
      }
      $('.ps-block__total strong').html(`$${total.toFixed(2)}`);
    }
  }

  addWishList(product:any, product1:any){
    this.usersService.addWishList(product);
    
    let localUserService = this.usersService;
    setTimeout(function(){
      localUserService.addWishList(product1); 
    },1000);
  }

  addShoppingCart(product1:any, unit1:any, details1:any, product2:any, unit2:any, details2:any){

    //Capturasmos la url
    let url = this.router.url;

    let item1 ={
      product: product1,
      unit: unit1,
      details: details1,
      url: url
    }

   this.usersService.addShoppingCart(item1);

   let localUserService = this.usersService;
   setTimeout(function(){
    let item2 ={
      product: product2,
      unit: unit2,
      details: details2,
      url: url
    }
     localUserService.addShoppingCart(item2)
   }, 1000)

  }

}
