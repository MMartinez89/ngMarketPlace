import { Component, OnInit, Input, ComponentFactoryResolver } from '@angular/core';
import {Rating, DinamicPrice,DinamicRating,DinamicReviews} from '../../../../function';

declare var JQuery: any;
declare var $:any;

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  @Input() childItem: any;
  constructor() { }
  rating: Array<any>=[];
  reviews: Array<any>= [];
  totalReviews: string = "";
  itemsReview:Array<any>=[];
  render:boolean = true;
  ngOnInit(): void {

    //RATING
    this.rating.push(DinamicRating.fnc(this.childItem));
    this.reviews.push(DinamicReviews.fnc(this.rating[0]));
    for(let i=0; i<5; i++){
      $(".reviewsOption").append(`
        <option value="${this.reviews[0][i]}">${i+1}</option>
      `);
    }
    Rating.fnc();
    //TOTAL REVIEWS
    this.totalReviews = JSON.parse(this.childItem["reviews"]).length;
    //START BLOCK
    let arrayReview:Array<any> =[];
    JSON.parse(this.childItem["reviews"]).forEach((rew:any)=>{
      arrayReview.push(rew.review);
    });
    //ORDENAMOS EL ARRAY DE MENOR A MAYOR
    arrayReview.sort();
    let objectStart:any={
      "1":0,
      "2":0,
      "3":0,
      "4":0,
      "5":0
    }
    //IDENTIFICAMOS QUE VALOR SE REPITE Y CUAL NO
    arrayReview.forEach((value,index, arr)=>{
      //TOMAMOS DEL ARRAY DE OBJETO EL PRIMER INDICE DE CADA VALOR
      let first_index =  arr.indexOf(value);
      //TOMAMOS DEL ARRAY DE OBJETOS EL ULTIMO INDECI DE CADA VALOR 
      let last_index =  arr.lastIndexOf(value);

      if(first_index !== last_index){
        objectStart[value] +=1;
      }else{
        objectStart[value] +=1;
      }
    })
    for(let i = 5; i>0; i--){
      let startPercentage = Math.round((objectStart[i]*100)/arrayReview.length);
      $(".ps-block--average-rating").append(`
        <div class="ps-block__star">
          <span>${i}</span>

          <div class="ps-progress" data-value="${startPercentage}">
           <span></span>
          </div>

          <span>${startPercentage}</span>
        </div>
      `);
    }
    //ENVIAMOS A LA VISTA LA RESENA DEL PRODUCTO
    this.itemsReview.push(JSON.parse(this.childItem["reviews"]));
  }

  callback(){
    if(this.render){
      this.render = false;
      let reviews = $("[reviews]")
      for(let i=0; i< reviews.length; i++){
        for(let r=0; r<5; r++){
          $(reviews[i]).append(`
            <option value="2">${r+1}</option>
          `);
          if($(reviews[i]).attr("reviews") == (r+1)){
            $(reviews[i]).children("option").val(1);
          }
        }
      }
      
      Rating.fnc();
    }
  }



}
