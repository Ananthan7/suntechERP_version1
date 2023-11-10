import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-jewellery-manufacturing',
  templateUrl: './jewellery-manufacturing.component.html',
  styleUrls: ['./jewellery-manufacturing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JewelleryManufacturingComponent implements OnInit {
  menuTitle: any;
  branchCode: any;
  constructor(
    public dataService: SuntechAPIService,
    private CommonService: CommonServiceService,
    private ChangeDetector: ChangeDetectorRef
  ) {
  }
  data: any;
  dataPie: any;

  options: any;

  ngOnInit(): void {
    //use: to get menu title from queryparams
    this.menuTitle = this.CommonService.getTitleName()

  }

  menuClicked(event: any) {
    this.menuTitle = event.MENU_MODULE
  }
}
