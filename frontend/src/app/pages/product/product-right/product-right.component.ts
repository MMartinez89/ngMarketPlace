import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {ProductsService} from '../../../service/products.service';
import{Rating, DinamicPrice,DinamicReviews, DinamicRating} from '../../../function';
import {UsersService} from '../../../service/users.service';

@Component({
  selector: 'app-product-right',
  templateUrl: './product-right.component.html',
  styleUrls: ['./product-right.component.css']
})
export class ProductRightComponent implements OnInit {

  products:any[]=[];
  rating: any[] = [];
  reviews: any[] = [];
  price: any[] = [];
  render: boolean =  true;
  cargando: boolean = false;
  constructor(private productsService: ProductsService, private activatedRoute: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.cargando = true;
    this.productsService.getFilterData("url", this.activatedRoute.snapshot.params["param"]).subscribe((res:any)=>{
      for(let i in res){
        this.productsService.getFilterData("store",res[i].store).subscribe((res1:any)=>{
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
    //ORDENAMOS DE MAYOR A MENOR VENTAS DEL ARRAY DE OBJETOS  
    getProduct.sort(function(a:any,b:any){
      return(b.sales - a.sales);
    });

    //FILTRAMOS LOS MEJORES 10
    getProduct.forEach((product, index)=>{
      if(index < 4){
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
      Rating.fnc();
    }
  }

   //Funcion para cargar la lista de deseo
   addWishList(product:any){
    this.usersService.addWishList(product);
  }
}
