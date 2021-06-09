import { Component, OnInit } from '@angular/core';
import{Search} from '../../function'
import {CategoriesService} from '../../service/categories.service';
import {environment} from '../../../environments/environment';
import {SubCategoriesService} from '../../service/sub-categories.service';
import {UsersService} from '../../service/users.service';


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
  arrayTitleList: any[] = [];
  render: boolean = true;
  authValidate: boolean = false;
  picture: string = "";

  constructor(private categoriesService: CategoriesService,
              private subCategoriesService: SubCategoriesService,
              private usersService: UsersService) { 
  }

  ngOnInit(): void {
    /********VALIDAR SI EXISTE EL USUARIO  */
    this.usersService.authActivate().then(res=>{
      if(res){
        this.authValidate = true;
        this.usersService.getFilterData("idToken", localStorage.getItem("idToken")).subscribe((res:any)=>{
          
          for(const i in res){
            if(res[i].picture != undefined){
              if(res[i].method != "direct"){
                this.picture = `<img src = "${res[i].picture}" class = "img-fluid rounded-circle ml-auto">`
              }else{
                this.picture = `<img src = "assests/img/users/${res[i].username}/${res[i].picture}" class = "img-fluid rounded-circle ml-auto">`
              }
            }else{
              this.picture = `<i class="icon-user"></i>`;
            }
          }
        });
      }
    });
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