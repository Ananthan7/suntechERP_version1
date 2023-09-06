import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenubarComponent implements OnInit {
  @Input() menuTitle = '';
  @Output() subMenuChange = new EventEmitter()

  subMenuName: any;
  subMenuList: any;
  branchCode: any;
  username: any = localStorage.getItem('username');
  menuList: any;
  uniqueColsub: any;
  subscriptions$!: Subscription;
  skeltonLoading: boolean = false
  constructor(
    public dataService: SuntechAPIService,
    public CommonService: CommonServiceService,
    private router: Router,
    private ChangeDetector: ChangeDetectorRef
  ) {
    let item: any = localStorage.getItem('MENU_LIST')
    this.menuList = JSON.parse(item)
  }

  ngOnInit(): void {
    this.branchCode = this.CommonService.branchCode
    this.subMenuName = this.CommonService.getModuleName()
    this.menuTitle = this.CommonService.getTitleName()
    console.log(this.menuTitle,'this.menuTitle');
    
    this.getSubmenuList(this.menuTitle);
  }
  /**USE: To get submenus of Transaction,Master,Reports from API */
  groupedMenuData: { label: string; submenus: any[] }[] = [];
  getSubmenuList(title: any) {
    let API = `WebMenuModuleWise/${title}/${this.username}/${this.branchCode}`
    this.skeltonLoading = true;
    this.subscriptions$ = this.dataService.getDynamicAPI(API).subscribe((response: any) => {
      this.skeltonLoading = false;
      if (response.status == 'Success') {
        let menuData = response.response
        const groupedData: { [key: string]: any[] } = {};

        for (const item of menuData) {
          if (!groupedData[item.MENU_SUB_MODULE]) {
            groupedData[item.MENU_SUB_MODULE] = [];
          }
          groupedData[item.MENU_SUB_MODULE].push(item);
        }

        this.groupedMenuData = Object.keys(groupedData).map((label:any, index:any) => ({
          label,
          label_no: index,
          submenus: groupedData[label]
        })).sort((a:any, b:any) => {
          const nameA = a.label;
          const nameB = b.label;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        this.ChangeDetector.detectChanges()
      }
    })
  }

  pageRoutes(path: any, obj: any,submenu:any) {
    console.log(submenu,'submenu');
    this.subMenuChange.emit(submenu);

    let navigationExtras: NavigationExtras = {
      queryParams: obj
    };
    this.router.navigate([path], navigationExtras);
  }

  ngOnDestroy():void{
    this.subscriptions$ && this.subscriptions$.unsubscribe()
  }

}
