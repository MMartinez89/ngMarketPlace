import { Component, OnInit } from '@angular/core';
import {OwlCarouselConfig, CarouselNavigation, Rating, DinamicPrice, DinamicRating, DinamicReviews} from '../../../function';
import {ProductsService} from '../../../service/products.service';

import {ActivatedRoute} from '@angular/router';

declare var JQuery:any;
declare var $: any;

@Component({
  selector: 'app-best-sales-item',
  templateUrl: './best-sales-item.component.html',
  styleUrls: ['./best-sales-item.component.css']
})
export class BestSalesItemComponent implements OnInit {

  bestSalesItem:any[]=[];
  render:boolean = true;
  rating: any[]=[];
  reviews: any[]=[];
  price: any[]=[];
  cargando: boolean = false;


  constructor(private productsService: ProductsService, private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {
    this.cargando = true;
    //CAPTURAMOS LA VARIABLE PARAMS 
    let params = this.activatedRoute.snapshot.params["param"].split("&")[0];

    this.productsService.getFilterData("category",params).subscribe((res:any)=>{
      if(Object.keys(res).length>0){
        for(let i in res){
          this.producFnc(res);
        }
      }else{
        this.productsService.getFilterData("sub_category", params).subscribe((res1:any)=>{
         this.producFnc(res1);
        });
      }
    });
      
    
   // OwlCarouselConfig.fnc();
    //CarouselNavigation.fnc();
  }

  //FUNCION PARA MOSTRAR LAS MEJORES VENTAS
  producFnc(response:any){
    this.bestSalesItem=[];

    let getSales:Array<any> = [];
    for(let i in response){
      getSales.push(response[i]);
    }
    //ORDENAMOS DE MAYOR A MENOR VENTAS DEL ARRAY DE OBJETOS  
    getSales.sort(function(a:any,b:any){
      return(b.sales - a.sales);
    });

    //FILTRAMOS LOS MEJORES 10
    getSales.forEach((product, index)=>{
      if(index<10){
        this.bestSalesItem.push(product);
        this.rating.push(DinamicRating.fnc(this.bestSalesItem[index]));
        this.reviews.push(DinamicReviews.fnc(this.rating[index]));
        this.price.push(DinamicPrice.fnc(this.bestSalesItem[index]));
        this.cargando = false;
      }
    });

  }

  callback(){
    if(this.render){
      this.render = false;
      OwlCarouselConfig.fnc();
      CarouselNavigation.fnc();
      Rating.fnc();
    }
  }

}
