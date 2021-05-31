import { Component, OnInit } from '@angular/core';
import {ProductsService} from '../../../service/products.service'

@Component({
  selector: 'app-home-promotions',
  templateUrl: './home-promotions.component.html',
  styleUrls: ['./home-promotions.component.css']
})
export class HomePromotionsComponent implements OnInit {

  banner_default:any[]= [];
  category:any[]=[];
  url:any[]=[];
  preLoad:boolean =  false;
  constructor(private productService: ProductsService) { }

  ngOnInit(): void {
    this.preLoad = true;
    let index = 0;
    this.productService.getData().subscribe((res:any)=>{
      //Longitud del objeto 
      let size = 0;
      for(let i in res){
        size ++;
      }
      //Generamos un numero aleatorio
    if(size >2){
      index =  Math.floor(Math.random()*(size-2));
    }
    this.productService.getLimit(Object.keys(res)[index],2).subscribe((res:any)=>{
      for(let i in res){
        this.banner_default.push(res[i].default_banner);
        this.category.push(res[i].category);
        this.url.push(res[i].url)
        this.preLoad = false;
      }
    });
    });
  }

}
