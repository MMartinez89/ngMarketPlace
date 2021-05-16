import { Component, OnInit } from '@angular/core';
import{Search} from '../../function'
import {CategoriesService} from '../../service/categories.service';
import {environment} from '../../../environments/environment';
import {SubCategoriesService} from '../../service/sub-categories.service'

declare var JQuery: any;
declare var $:  any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  //path:string = Path.url;
  fireBase: string = environment.fireBase;
  categories: any;
  arrayTitleList: Array<any> = [];
  render: boolean = true;

  constructor(private categoriesService: CategoriesService,
              private subCategoriesService: SubCategoriesService) { 
  }

  ngOnInit(): void {
    /* TOMAMOS LA DATA DE LA CATEGORIA  */
    this.categoriesService.getData().subscribe((res:any)=>{
      this.categories =  res;

      //recorremos la coleccion de categorias para tomar la lista de titulos 

      let i;
      for(i in res){
        this.arrayTitleList.push(JSON.parse(res[i].title_list));
        //console.log("RESPUESTA", this.arrayTitleList);
      }
    });
  }

  goSearch(search:String){
    if(search.length == 0 || Search.fnc(search)== undefined){
      return
    }

    window.open(`search/${Search.fnc(search)}`, '_top');
  }
  callback(){
    if(this.render){
      this.render = false;
      let arraySubcategories:Array<any> = [];

      //console.log("RENDER", this.render);
      this.arrayTitleList.forEach(titleList =>{
        //console.log("TITLE LIST", titleList);
        //let i;
        for(let i=0;i < titleList.length; i++){
          //console.log("RESPUESTA", titleList[i]);
          this.subCategoriesService.getFilterData("title_list", titleList[i]).subscribe((res:any)=>{
          //console.log("Respuesta",res);
           arraySubcategories.push(res);

           let arrayTitleName:Array<any> = [];
           for(let f in arraySubcategories){
           // console.log("RESPUESTA", arraySubcategories[f]);
            for(let g in arraySubcategories[f]){
              arrayTitleName.push(
                {
                  "titleList": arraySubcategories[f][g].title_list,  
                  "subCategory": arraySubcategories[f][g].name,
                  "url": arraySubcategories[f][g].url,
                }
              );
            }
           }
           for(let f in arrayTitleName){
            if(titleList[i] == arrayTitleName[f].titleList){
              //console.log("titleList [i]", titleList[i]);
              //console.log("arrayTitleName[f].subCategory", arrayTitleName[f].subCategory);
              $(`[titleList='${titleList[i]}']`).append(
                `
                <li>
                  <a href="products/${arrayTitleName[f].url}">${arrayTitleName[f].subCategory}</a>
                </li>
                `
              );
            }
           }
           //console.log("res", arrayTitleName);
          });
        }
      });
    }
  }

}