import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {ProductsService} from '../../../service/products.service';
import{Rating, DinamicPrice,DinamicReviews, DinamicRating} from '../../../function';
import {UsersService} from '../../../service/users.service';

@Component({
  selector: 'app-similar-bought',
  templateUrl: './similar-bought.component.html',
  styleUrls: ['./similar-bought.component.css']
})
export class SimilarBoughtComponent implements OnInit {

  products:any[]=[];
  rating: any[] = [];
  reviews: any[] = [];
  price: any[] = [];
  render: boolean =  true;
  cargando: boolean = false;
  constructor(private productsService: ProductsService, 
              private activatedRoute: ActivatedRoute, 
              private usersService: UsersService,
              private router: Router) { }

  ngOnInit(): void {
    this.cargando = true;
    this.productsService.getFilterData("url", this.activatedRoute.snapshot.params["param"]).subscribe((res:any)=>{
      for(let i in res){
        this.productsService.getFilterData("sub_category",res[i].sub_category).subscribe((res1:any)=>{
          this.producFnc(res1);
        });
      }
    });
  }

  producFnc(response:any){
    this.products = [];

    let getProduct:Array<any> = [];
    for(let i in response){
      getProduct.push(response[i]);
    }
    //ORDENAMOS DE MAYOR A MENOR VISTAS  DEL ARRAY DE OBJETOS  
    getProduct.sort(function(a:any,b:any){
      return(b.views - a.views);
    });

    //FILTRAMOS LOS MEJORES 10
    getProduct.forEach((product, index)=>{
      if(index < 6){
        this.products.push(product);

        this.rating.push(DinamicRating.fnc(this.products[index]));
        this.reviews.push(DinamicReviews.fnc(this.rating[index]));
        this.price.push(DinamicPrice.fnc(this.products[index]))
      }
    });
  }

  callback(){
    if(this.render){
      this.render = false;
      setTimeout(function(){
        Rating.fnc();
      },1000);
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
