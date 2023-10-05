import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-operationals',
  templateUrl: './operationals.component.html',
  styleUrls: ['./operationals.component.scss']
})
export class OperationalsComponent implements OnInit {
  //variables
  menuList: any[] = [];
  isLoading: boolean = false;

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
