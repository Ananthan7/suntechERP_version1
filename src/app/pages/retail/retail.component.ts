import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { JewelleryAssemblingMasterComponent } from './retail-master/jewellery-assembling-master/jewellery-assembling-master.component';

@Component({
  selector: 'app-retail',
  templateUrl: './retail.component.html',
  styleUrls: ['./retail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RetailComponent implements OnInit {

  componentList:Record<string, any>  = {
    JewelleryAssemblingMasterComponent: JewelleryAssemblingMasterComponent,
  };
  menuTitle: any;
  constructor(
    private modalService: NgbModal,
    public dataService: SuntechAPIService,
    private CommonService: CommonServiceService,
    private ChangeDetector: ChangeDetectorRef //to detect changes in dom
  ) {
  }

  ngOnInit(): void {
    //use: to get menu title from queryparams
    this.menuTitle = this.CommonService.getTitleName()
  }
  menuClicked(event:any){
    this.menuTitle = event.MENU_MODULE
  }

  

}
