import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-favorite-menus',
  templateUrl: './favorite-menus.component.html',
  styleUrls: ['./favorite-menus.component.scss']
})
export class FavoriteMenusComponent implements OnInit {
  @Input() menuTitle = '';
  @Output() subMenuChange = new EventEmitter<any>()

  subMenuName: any;
  subMenuList: any;
  branchCode: any;
  username: any = localStorage.getItem('username');
  menuList: any;
  uniqueColsub: any;
  subscriptions$!: Subscription;
  skeltonLoading: boolean = false
  favMenuList: any[] = [];
  constructor(
    public dataService: SuntechAPIService,
    public CommonService: CommonServiceService,
    private router: Router,
    private ChangeDetector: ChangeDetectorRef
  ) {
    this.menuList = this.CommonService.getMenuList()
  }

  ngOnInit(): void {
    this.branchCode = this.CommonService.branchCode
    this.subMenuName = this.CommonService.getModuleName()
    this.menuTitle = this.CommonService.getTitleName()
    
    this.getSubmenuList(this.menuTitle);
  }
  /**USE: To get submenus of Transaction,Master,Reports from API */
  groupedMenuData: { label: string; submenus: any[] }[] = [];
  getSubmenuList(title: any) {
    let API = `WebMenuModuleWise/${title}/${this.username}/${this.branchCode}`
    this.skeltonLoading = true;
    this.subscriptions$ = this.dataService.getDynamicAPICustom(API).subscribe((response: any) => {
      this.skeltonLoading = false;
      if (response.status == 'Success') {
        let menuData = response.response
        this.favMenuList = menuData.filter((item:any) =>  item.MENU_MODULE == 'Jewellery Manufacturing' && item.MENU_SUB_MODULE=='Master')
        this.ChangeDetector.detectChanges()
        return
        
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

        this.groupedMenuData.forEach((item:any)=>{
          item.submenus.sort((a:any, b:any) => {
            const nameA = a.MENU_CAPTION_ENG.toLowerCase();
            const nameB = b.MENU_CAPTION_ENG.toLowerCase();
          
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          });
          
        })
      }
    })
  }

  pageRoutes(path: any, obj: any,submenu:any) {
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
