import { Component, OnInit } from '@angular/core';
import {CategoriesService} from '../../service/categories.service';
import {SubCategoriesService} from '../../service/sub-categories.service';

declare var JQuery:any;
declare var $:any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  categoriesList:Array<any>=[]
  categories:any;
  render: boolean =  true;
  constructor(private categoriesService: CategoriesService,
              private subCategoriesService: SubCategoriesService) { }

  ngOnInit(): void {
    this.categoriesService.getData().subscribe((res:any)=>{
      this.categories =  res;
      for(let i in res){
        this.categoriesList.push(res[i].name);
      }

    });
  }

  callback(){
    if(this.render){
      this.render = false;
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

              $(`[category-footer='${category}']`).after(
              `
                <a href="products/${arraySubcategories[f].url}">${arraySubcategories[f].category}"></a>
              `
              );
          
            }
          }
        });
     });
    }
  }

}
