import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ActivatedRoute } from '@angular/router';
import { MasterGridComponent } from 'src/app/shared/common/master-grid/master-grid.component';
import { CostCentreMetalComponent } from './cost-centre-metal/cost-centre-metal.component';
import { CostcentreMagkingchargesComponent } from './costcentre-magkingcharges/costcentre-magkingcharges.component';
import { ColorStoneMasterComponent } from './color-stone-master/color-stone-master.component';
import { ComponentSizeMasterComponent } from './component-size-master/component-size-master.component';
import { ComponentSizeSetComponent } from './component-size-set/component-size-set.component';
import { ConsumableMasterComponent } from './consumable-master/consumable-master.component';
import { CostcentreConsumableComponent } from './costcentre-consumable/costcentre-consumable.component';
import { DesignMasterComponent } from './design-master/design-master.component';
import { DiamondPrefixMasterComponent } from './diamond-prefix-master/diamond-prefix-master.component';
import { KaratMasterComponent } from './karat-master/karat-master.component';
import { LooseStoneMasterComponent } from './loose-stone-master/loose-stone-master.component';
import { ManufacturedItemsComponent } from './manufactured-items/manufactured-items.component';
import { MetalDivisionMasterComponent } from './metal-division-master/metal-division-master.component';
import { MetalPrefixMasterComponent } from './metal-prefix-master/metal-prefix-master.component';
import { MetalStockMasterComponent } from './metal-stock-master/metal-stock-master.component';
import { RateTypeComponent } from './rate-type/rate-type.component';
import { WatchMasterComponent } from './watch-master/watch-master.component';
import { CustomerPricingMasterComponent } from './customer-pricing-master/customer-pricing-master.component';
import { CustomerPriceSettingComponent } from './customer-price-setting/customer-price-setting.component';
import { CostCentreDiamondComponent } from './cost-centre-diamond/cost-centre-diamond.component';
import { PriceschemesMasterComponent } from './priceschemes-master/priceschemes-master.component';
import { OunceRateMasterComponent } from './ounce-rate-master/ounce-rate-master.component';
import { AuthCheckerComponent } from 'src/app/shared/common/auth-checker/auth-checker.component';

@Component({
  selector: 'app-wholesale-master',
  templateUrl: './wholesale-master.component.html',
  styleUrls: ['./wholesale-master.component.scss']
})
export class WholesaleMasterComponent implements OnInit {
  @ViewChild(MasterGridComponent) masterGridComponent?: MasterGridComponent;
  @ViewChild(AuthCheckerComponent) authCheckerComponent?: AuthCheckerComponent;

  //variables
  menuTitle: any
  componentName: any
  PERMISSIONS: any
  tableName: any
  apiCtrl: any
  dataToEdit: any
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  //subscription variable
  subscriptions$!: Subscription;

  private componentDbList: any = {
    'CostCentreMetalComponent': CostCentreMetalComponent,
    'CostcentreMagkingchargesComponent': CostcentreMagkingchargesComponent,
    'ColorStoneMasterComponent': ColorStoneMasterComponent,
    'ComponentSizeMasterComponent': ComponentSizeMasterComponent,
    'ConsumableMasterComponent': ConsumableMasterComponent,
    'DesignMasterComponent': DesignMasterComponent,
    'CostcentreConsumableComponent': CostcentreConsumableComponent,
    'DiamondPrefixMasterComponent': DiamondPrefixMasterComponent,
    'KaratMasterComponent': KaratMasterComponent,
    'LooseStoneMasterComponent': LooseStoneMasterComponent,
    'ManufacturedItemsComponent': ManufacturedItemsComponent,
    'MetalDivisionMasterComponent': MetalDivisionMasterComponent,
    'MetalPrefixMasterComponent': MetalPrefixMasterComponent,
    'MetalStockMasterComponent': MetalStockMasterComponent,
    'RateTypeComponent': RateTypeComponent,
    'WatchMasterComponent': WatchMasterComponent,
    'CustomerPriceSettingComponent': CustomerPriceSettingComponent,
    'CustomerPricingMasterComponent': CustomerPricingMasterComponent,
    'CostCentreDiamondComponent': CostCentreDiamondComponent,
    'PriceschemesMasterComponent': PriceschemesMasterComponent,
    'ComponentSizeSetComponent': ComponentSizeSetComponent,
    'OunceRateMasterComponent': OunceRateMasterComponent,

    /*add components here and update in form component name menu updation in operationals */
  }
  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    // private ChangeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    this.viewRowDetails = this.viewRowDetails.bind(this);
    this.editRowDetails = this.editRowDetails.bind(this);
  }

  ngOnInit(): void {
    /**USE: to get table data from API */
    this.menuTitle = this.CommonService.getModuleName()
    this.componentName = this.CommonService.getFormComponentName()
  }

  viewRowDetails(e: any) {
    this.dataToEdit = e.row.data;
    this.dataToEdit.FLAG = 'VIEW'
    this.openModalView(this.dataToEdit)
  }
  editRowDetails(e: any) {
    this.dataToEdit = e.row.data;
    this.dataToEdit.FLAG = 'EDIT'
    // this.openModalView(this.dataToEdit)
    this.authCheckerComponent?.openAuthModal();
  }
  deleteBtnClicked(e: any) {
    this.dataToEdit = e.row.data;
    this.dataToEdit.FLAG = 'DELETE'
    // this.openModalView(this.dataToEdit)
    this.authCheckerComponent?.openAuthModal();
  }
  authSubmit(){
    this.openModalView(this.dataToEdit)
  }
  //  open Jobcard in modal
  openModalView(data?: any) {
    let contents
    if (this.componentDbList[this.componentName]) {
      contents = this.componentDbList[this.componentName]
    } else {
      this.snackBar.open('Module Not Created', 'Close', {
        duration: 3000,
      });
    }
    const modalRef: NgbModalRef = this.modalService.open(contents, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.result.then((result) => {
      if (result === 'reloadMainGrid') {
        this.tableName = this.CommonService.getqueryParamTable()
        this.getMasterGridData({ HEADER_TABLE: this.tableName })
      }
    }, (reason) => {
      // Handle modal dismissal (if needed)
    });
    modalRef.componentInstance.content = data;
  }

  /**USE: to get table data from API */
  getMasterGridData(data?: any) {
    if (data) {
      if (data.MENU_CAPTION_ENG) {
        this.menuTitle = data.MENU_CAPTION_ENG;
      } else {
        this.menuTitle = this.CommonService.getModuleName()
      }
      if (data.ANG_WEB_FORM_NAME) {
        this.componentName = data.ANG_WEB_FORM_NAME;
      } else {
        this.componentName = this.CommonService.getFormComponentName()
      }
      this.PERMISSIONS = data.PERMISSION;
      // this.menuTitle = data.MENU_CAPTION_ENG;
      // this.PERMISSIONS = data.PERMISSION;
      // this.componentName = data.ANG_WEB_FORM_NAME;
    }
    this.masterGridComponent?.getMasterGridData(data)
  }
  // const endTime = performance.now();
  // const duration = endTime - startTime;
}
