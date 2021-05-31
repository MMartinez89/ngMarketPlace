import { Component, OnInit, TestabilityRegistry } from '@angular/core';
import {ProductsService} from '../../../service/products.service';
import {ActivatedRoute} from '@angular/router';
import {DinamicReviews, DinamicRating, DinamicPrice, Rating, Pagination, Select2Cofig, Tabs} from '../../../function'
declare var Query:any;
declare var $:any;
@Component({
  selector: 'app-products-showcase',
  templateUrl: './products-showcase.component.html',
  styleUrls: ['./products-showcase.component.css']
})
export class ProductsShowcaseComponent implements OnInit {

  products:any[]=[];
  render: boolean = true;
  cargando: Boolean = false;
  rating: any[]=[];
  reviews: any[]=[];
  price: any[]=[];
  params:string = "";
  page:any;
  productFound: number = 0;
  currenRoute: string = "";
  totalPage: number = 0;
  sort:any;
  sortItems:any[] = [];
  sortValues: any[]=[];

  constructor(private productsService: ProductsService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.cargando = true;
    //CALCULAMOS  EL PARAATERO URL
    this.params = this.activatedRoute.snapshot.params["param"].split("&")[0];
    this.sort = this.activatedRoute.snapshot.params["param"].split("&")[1];
    this.page = this.activatedRoute.snapshot.params["param"].split("&")[2];

    //EVALUAMOS QUE EL SEGUNDO PARAMETRO SEA EL DE PAGINACION 
    if(Number.isInteger(Number(this.sort))){
      this.page = this.sort;
      this.sort = undefined;
    }
    //EVALUAMOS QUE EL PARAMATRO DE ORDEN NO ESTE DEFINIDO 
    if(this.sort == undefined){
      this.currenRoute = `products/${this.params}`;
    }else{
      this.currenRoute = `products/${this.params}&${this.sort}`;
    }

    

    this.productsService.getFilterData("category",this.params).subscribe((res:any)=>{
      if(Object.keys(res).length>0){
          this.producFnc(res);
      }else{
        this.productsService.getFilterData("sub_category", this.params).subscribe((res1:any)=>{
         this.producFnc(res1);
        });
      }
    });
  }

    //FUNCION PARA MOSTRAR LOS CATALAGOS DE PRODUCTOS
    producFnc(response:any){
      this.products=[];
      let getProducts:Array<any> = []
      let total = 0;
  
      for(let i in response){
        total ++;
        getProducts.push(response[i]);
      }
      this.productFound =  total;
      this.totalPage = Math.ceil(total/6);

      //ORDENAMOS EL ARREGLO DE PRODUCTOS DE LO MAS ACTUAL A LO MAS ANTIGUO
      if(this.sort == undefined || this.sort == "first"){
        getProducts.sort(function(a,b){
          return(b.date_created - a.date_created);
        });
        this.sortItems = [
          "Sort by first",
          "Sort by latest",
          "Sort by popularity",
          "Sort by price: low to high",
          "Sort by price: high to low"
        ];
        this.sortValues = [
          "first",
          "latest",
          "popularity",
          "high",
          "low"
        ];
      }
      //ORDENAMOS EL ARREGLO DE PRODUCTOS DE LO MAS ANTIGUO A LO MAS ACTUAL
      if(this.sort == "latest"){
       getProducts.sort(function(a,b){
        return(a.date_created - b.date_created);
       });
       this.sortItems = [
        "Sort by latest",
        "Sort by first",
        "Sort by popularity",
        "Sort by price: low to high",
        "Sort by price: high to low"
      ];
      this.sortValues = [
        "latest",
        "first",
        "popularity",
        "high",
        "low"
      ];
      }
      //ORDENAMOS EL ARREGLO DE PRODUCTOS MAS POPULARES
      if(this.sort == "popularity"){
        getProducts.sort(function(a,b){
         return(b.views -a.views);
        });
        this.sortItems = [
          "Sort by popularity",
          "Sort by First",
          "Sort by latest",
          "Sort by price: low to high",
          "Sort by price: high to low"
        ];
        this.sortValues = [
          "popularity",
          "first",
          "latest",
          "high",
          "low"
        ];
      }
      
      //ORDENAMOS EL ARREGLO DE PRODUCTOS DE MENOR PRECIO
      if(this.sort == "low"){
        getProducts.sort(function(a,b){
          return(a.price -b.price);
        });
        this.sortItems = [
          "Sort by price: low to high",
          "Sort by First",
          "Sort by latest",
          "Sort by popularity",
          "Sort by price: high to low"
        ];
        this.sortValues = [
          "low",
          "first",
          "latest",
          "popularity",
          "high"
        ];
      }

      //ORDENAMOS EL ARREGLO DE PRODUCTOS DE MAYOR PRECIO
      if(this.sort == "high"){
        getProducts.sort(function(a,b){
          return(b.price -a.price);
        });
        this.sortItems = [
          "Sort by price: high to low",
          "Sort by First",
          "Sort by latest",
          "Sort by popularity",
          "Sort by price: low to high",
        ];
        this.sortValues = [
          "high",
          "first",
          "latest",
          "popularity",
          "low"
        ];
      }
      
      //FILTRAMOS LOS MEJORES 6
      getProducts.forEach((product, index)=>{

        if(this.page == undefined){
          this.page = 1;
        }
        let first = Number(index) + (this.page*6) -6;
        let last:  Number = 6*this.page;
        if(first<last){
          if(getProducts[first] != undefined){
            this.products.push(getProducts[first]);
            this.rating.push(DinamicRating.fnc(getProducts[first]));
            this.reviews.push(DinamicReviews.fnc(this.rating[index]));
            this.price.push(DinamicPrice.fnc(getProducts[first]));
            this.cargando =  false;
          }  
        }
      });
    }

    callback(params:any){
      if(this.render){
        this.render = false;
        Rating.fnc();
        Pagination.fnc();
        Select2Cofig.fnc();
        Tabs.fnc();

        //CAPTURA DEL SELECT SORTITEM
        $(".sortItems").change(function(this:any){
          window.open(`products/${params}&${$(this).val()}`,"_top");
        });
      }
    }

}
