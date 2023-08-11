import { Component, OnInit } from '@angular/core';
import { SignumCRMApiService } from 'src/app/services/signum-crmapi.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-modulelist',
  templateUrl: './modulelist.component.html',
  styleUrls: ['./modulelist.component.scss']
})
export class ModulelistComponent implements OnInit {
  menuList: any[] = [];
  constructor(
    public dataService: SuntechAPIService
  ) {
    this.getModuleList()
  }

  ngOnInit(): void {
  }
  /**USE: get module list from API */
  getModuleList() {
    let API = 'SuntechProdModuleMaster/GetProductModuleList'
    this.dataService.getDynamicAPI(API).subscribe((response: any) => {
      if (response.status == 'Success') {
        this.menuList = response.response;
        this.menuList.push(
          {
            MID: 15,
            MODULE_NAME: 'Addons',
            imageUrl: '../../assets/images/lp-icons/1.png'
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
          if (data.MID == 12) {
            data.imageUrl = '../../assets/images/lp-icons/2.png'
          } else if (data.MID == 14) {
            data.imageUrl = '../../assets/images/lp-icons/3.png'
          } else if (data.MID == 10) {
            data.imageUrl = '../../assets/images/lp-icons/4.png'
          } else if (data.MID == 13) {
            data.imageUrl = '../../assets/images/lp-icons/5.png'
          } else if (data.MID == 5) {
            data.imageUrl = '../../assets/images/lp-icons/6.png'
          } else if (data.MID == 6) {
            data.imageUrl = '../../assets/images/lp-icons/7.png'
          } else if (data.MID == 9) {
            data.imageUrl = '../../assets/images/lp-icons/8.png'
          } else if (data.MID == 8) {
            data.imageUrl = '../../assets/images/lp-icons/9.png'
          } else if (data.MID == 11) {
            data.imageUrl = '../../assets/images/lp-icons/10.png'
          } else if (data.MID == 4) {
            data.imageUrl = '../../assets/images/lp-icons/12.png'
          } else if (data.MID == 1) {
            data.imageUrl = '../../assets/images/lp-icons/11.png'
          }

        });
        localStorage.setItem('menuList', JSON.stringify(this.menuList));
      } else {
        this.menuList = [];
      }
    })
  }
}
