import { Component, OnInit, Input } from '@angular/core';
import {ProductsService} from '../../../../service/products.service';
import {DinamicPrice} from '../../../../function';

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

  constructor(private producService: ProductsService) { }

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
    getProduct.forEach((product,index)=>{
      if(index < 1){
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

}
