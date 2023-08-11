import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-jewellery-manufacturing',
  templateUrl: './jewellery-manufacturing.component.html',
  styleUrls: ['./jewellery-manufacturing.component.scss']
})
export class JewelleryManufacturingComponent implements OnInit {
  isNavbarCollapsed = true;
  isNavbarCollapsedSub = true;
  paramValue: string = '';
  queryParams: any;
  menuList: any;
  menuTitle: any = localStorage.getItem('userbranch');;
  subMenuList: any;
  branchCode: string = '';
  username: any = localStorage.getItem('username');
  uniqueCol: any;
  uniqueColsub: any;

  showJm = false;

  modalReference: any;
  closeResult: any;
  pageTitle: any;
  currentFilter: any;
  showFilterRow: boolean = false
  showHeaderFilter: boolean = false

  columnhead: any[] = ['Edit | View', 'Worker Code', 'Description', ''];

  constructor(private route: ActivatedRoute, public suntechApi: SuntechAPIService,
    private CommonService: CommonServiceService) {
    // this.menuList =  this.comFunc.menuList;
    // this.menuList = JSON.parse(localStorage.getItem('menuList'))
    // console.log('menuList', this.menuList);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((data: any) => {
      this.queryParams = data.modulename;
      this.menuTitle = data.modulename
      if (this.menuTitle.toLowerCase() == 'jewellery manufacturing')
        this.showJm = true;
    });

  }
}
