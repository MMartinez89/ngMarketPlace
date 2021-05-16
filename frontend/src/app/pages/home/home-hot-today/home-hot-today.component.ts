import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ProductsService } from '../../../service/products.service';
import {SalesService} from '../../../service/sales.service';
import {
  OwlCarouselConfig,
  CarouselNavigation,
  SlickConfig,
  ProductLightbox,
  CountDown,
  Rating,
  ProgressBar 
} from '../../../function';

declare var JQuery: any;
declare var $: any;

@Component({
  selector: 'app-home-hot-today',
  templateUrl: './home-hot-today.component.html',
  styleUrls: ['./home-hot-today.component.css'],
})
export class HomeHotTodayComponent implements OnInit {
  products: Array<any> = [];
  indexes: Array<any> = [];
  render: boolean = true;
  cargando: boolean = false;
  topSales: Array<any> = [];
  topSalesBlock : Array<any>=[];
  renderBestSeller: boolean = true;

  constructor(private productsSerice: ProductsService, private saleService: SalesService) {}

  ngOnInit(): void {
    this.cargando = true;
    let getProducts: Array<any> = [];
    let hoy = new Date();
    let fechaOferta = null;

    //TOMAMOS LA DATA DE LOS PRODUCTOS
    this.productsSerice.getData().subscribe((res: any) => {
      for (let i in res) {
        getProducts.push({
          offer: JSON.parse(res[i].offer),
          stock: res[i].stock,
        });
        this.products.push(res[i]);
      }
      //RECORREMOS CADAOFERTA Y STOCK PARA CALIFICAR LAS OFERTAS ACTUALES Y CUANTO TENEMOS EN STOCK
      for (let f in getProducts) {
        fechaOferta = new Date(
          //.split("-")separa todo lo que esta despues del gion y lo combierte en arra 2020-03-03 = [2020,03,03]
          parseInt(getProducts[f]['offer'][2].split('-')[0]),
          parseInt(getProducts[f]['offer'][2].split('-')[1]) - 1, //para tomar el mes se le resta una unidad en JS
          parseInt(getProducts[f]['offer'][2].split('-')[2])
        );
        if (hoy < fechaOferta && getProducts[f]['stock'] > 0) {
          this.indexes.push(f);
          this.cargando = false;
        }
      }
    });
    //TOMAMOS LAS DATA DE LAS VENTAS  
    let getSales:Array<any> = []
    this.saleService.getData().subscribe((res:any)=>{
      for(let i in res){
        getSales.push({
          "product": res[i].product,
          "quantity": res[i].quantity,
        });
      }
      //ORDENAMOS DE MAYOR A MENOR EL ARRAY DE OBJETOS 
      getSales.sort(function(a,b){
        return(b.quantity - a.quantity);
      })
      //SACAMOS LOS PRODUCTOS REPETIDOS DEJANDO LOS DE MAYOR VENTA 
      let filterSales: Array<any>= [];
      getSales.forEach( sales => {
        if(!filterSales.find(res=> res.product == sales.product)){
          const {product, quantity} = sales;
          filterSales.push({product, quantity});
        }
      });
      //Filtramos la data de productobuscando coincidencia con las vemtas 
      let block = 0;
      filterSales.forEach((sale,index)=>{
        //FILTRAMOS LAS MEJORES20
        if(index < 20){
          block ++;
          this.productsSerice.getFilterData("name", sale.product).subscribe((res:any)=>{
            //console.log(sale.product)
           //console.log("res",res)
            for(let i in res){
              this.topSales.push(res[i]);
            }
          });
        }
      });
      for(let i =0; i < Math.round(block/4); i ++){
        this.topSalesBlock.push(i);
      }
    });
  }

  callback() {
    if (this.render) {
      this.render = false;
      //SELECCIONAMOS DEL DOM LOS ELEMENTOS DE LA GALERIA MIXTA
      let galleryMix_1 = $('.galleryMix_1');
      let galleryMix_2 = $('.galleryMix_2');
      let galleryMix_3 = $('.galleryMix_3');

      //SELECCIONAR LOS ELEMENTOS DE LAS OFERTAS

      let offer_1 = $('.offer_1');
      let offer_2 = $('.offer_2');
      let offer_3 = $('.offer_3');

      //SELECCIONAMOS DEL DOM LOS ELEMENTOS DE LA RESENA
      let review_1 = $('.review_1');
      let review_2 = $('.review_2');
      let review_3 = $('.review_3');

      //RECORREMOS TODOS LOS INDICES DE PRODUCTOS
      for (let i = 0; i < galleryMix_1.length; i++) {
        //RECORRREMOS TODAS LAS FOTOS DE GALERIA DE CADA PRODUCTO
        for (let j = 0;j < JSON.parse($(galleryMix_1[i]).attr('gallery')).length;j++) {
          //AGREGAR IMAGENES GRANDES
          $(galleryMix_2[i]).append(`
          <div class="item">
               <a href="assets/img/products/${$(galleryMix_1[i]).attr('category')}/gallery/${JSON.parse($(galleryMix_1[i]).attr('gallery'))[j]}">
                <img src="assets/img/products/${$(galleryMix_1[i]).attr(
                  'category'
                )}/gallery/${
            JSON.parse($(galleryMix_1[i]).attr('gallery'))[j]
          }" alt="" />
            </a>
          </div>
          `);
          //AGREGAR LAS IMAGENES PEQUENAS
          $(galleryMix_3[i]).append(`
          <div class="item">
            <img src="assets/img/products/${$(galleryMix_1[i]).attr(
              'category'
            )}/gallery/${JSON.parse($(galleryMix_1[i]).attr('gallery'))[j]}" />
          </div>
          `);
        }

        let offer = JSON.parse($(offer_1[i]).attr('offer'));
        //CAPTURAMOS EL PRECIO A CADA PRODUCTO
        let price = JSON.parse($(offer_1[i]).attr('price'));
        //preguntamos si hay descuento
        let result: any = (price * offer[1]) / 100;
        if (offer[0] == 'Disccount') {
          $(offer_1[i]).html(`
        <span>Save <br/>$${result.toFixed(2)}</span>
        `);
          $(offer_2[i]).html((price - result).toFixed(2));
        }
        if (offer[0] == 'Fixed') {
          $(offer_1[i]).html(`
        <span>Save <br/>$${(price - offer[1]).toFixed(2)}</span>
        `);
          $(offer_2[i]).html(`$${offer[1]}`);
        }
        //Agregamos  la fecha al descontador
        $(offer_3[i]).attr(
          'data-time',
          new Date(
            parseInt(offer[2].split('-')[0]),
            parseInt(offer[2].split('-')[1]) - 1,
            parseInt(offer[2].split('-')[2])
          )
        );
        //CALCULAMOS EL TOTAL DE CALIFICACIONES DE UNA RESENA 
        let totalReview = 0;
        for (let j = 0;j < JSON.parse($(review_1[i]).attr('reviews')).length;j++){
          totalReview = Number(JSON.parse($(review_1[i]).attr('reviews'))[j]["review"]);
        }
        //IMPRIMOS EL TOTAL DE LAS CALIFICACIONES PARA CADA PRODUCTO
        let rating = Math.round((totalReview/JSON.parse($(review_1[i]).attr('reviews')).length)*10);
        $(review_3[i]).html(rating);

        for(let r = 1; r<=5; r++){
          $(review_2[i]).append(
            `<option value="2">${r}</option>`
          );
          if(rating == r){
            $(review_2[i]).children("option").val(1);
          }
        }
       
      }
      OwlCarouselConfig.fnc();
      CarouselNavigation.fnc();
      SlickConfig.fnc();
      ProductLightbox.fnc();
      CountDown.fnc();
      Rating.fnc();
      ProgressBar.fnc();

    }
  }

  callbackBestSeller(topSales: any){
    if(this.renderBestSeller){
      //console.log(topSales)
      this.renderBestSeller =  false;
     //CAPTURESMOS LA CANTIDAD DE BLOQUE QUE EXISTE EN EL DOM
     let topSaleBlock = $(".topSaleBlock");
     let top20Array: Array<any>= [];
     //ejecutamos un setTimeUp un segundo de espera por cada bloque 
     setTimeout(function(){
      $(".preload").remove();
      for(let i =0; i<topSaleBlock.length; i++){
        //AGRUPAMOS 4 PRODUCTO POR BLOQUE
        top20Array.push(
          topSales.slice(i*topSaleBlock.length, (i*topSaleBlock.length)+topSaleBlock.length)
        );
        //HACEMOS UN RECORRIDO POR TOP20ARRAY
        for(let j in top20Array[i]){
          //DEFINIMOS SI EL PRECIO DEL PRODUCTO TIENE OFERTA O NO 
          let price;
          let type;
          let value;
          let offer;
          let offerDate;
          let today = new Date();
          if(top20Array[i][j].offer = !""){
            //console.log( parseInt(JSON.parse(top20Array[i][j].offer)[2].split("-")[0])
            offerDate = new Date(
              //parseInt(JSON.parse(top20Array[i][j].offer)[2].split("-")[0]),
              //parseInt(JSON.parse(top20Array[i][j].offer)[2].split("-")[1])-1,
              //parseInt(JSON.parse(top20Array[i][j].offer)[2].split("-")[2])
            )
            if(today < offerDate){
              type = JSON.parse(top20Array[i][j].offer)[0];
              value = JSON.parse(top20Array[i][j].offer)[1];
          

              if(type == "Disccount"){
                offer = (top20Array[i][j].price - (top20Array[i][j].price * value/100)).toFixed(2);
              }
              if(type == "Fixed"){
                offer = (value).toFixed(2);
              }
         

              price = ` <p class="ps-product__price sale">${offer}<del>$${top20Array[i][j].price}</del></p>`;
            }else{
              price = ` <p class="ps-product__price">$${top20Array[i][j].price}</p>`;
            }

            
          }else{
            price = ` <p class="ps-product__price">$${top20Array[i][j].price}</p>`;
          }
          $(topSaleBlock[i]).append(`
          
          <div class="ps-product--horizontal">
          <div class="ps-product__thumbnail">
            <a href="product/${top20Array[i][j].url}">
              <img src="assets/img/products/${top20Array[i][j].category}/${top20Array[i][j].image}" />
            </a>
          </div>

          <div class="ps-product__content">
            <a class="ps-product__title" href="product/${top20Array[i][j].url}"
              >${top20Array[i][j].name}</a
            >
            ${price}
          </div>
        </div>
          `);
        }
       }
       
     //MODIFICAMOS EL ESTILO DE PLUGINS OWL CAROSEL
     $(".owl-dots").css({"bottom":"0"});
     $(".owl-dot").css({"background":"#ddd"});
     },topSaleBlock.length*1000);
     
    
     
    }
  }
}
