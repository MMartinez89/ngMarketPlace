import { Component, OnInit } from '@angular/core';
import {Search} from '../../function';
import {CategoriesService} from '../../service/categories.service';
import {environment} from '../../../environments/environment';
import {SubCategoriesService} from '../../service/sub-categories.service';

declare var JQuery:any;
declare var $:any;

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.css']
})
export class HeaderMobileComponent implements OnInit {

   fireBase:string =  environment.fireBase;
   categories: any;
   render:boolean = true;
   categoriesList:any[] = [];
  constructor(private categoriaService: CategoriesService,
              private subCategoriesService: SubCategoriesService) { }

  ngOnInit(): void {
    this.categoriaService.getData().subscribe((res:any)=>{
      //console.log("RESPUESTA", res);
      this.categories = res;
      for(let i in res){
        this.categoriesList.push(res[i].name);
      }
    });

    //ACTIVAMOS EL EFECTO TOOGLE //

    //$(document).on() trabaja cuando el DOM esta cargado 
    $(document).on("click", ".sub-toggle",function(this:any){
      //.parent()va al padre
      //.childer() va al hijo 
      $(this).parent().children('ul').toggle();  
    });
  }
  goSearch(search:String){

    if(search.length == 0 || Search.fnc(search) == undefined){
      return
    }
    window.open(`search/${Search.fnc(search)}`, '_top');
  }
  callback(){
    if(this.render){
      this.render=false;
      let arraySubcategories:Array<any> = [];
      //Separar las categorias
     this.categoriesList.forEach(category=>{
        this.subCategoriesService.getFilterData("category", category).subscribe((res:any)=>{
          //hacemos un recorrido por la coleccion general de subcategories y calificamos 
          //deacuerdo a la categoria que corresponda
          for(let i in res){
           arraySubcategories.push(
             {
            "category": res[i].category,  
            "subCategory": res[i].name,
            "url": res[i].url,
             }
           );
          }
          //recorremos el array de objetos nuevos para buscar coincidencias con los nombres de categorias
          for(let f in arraySubcategories){
            if(category == arraySubcategories[f].category){

              $(`[category='${category}']`).append(
                    `
              <li class="current-menu-item ">
                <a href="products/${arraySubcategories[f].url}">${arraySubcategories[f].category}"></a>
              </li>
              `
              );
          
            }
          }
        });
     });
    }
  }

}
