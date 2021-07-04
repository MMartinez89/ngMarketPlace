import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductsService} from '../../../service/products.service';
import {UsersService} from '../../../service/users.service';
import{DinamicPrice,DinamicRating,DinamicReviews, Rating, CountDown,ProgressBar, Tabs, SlickConfig, ProductLightbox, Quantity} from '../../../function';

@Component({
  selector: 'app-product-left',
  templateUrl: './product-left.component.html',
  styleUrls: ['./product-left.component.css'] 
})
export class ProductLeftComponent implements OnInit {

  product:any[] = [];
  cargando: boolean = false;
  rating:any[]=[];
  reviews:any[]=[];
  price:any[]=[];
  render:boolean = true;
  count:any[] = [];
  gallery: any[] = [];
  renderGallery: boolean = true;
  video: string ="";
  tags: string = "";
  totalReviews: string ="";
  offer:boolean =false;

  constructor(private activatedRoute: ActivatedRoute, private productsService: ProductsService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.cargando =  true;
    let params = this.activatedRoute.snapshot.params["param"]
    this.productsService.getFilterData("url", params).subscribe((res:any)=>{
      this.producFnc(res);
    });
  }
  producFnc(response:any){
    this.product = [];

    let getProduct:Array<any> = [];
    for(let i in response){
      getProduct.push(response[i]);
    }
    //ORDENAMOS DE MAYOR A MENOR VENTAS DEL ARRAY DE OBJETOS  
    getProduct.sort(function(a:any,b:any){
      return(b.views - a.views);
    });

    //FILTRAMOS LOS MEJORES 10
    getProduct.forEach((product, index)=>{
     
        this.product.push(product);
        this.rating.push(DinamicRating.fnc(this.product[index]));
        this.reviews.push(DinamicReviews.fnc(this.rating[index]));
        this.price.push(DinamicPrice.fnc(this.product[index]));
        //AGREGRAMOS LA FECHA AL DESCONTADOR
        if(this.product[index].offer != ""){
          let today = new Date();
          let offertDate = new Date(
            parseInt(JSON.parse(this.product[index].offer)[2].split("-")[0]),
            parseInt(JSON.parse(this.product[index].offer)[2].split("-")[1])-1,
            parseInt(JSON.parse(this.product[index].offer)[2].split("-")[2]),
          )

          if(today < offertDate){
            this.offer =  true;
            const date = JSON.parse(this.product[index].offer)[2];
            this.count.push(
            new Date(
              parseInt(date.split("-")[0]),
              parseInt(date.split("-")[1])-1,
              parseInt(date.split("-")[2]),
            )
          );
          }
          
        }
        //GALERY
        this.gallery.push(JSON.parse(this.product[index].gallery));
        //VIDEO 
        if(JSON.parse(this.product[index].video)[0]=="youtube"){
          this.video = `https://www.youtube.com/embed/${JSON.parse(this.product[index].video)[1]}?rel=0&autoplay=0`
        }
        if(JSON.parse(this.product[index].video)[0]=="vimeo"){
          this.video = `https://www.player.vimeo.com/video/${JSON.parse(this.product[index].video)[1]}`
        }
        //TAGS
          this.tags = this.product[index].tags.split(",");
        //TOTAL REVIEWS 
          this.totalReviews = JSON.parse(this.product[index].reviews).length;
        this.cargando = false;
      
    });

  }

  callback(){
    if(this.render){
      this.render =  false;
      Rating.fnc();
      CountDown.fnc();
      ProgressBar.fnc();
      Tabs.fnc();
      Quantity.fnc();
    }
  }

  callbackGallery(){
    if(this.renderGallery){
      this.renderGallery = false;
      SlickConfig.fnc();
      ProductLightbox.fnc();
    }
  }

   //Funcion para cargar la lista de deseo
   addWishList(product:any){
    this.usersService.addWishList(product);
  }


}
