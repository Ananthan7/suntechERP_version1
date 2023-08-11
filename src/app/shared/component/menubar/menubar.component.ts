import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {
  isNavbarCollapsed = true;
  isNavbarCollapsedSub = true;

  @Input() menuTitle = '';

  subMenuList: any;
  branchCode: any = localStorage.getItem('userbranch');
  username: any = localStorage.getItem('username');
  menuList: any;
  uniqueColsub: any;


  constructor(
    public dataService: SuntechAPIService,
    private router: Router,
  ) {
    let item:any = localStorage.getItem('menuList')
    this.menuList = JSON.parse(item)
  }

  ngOnInit(): void {



    this.getSubMenu(this.menuTitle);

    // this.menuTitle = "Jewellery Manufacturing"

    // this.getSubMenu(this.menuTitle);

  }



  getSubMenu(title:any) {
    let API = 'WebMenuModuleWise/${menu}/${username}/${branch}'
    this.dataService.getDynamicAPI(API).subscribe((res) => {

      if (res.status = "Success") {
        let subMenus = res.response;

        this.uniqueColsub = [...new Set(res.response!.map((obj:any) => obj.MENU_SUB_MODULE))]
          .map((title:any) => {
            let uniqueGroups = new Set(
              res.response!.filter((obj:any) => obj.MENU_SUB_MODULE === title).map((obj:any) => obj.MENU_SUB_MODULE_GROUP)
            );
            return {
              title,
              name: title,
              children: [...uniqueGroups].map((group:any) => ({
                name: group,
                // Add more fields as needed
              })).sort((a:any, b:any) => {
                if (a.name < b.name) {
                  return -1;
                }
                if (a.name > b.name) {
                  return 1;
                }
                // names must be equal
                return 0;
              })
            };
          }).sort((a:any, b:any) => {
            if (a.title < b.title) {
              return -1;
            }
            if (a.title > b.title) {
              return 1;
            }
            // names must be equal
            return 0;
          })

        let uniqueCol2 = [...new Set(res.response!.map((obj:any) => obj.MENU_SUB_MODULE_GROUP))]
          .map(title => ({ title, name: title }));

        console.log('this.uniqueCol2 by MENU_SUB_MODULE_GROUP', this.uniqueColsub);

        this.uniqueColsub.map((data:any) => data.children.forEach((data:any) => {
          data['children'] = subMenus.filter((e:any) => e.MENU_SUB_MODULE_GROUP == data['name']).sort((a:any, b:any) => {
            const nameA = a.MENU_CAPTION_ENG;
            const nameB = b.MENU_CAPTION_ENG;
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            // names must be equal
            return 0;
          })
        }))
        console.log(this.uniqueColsub);
        this.subMenuList = this.uniqueColsub;
      }

    });
  }

  pageRoutes(path:any, obj:any) {
    let navigationExtras: NavigationExtras = {
      queryParams: obj
    };
    this.router.navigate([path], navigationExtras);
  }

}
