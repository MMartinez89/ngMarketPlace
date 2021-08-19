import { Component, OnInit } from '@angular/core';
import {OwlCarouselConfig, CarouselNavigation, Rating, DinamicReviews, DinamicRating,DinamicPrice} from '../../../function';
import {ProductsService} from '../../../service/products.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '../../../service/users.service';


@Component({
  selector: 'app-products-recommended',
  templateUrl: './products-recommended.component.html',
  styleUrls: ['./products-recommended.component.css']
})
export class ProductsRecommendedComponent implements OnInit {

  recommendedItems:any[]=[];
  render:boolean = true;
  rating: any[]=[];
  reviews: any[]=[];
  price: any[]=[];
  cargando:boolean =  false;

  constructor(private productsService: ProductsService,
              private activatedRoute: ActivatedRoute,
              private usersService:UsersService,
              private router: Router ) { }

  ngOnInit(): void {
    //CAPTURAMOS LA VARIABLE PARAMS 
    this.cargando = true;
    let params = this.activatedRoute.snapshot.params["param"].split("&")[0];

    this.productsService.getFilterData("category",params).subscribe((res:any)=>{
      if(Object.keys(res).length>0){
          this.producFnc(res);
      }else{
        this.productsService.getFilterData("sub_category", params).subscribe((res1:any)=>{
         this.producFnc(res1);
        });
      }
    });
      
   
  }

  //FUNCION PARA MOSTRAR LAS MEJORES VENTAS
  producFnc(response:any){
    this.recommendedItems=[];

    let getSales:Array<any> = [];
    for(let i in response){
      getSales.push(response[i]);
    }
    //ORDENAMOS DE MAYOR A MENOR VENTAS DEL ARRAY DE OBJETOS  
    getSales.sort(function(a:any,b:any){
      return(b.views - a.views);
    });

    //FILTRAMOS LOS MEJORES 10
    getSales.forEach((product, index)=>{
      if(index<10){
        this.recommendedItems.push(product);
        this.rating.push(DinamicRating.fnc(this.recommendedItems[index]));
        this.reviews.push(DinamicReviews.fnc(this.rating[index]));
        this.price.push(DinamicPrice.fnc(this.recommendedItems[index]));
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

  //Funcion para cargar la lista de deseo
  addWishList(product:any){
    this.usersService.addWishList(product);
  } 

  addShoppingCart(product:any, unit:any, details:any){

    //Capturasmos la url
    let url = this.router.url;

    let item ={
      product: product,
      unit: unit,
      details: details,
      url: url
    }

   this.usersService.addShoppingCart(item);

  }


}
