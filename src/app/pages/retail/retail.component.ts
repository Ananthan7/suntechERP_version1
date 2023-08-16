import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-retail',
  templateUrl: './retail.component.html',
  styleUrls: ['./retail.component.scss']
})
export class RetailComponent implements OnInit {
  menuTitle: any;
  constructor(
    public dataService: SuntechAPIService,
    private CommonService: CommonServiceService
  ) {
  }

  ngOnInit(): void {
    //use: to get menu title from queryparams
    this.menuTitle = this.CommonService.getTitleName()
  }

}
