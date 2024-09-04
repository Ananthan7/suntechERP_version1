import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-menu-updation',
  templateUrl: './menu-updation.component.html',
  styleUrls: ['./menu-updation.component.scss']
})
export class MenuUpdationComponent implements OnInit {
  subscriptions: Subscription[] = []
  menuList:any[] = [];
  tableData:any[] = []
  isViewTable: boolean = false;
  isLoading: boolean = false;
  menuModule: string = ''
  menuMasterForm: FormGroup = this.formBuilder.group({
    strMenuID: ['',[Validators.required]],
    strPathName: ['',[Validators.required]],
    strComponentName: ['',[Validators.required]],
    strFormComponentName: ['',[Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
  ) { 
    this.menuList = this.commonService.getMenuList()
  }

  ngOnInit(): void {
  }
  //party Code validate
  updateMenu(event:any) {
    console.log(event.data,'event');
    let saveData = event.data
    if (!saveData.MENU_ID || saveData.MENU_ID == '') {
      this.commonService.showSnackBarMsg('Menu Id Not found')
      return
    }
    let postData = {
      "SPID": "0113",
      "parameter": {
        "strMenuID": saveData.MENU_ID || '',
        "strPathName": saveData.ANG_WEB_PATH_NAME || '',
        "strComponentName": saveData.ANG_WEB_COMPONENT_NAME || '',
        "strFormComponentName": saveData.ANG_WEB_FORM_NAME || '',
        "strFormName": saveData.MENU_CAPTION_ENG  || ''
      }
    }
    this.commonService.showSnackBarMsg('Loading')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        this.getSubmenuList({value: ''})
        if (result.status == "Success") {
          let data = result.dynamicData[0]
          console.log(data);
        } else {
         
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
      })
    this.subscriptions.push(Sub)
  }
  getSubmenuList(event: any) {
    this.tableData = []
    this.menuModule = event.value != '' ? event.value : this.menuModule
    this.isLoading = true;
    let API = `WebMenuModuleWise/${this.menuModule}/${this.commonService.userName}/${this.commonService.branchCode}`
    let Sub = this.dataService.getDynamicAPICustom(API).subscribe((response: any) => {
      if (response.status == 'Success') {
        this.isLoading = false;
        this.isViewTable = true;
        this.tableData = response.response
        console.log(this.tableData,'this.tableData');
      }
    },err=>{
      this.isLoading = false;
    })
    this.subscriptions.push(Sub)
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
