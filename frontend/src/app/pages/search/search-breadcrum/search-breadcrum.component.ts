import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-search-breadcrum',
  templateUrl: './search-breadcrum.component.html',
  styleUrls: ['./search-breadcrum.component.css']
})
export class SearchBreadcrumComponent implements OnInit {

  breadcrum: string = "";

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    //CAPTURAMOS EL PARAMETRO URL
    this.breadcrum = this.activatedRoute.snapshot.params["param"].replace(/[_]/g," ");
  }

}
