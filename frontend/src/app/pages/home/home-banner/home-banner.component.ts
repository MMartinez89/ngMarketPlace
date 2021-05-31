import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ProductsService } from '../../../service/products.service'
import {OwlCarouselConfig, BackgroundImage} from '../../../function';


@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.css']
})
export class HomeBannerComponent implements OnInit {

  banner_home: any[] = [];
  category: any[] = [];
  url: any[]= [];
  render: boolean = true;
  preLoad: boolean = false;
  constructor( private productsService: ProductsService) { }

  ngOnInit(): void {
    this.preLoad = true;
    let index = 0;
    this.productsService.getData().subscribe((res:any)=>{
      //TOMAR LA LONGITUD DEL OBJETO
      let size = 0;
      for(let i in res){
        size ++;
      }
      //GENERER UN NUMERO ALEATORIO
      if(size > 5 ){
        index =  Math.floor(Math.random()*(size-5));

      }
     // Object.keys(res)[index]; tomar el indice
      this.productsService.getLimit(Object.keys(res)[index],5).subscribe((res:any)=>{
        for(let i in res){
          this.banner_home.push(JSON.parse(res[i].horizontal_slider));
          this.category.push(res[i].category);
          this.url.push(res[i].url)
          this.preLoad = false;
        }
      });
    });
  }

  //FUNCION QUE NOS REALIZA CUANDO COMIENZA EL RENDERIZADO DE ANGULAR 
  callback(){
    this.render =  false;
    OwlCarouselConfig.fnc();
    BackgroundImage.fnc();
  }

}
