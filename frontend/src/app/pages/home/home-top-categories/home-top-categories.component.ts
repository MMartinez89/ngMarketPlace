import { Component, OnInit } from '@angular/core';
import {CategoriesService} from '../../../service/categories.service';

@Component({
  selector: 'app-home-top-categories',
  templateUrl: './home-top-categories.component.html',
  styleUrls: ['./home-top-categories.component.css']
})
export class HomeTopCategoriesComponent implements OnInit {

  categories:Array<any>=[]
  cargando:boolean = false;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    //TOMAMOS LA DATA DE CATEGORIA 
    this.cargando = true;
    let getCategories: Array<any> = [];
    this.categoriesService.getData().subscribe((res:any)=>{
      for(let i in res){
        getCategories.push(res[i]);
      }
      //ORDENAR DE MAYOR VISTA A MENOR VISTA
      getCategories.sort(function(a,b){
        return (b.view - a.view)
      })
      //console.log("res", getCategories)

      //FILTRAMOS HASTA 6 CATAGORIAS
      getCategories.forEach((categories, index)=>{
        if (index<6){
          this.categories[index] = getCategories[index];
          this.cargando = false;
        }
      })
    })
  }

}
