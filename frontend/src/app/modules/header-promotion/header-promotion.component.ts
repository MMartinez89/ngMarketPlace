import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {ProductsService} from '../../service/products.service';


@Component({
  selector: 'app-header-promotion',
  templateUrl: './header-promotion.component.html',
  styleUrls: ['./header-promotion.component.css']
})
export class HeaderPromotionComponent implements OnInit {

  fireBase: string = environment.fireBase;

  top_banner:any;
  category: any;
  preLoad: boolean = false;
  url: any;

  constructor(private productsService: ProductsService) { }


  ngOnInit(): void {

    this.preLoad = true;
    this.productsService.getData().subscribe((res:any) =>{
     //console.log("respuesta", res[Object.keys(res)[1]]);
      
    let i;
    let size = 0;

    for(i in res){
      size++
    }
    //numero aleatorio
    let index = Math.floor (Math.random()*size);
    
    //********devolvemos a la vista un numero aletorio**********

    this.top_banner = JSON.parse(res[Object.keys(res)[1]].top_banner);
    this.category = res[Object.keys(res)[1]].category;
    this.url = res[Object.keys(res)[1]].url;
    this.preLoad = false;

    });
  }

}
