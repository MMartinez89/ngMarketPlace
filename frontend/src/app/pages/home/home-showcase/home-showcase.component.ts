import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { CategoriesService } from '../../../service/categories.service';
import { SubCategoriesService } from '../../../service/sub-categories.service';
import { ProductsService } from '../../../service/products.service';
import {OwlCarouselConfig,Rating} from '../../../function'
declare var $: any;
declare var JQuery: any;

@Component({
  selector: 'app-home-showcase',
  templateUrl: './home-showcase.component.html',
  styleUrls: ['./home-showcase.component.css'],
})
export class HomeShowcaseComponent implements OnInit {
  categories: Array<any> = [];
  cargando: boolean = false;
  render: boolean = true;
  constructor(
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.cargando = true;
    let getCategories: Array<any> = [];
    this.categoriesService.getData().subscribe((res: any) => {
      for (let i in res) {
        getCategories.push(res[i]);
      }
      //ORDENAR DE MAYOR A MENOR
      getCategories.sort(function (a, b) {
        return b.view - a.view;
      });
      //FILTRAMOS HASTA 6 CATEGORIAS
      getCategories.forEach((categories, index) => {
        if (index < 6) {
          this.categories[index] = getCategories[index];
          this.cargando = false;
        }
      });
    });
  }

  callback(indexes:any) {
    if (this.render) {
      this.render = false;
      let getArraySubcategories: Array<any> = [];
      let arrayProducts: Array<any> = [];
      let preloadSV = 0;
      //SEPARAR CATEGORIAS
      this.categories.forEach((category,index) => {
        //TOMAMOS EL NOMBRE DE LAS SUBCATEGORIAS FILTRANDO CON EL NOMBRE DE CATEGORIAS
        this.subCategoriesService
          .getFilterData('category', category.name)
          .subscribe((res: any) => {
            for (let i in res) {
              getArraySubcategories.push({
                category: res[i].category,
                subcategory: res[i].name,
                url: res[i].url,
              });
            }
            //RECORREMOS EL GETARRAYSUBCATEGORIES PARA BUSCAR COINCIDEINCIAS CON LOS NOMBRES DE CATEGORIAS
            for (let i in getArraySubcategories) {
              if (category.name === getArraySubcategories[i].category) {
                $(`[category-showcase = '${category.name}']`).append(`
                <li><a href='products/${getArraySubcategories[i].url}'>${getArraySubcategories[i].subcategory}</a><\li>
              `);
              }
            }
          });
        //FILTRAMOS LOS PRIDUCTOS CON LA URL DE CATEGORIAS
        this.productsService
          .getFilterDataWithLimit('category', category.url, 6)
          .subscribe((res: any) => {
            //console.log(res)
            for (let i in res) {
              //console.log("ijlk", res[i].offer)
              arrayProducts.push({
                category: res[i].category,
                url: res[i].url,
                name: res[i].name,
                image: res[i].image,
                price: res[i].price,
                offer: res[i].offer,
                reviews: res[i].reviews,
                stock: res[i].stock,
                vertical_slider: res[i].vertical_slider,
              });
            }
           
            //RECORREMOS EL ARRAY PARA BUSCAR COINCIDENCIAS CON LAS CATEGORIAS
            for (let i in arrayProducts) {
              if (category.url == arrayProducts[i].category) {
                //DEFINIMOS SI EL PRECIO TIENE OFERTA O NO 
                let price;
                let type;
                let value;
                let offer;
                let disccount;
                let offerDate;
                let today = new Date();


                if(arrayProducts[i].offer = !""){
                  offerDate = new Date(
                   // parseInt(JSON.parse(arrayProducts[i].offer)[2].split("-")[0]),
                   // parseInt(JSON.parse(arrayProducts[i].offer)[2].split("-")[1])-1,
                   // parseInt(JSON.parse(arrayProducts[i].offer)[2].split("-")[2])
                  )
                   if(today<offerDate){
                     //console.log(arrayProducts[i].offer )
                    type =  JSON.parse(arrayProducts[i].offer)[0];
                    //console.log("type",type);
                    value =  JSON.parse(arrayProducts[i].offer)[1];
                    //console.log("value",value)
                    if(type ==  "Disccount"){ 
                     offer = (arrayProducts[i].price- (arrayProducts[i].price * value/100)).toFixed(2)

                    }
                   if(type == "Fixed"){
                      offer = (value).toFixed(2);
                     value = Math.round(offer*100/arrayProducts[i].price);
                    }
                    disccount = `<div class="ps-product__badge">-${value}%</div>`;
                    price = ` <p class="ps-product__price sale">$${offer}<del>$${arrayProducts[i].price}</del></p>`;
                   }else{
                    disccount = '';
                    price = ` <p class="ps-product__price">$${arrayProducts[i].price}</p>`;
                   } 
                }else{
                  disccount = '';
                  price = ` <p class="ps-product__price">$${arrayProducts[i].price}</p>`;
                }

                //CALCULOS EL TOTAL DEL LAS RESENAS 

                let totalReview = 0;

                for(let f = 0; f < JSON.parse(arrayProducts[i].reviews).length; f++){
                  totalReview += Number(JSON.parse(arrayProducts[i].reviews)[f]["review"])
                }

                //IMPRIMIMOS EL TOTAL DE LAS CALIFICACCIONES DE CADA PRODUCTO

                let rating = Math.round(totalReview/JSON.parse(arrayProducts[i].reviews).length);

                //DEFINIMOS SI EL PRODUCTO TIENE STOCK
                if(arrayProducts[i].stock== 0 ){
                  disccount = `<div class="ps-product__badge out-stock">Out Of Stock</div>`;
                }
                

                //IMPRIMIMOS EN EL HTML LOS PRODUCTOS 

                $(`[category-pb = '${arrayProducts[i].category}']`)
                  .append(`
                    <div class="ps-product ps-product--simple" >
                      <div class="ps-product__thumbnail">
                        <a href="products/${arrayProducts[i].url}">
                          <img src="assets/img/products/${arrayProducts[i].category}/${arrayProducts[i].image}" alt="" />
                       </a>
                        ${disccount}
                      
                    </div>

                    <div class="ps-product__container">
                      <div class="ps-product__content" data-mh="clothing">
                         <a class="ps-product__title" href="products/${arrayProducts[i].url}">${arrayProducts[i].name}</a>

                    <div class="ps-product__rating">
                      <select class="ps-rating productRating" data-read-only="true">
                      
                      

                      </select>
                      <span>${rating}</span>
                      
                    </div>
                ${price}

               </div>
              </div>
            </div> `);
            //CALIFICAMOS LA CANTIDAD DE ESTRELLAS SEGUN LA PUNTUACION 
               let arrayRating = $(".productRating");
                for(let i = 0; i<arrayRating.length; i++){
                  for(let f = 0; f<=5; f++){
                    $(arrayRating[i]).append(`
                      <option value="2">${f}</option>
                    `);
                    if(rating == f){
                      $(arrayRating[i]).children('option').val(1);
                    }
                  }
                 
                }

                Rating.fnc();

                //IMPRIMIMOS LOS PRODUCTOS EN EL VERTICAL SLIDER
                  $(`[category-sl = "${arrayProducts[i].category}"]`).append(`
                  <a href="products/${arrayProducts[i].url}">
                  <img src="assets/img/products/${arrayProducts[i].category}/vertical/${arrayProducts[i].vertical_slider}" alt="" />
                </a>
                `);
                //DISPARA EL PLUGIN
                preloadSV ++;
                if(preloadSV == (indexes+1)*6){
                  $(`[category-sl`).addClass('ps-carousel--product-box');
                  $(`[category-sl`).addClass('owl-slider');
                  $(`[category-sl`).owlCarousel({
                    items:1,
                    autoplay:true,
                    autoplayTimeout:7000,
                    loop:true,
                    nav:true, 
                    margin:0,
                    dots:true,
                    navSpeed:500,
                    dotsSpeed:500,
                    dragEndSpeed:500,
                    navText:["<i class='icon-chevron-left'></i>", "<i class='icon-chevron-right'></i>"]
                  });
                }
                
                //OwlCarouselConfig.fnc(); 
              }
            }
          });
      });
    }
  }
}
