import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductsService} from '../../../service/products.service';
import {UsersService} from '../../../service/users.service';
import{DinamicPrice,DinamicRating,DinamicReviews, Rating, CountDown,ProgressBar, Tabs, SlickConfig, ProductLightbox, Quantity, Tooltip} from '../../../function';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

declare var $:any;
declare var JQuery:any;


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
  quantity: number = 1;

  constructor(private activatedRoute: ActivatedRoute, 
              private productsService: ProductsService, 
              private usersService: UsersService,
              private router:Router) { }

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

      //Agregamos detalle del producto
      if($(".ps-product__variations").attr("specification")!= ""){
        JSON.parse($(".ps-product__variations").attr("specification")).forEach((details:any, index:any)=>{
          //console.log("details", details)
          let property = Object.keys(details).toString();
          let figure = ` <figure class="details${index}">
                            <figcaption>${property}: <strong>Choose an option</strong></figcaption>

                            <div class="d-flex">
                            </div>
                          </figure>`  
          $(".ps-product__variations").append(`${figure}`);
          for(let i in details[property]){
            if(property === "Color"){
              $(`.details${index} .d-flex`).append(`
                <div class="rounded-circle mr-3 details ${property}"
                  detailType="${property}"
                  detailValue = "${details[property][i]}"
                  data-toggle="tooltip" 
                  title="${details[property][i]}" 
                  style="background-color: ${details[property][i]}; width:30px; height: 30px; cursor:pointer; border:1px solid #bbb">
                </div>
              `);
            }else{
              $(`.details${index} .d-flex`).append(`
                <div class="py-2 px-3 mr-3 details ${property}"
                   detailType="${property}"
                   detailValue = "${details[property][i]}"
                   data-toggle="tooltip" 
                   title="${details[property][i]}" 
                   style="cursor:pointer; border:1px solid #bbb">${details[property][i]}</div>
              `);
            }
          }
        });
      }
      //Agregamos producto al localStorage
      $(document).on("click", ".details",function(this:any){

        //Senalar el detalle escogido
        let details = $(`.details.${$(this).attr("detailsType")}`);
        for(let i = 0; i< details.length; i++){
          $(details[i]).css({"border":" 1px solid #bbb"});
        }
        $(this).css({"border":"3px solid #bbb"})

        //Preguntar si existen detalles

        if(localStorage.getItem("details")){
          
          let details = JSON.parse(localStorage.getItem("details") || "{}");
          for(const i in details){
            details[i][$(this).attr("detailType")] = $(this).attr("detailValue");
            localStorage.setItem("details", JSON.stringify(details))
          }
        }else{
          localStorage.setItem("details",`[{"${$(this).attr("detailType")}" : "${$(this).attr("detailValue")}"}]`);
        }
      })
    }
  }

  callbackGallery(){
    if(this.renderGallery){
      this.renderGallery = false;
      SlickConfig.fnc();
      ProductLightbox.fnc();
      Tooltip.fnc();
    }
  }

   //Funcion para cargar la lista de deseo
   addWishList(product:any){
    this.usersService.addWishList(product);
  }

  //Funcion cambio de cantidad

  changeQuantity(quantity:any, unit: any, move:any){
    let number = 1;
    
    if(Number(quantity) > 9){
      quantity = 9;
    }

    if(Number(quantity) < 1){
      quantity = 1;
    }

    //Modificar cantidad deacuerdo a la direccion

    if(move == 'up' && Number(quantity) < 9){
      number = Number(quantity) + unit;
    }

    else if(move == 'down' && Number(quantity) > 1){
      number = Number(quantity) - unit;

    }else{
      number = Number(quantity);
    }
    $(".quantity input").val(quantity);
    this.quantity = number;
  }

  addShoppingCart(product:any, unit:any, details:any){

    //Preguntamos si details existe en el carrito de compras
    if(localStorage.getItem("details")){
      details = localStorage.getItem("details");
    }
    
    //Agregra productos al carrito de compras

    let url = this.router.url; //Capturasmos la url

    let item ={
      product: product,
      unit: this.quantity,
      details: details,
      url: url
    }

    localStorage.removeItem("details");

   this.usersService.addShoppingCart(item);

  }

}
