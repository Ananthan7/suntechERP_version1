import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IndexedApiService } from 'src/app/services/indexed-api.service';
import { IndexedDbService } from 'src/app/services/indexed-db.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-modulelist',
  templateUrl: './modulelist.component.html',
  styleUrls: ['./modulelist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModulelistComponent implements OnInit {
  //variables
  menuList: any[] = [];
  isLoading: boolean = false;

  subscriptions$!: Subscription;
  constructor(
    private dataService: SuntechAPIService,
    public indexedApiService: IndexedApiService,
    public inDb: IndexedDbService,
    private ChangeDetector: ChangeDetectorRef
  ) {
    this.getModuleList()
    this.indexedApiService.setInitailLoadSetUp()
  }

  ngOnInit(): void {
    this.setVoctypeMaster()
  }

  setVoctypeMaster() {
    let branch = localStorage.getItem('userbranch')
    this.inDb.getAllData('VocTypeMaster').subscribe((data) => {
      if (data.length == 0 || data.length == 1) {
        this.indexedApiService.getVocTypeMaster(branch);
      }
    });
  }
  imageUrlMap: any = {
    1: '../../assets/images/lp-icons/newIcons/Retail.svg',
    2: '../../assets/images/lp-icons/newIcons/bullion.svg',
    4: '../../assets/images/lp-icons/newIcons/Refinery.svg',
    5: '../../assets/images/lp-icons/newIcons/Jewellery Manufacturing.svg',
    6: '../../assets/images/lp-icons/newIcons/componentwise.svg',
    7: '../../assets/images/lp-icons/newIcons/Wholesale.svg',
    9: '../../assets/images/lp-icons/newIcons/Payroll.svg',
    10: '../../assets/images/lp-icons/newIcons/boiling.svg',
    11: '../../assets/images/lp-icons/newIcons/Repairing.svg',
    12: '../../assets/images/lp-icons/newIcons/catalogue.svg',
    13: '../../assets/images/lp-icons/newIcons/fixed assets.svg',
    14: '../../assets/images/lp-icons/newIcons/General.svg',
  };
  /**USE: get module list from API */
  getModuleList() {
    this.isLoading = true;
    let API = 'SuntechProdModuleMaster/GetProductModuleList'
    this.subscriptions$ = this.dataService.getDynamicAPICustom(API).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status == 'Success') {
        this.menuList = response.response;
        this.menuList.push({
          MID: 15,
          MODULE_NAME: 'Addons',
          imageUrl: '../../assets/images/lp-icons/newIcons/add_ons.svg'
        });

        this.menuList.sort((a, b) => {
          const nameA = a.MODULE_NAME;
          const nameB = b.MODULE_NAME;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });

        this.menuList.forEach(data => {
          if (this.imageUrlMap[data.MID]) {
            data.imageUrl = this.imageUrlMap[data.MID];
          }
        });
        localStorage.setItem('MENU_LIST', JSON.stringify(this.menuList));
        this.ChangeDetector.detectChanges()
      } else {
        this.menuList = [];
      }
    }, err => {
      this.isLoading = false;
      alert(err)
    })
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe()
  }
}
