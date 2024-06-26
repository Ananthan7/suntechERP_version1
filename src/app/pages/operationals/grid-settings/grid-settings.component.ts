import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import * as convert from "xml-js";

@Component({
  selector: 'app-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.scss']
})
export class GridSettingsComponent implements OnInit {

  subscriptions: Subscription[] = []
  tableData: any[] = []
  menuList: any[] = []
  vocTypeList: any[] = []
  mainVocTypeList: any[] = []
  vocdataList: any[] = []
  isViewTable: boolean = false;
  isLoading: boolean = false;
  menuModule: string = ''

  columnhead: any[] = [];
  vocTypeMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 88,
    SEARCH_FIELD: 'VOCTYPE',
    SEARCH_HEADING: 'Voucher Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "VOCTYPE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  branchMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 5,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'BRANCH MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  gridSettingsForm: FormGroup = this.formBuilder.group({
    VocType: [''],
    mainVocType: [''],
    branchCode: [''],
    copyToAllBranch: [''],
    MODULE_NAME: [''],
  })
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
  ) {
  }

  ngOnInit(): void {
    this.gridSettingsForm.controls.branchCode.setValue(this.commonService.branchCode)
    this.menuList = this.commonService.getMenuList()
  }

  vocTypeSelected(event: any) {
    this.gridSettingsForm.controls.VocType.setValue(event.VOCTYPE)
  }
  branchCodeSelected(event: any) {
    this.gridSettingsForm.controls.branchCode.setValue(event.BRANCH_CODE)
  }
  moduleChange(event: any) {
    this.getSubmenuList(event)
  }
  VocTypeChange(event: any) {
    console.log(event, 'VocTypeChange');
    if (!event) {
      this.mainVocTypeList = this.vocdataList
      this.gridSettingsForm.controls.VocType.setValue('')
      return
    }
    this.gridSettingsForm.controls.VocType.setValue(event.VOCTYPE)
    this.mainVocTypeList = this.vocTypeList.filter((item: any) => item.VOCTYPE == event.VOCTYPE)
    this.getGridList()
  }
  mainVocTypeChange(event: any) {
    console.log(event, 'mainVocTypeChange');
    if (!event) {
      this.vocTypeList = this.vocdataList
      this.gridSettingsForm.controls.mainVocType.setValue('')
      return
    }
    this.gridSettingsForm.controls.mainVocType.setValue(event.MAIN_VOCTYPE)
    this.vocTypeList = this.vocTypeList.filter((item: any) => item.MAIN_VOCTYPE == event.MAIN_VOCTYPE)
    this.getGridList()
  }
  getSubmenuList(event: any) {
    this.tableData = []
    this.menuModule = event.MODULE_NAME
    this.isLoading = true;
    let API = `WebMenuModuleWise/${this.menuModule}/${this.commonService.userName}/${this.commonService.branchCode}`
    let Sub = this.dataService.getDynamicAPICustom(API).subscribe((response: any) => {
      if (response.status == 'Success') {
        this.isLoading = false;
        this.isViewTable = true;
        this.vocdataList = response.response
        this.vocTypeList = response.response
        this.mainVocTypeList = response.response
      }
    }, err => {
      this.isLoading = false;
    })
    this.subscriptions.push(Sub)
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  //get list
  getGridList() {
    let form = this.gridSettingsForm.value
    let postData = {
      "SPID": "060",
      "parameter": {
        "FLAG": 'GET',
        "SUBFLAG": 'LIST',
        "MAIN_VOCTYPE": this.commonService.nullToString(form.mainVocType),
        "VOCTYPE": this.commonService.nullToString(form.VocType),
        "BRANCH_CODE": this.commonService.nullToString(form.branchCode),
        "CUSTOM_PARAM": '',
      }
    }
    this.commonService.showSnackBarMsg('Loading')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success") {
          let data = result.dynamicData[0]
          this.columnhead = Object.keys(data[0])
          this.tableData = this.commonService.arrayEmptyObjectToString(data)
        } else {
          this.commonService.toastErrorByMsgId('not found')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
      })
    this.subscriptions.push(Sub)
  }
  setTableDataSet() {
    let data:any[] = []
    this.tableData.forEach((item:any)=>{
      data.push({
        "BRANCH_CODE": item.BRANCH_CODE,
        "MAIN_VOCTYPE": item.MAIN_VOCTYPE,
        "VOCTYPE": item.VOCTYPE,
        "FIELD_NAME": item.FIELD_NAME,
        "DISPLAY_NAME": item.DISPLAY_NAME,
        "DATA_TYPE": item.DATA_TYPE,
        "WIDTH": this.commonService.emptyToZero(item.WIDTH),
        "FORMAT": item.FORMAT,
        "ALLIGNMENT": item.ALLIGNMENT,
        "DISPLAY_ODER": this.commonService.emptyToZero(item.DISPLAY_ODER),
        "VISIBLE": true,
        "SHOW_SUMMARY": false,
        "HIDDEN": false,
        "SUM_TYPE":   '',
        "MANDATORY": false
      })
    })
    return data
  }

  //submit
  formSubmit() {
    let form = this.gridSettingsForm.value;
    console.log(this.setTableDataSet(), 'test');

    let data = this.setTableDataSet()
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    let xmlData = convert.js2xml({ root: data }, options);

    let postData = {
      "SPID": "060",
      "parameter": {
        "FLAG": 'INSERT',
        "SUBFLAG": 'LIST',
        "MAIN_VOCTYPE": this.commonService.nullToString(form.mainVocType),
        "VOCTYPE": this.commonService.nullToString(form.VocType),
        "BRANCH_CODE": this.commonService.nullToString(form.branchCode),
        "CUSTOM_PARAM": xmlData || '',
      }
    }

    this.commonService.showSnackBarMsg('Loading')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success") {
          let data = result?.dynamicData[0]
          if(data[0]?.ERRRMSG == "SUCCESS"){
            this.commonService.showSnackBarMsg('data saved successfully')
          }
        } else{
          this.commonService.showSnackBarMsg('data not saved')
        }
   }, err => {
       this.commonService.closeSnackBarMsg()
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
