import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.scss']
})
export class GridSettingsComponent implements OnInit {

  subscriptions: Subscription[] = []
  tableData:any[] = []
  isViewTable: boolean = false;
  isLoading: boolean = false;
  menuModule: string = ''

  columnhead: any[] = ['Field Name','Caption','Width','Format','Alignment','Display Order','Is Visible','Is Mandatory','Show Summary','Sum Type'];
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
    VocType:[''],
    mainVocType:[''],
    branchCode:[''],
    copyToAllBranch:[''],
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
  }

  vocTypeSelected(event:any){
    console.log(event);
    let vocData = this.commonService.VocTypeMasterData
    console.log(vocData,this.commonService.VocTypeMasterData);
    this.gridSettingsForm.controls.VocType.setValue(event.VOCTYPE)
  }
  branchCodeSelected(event:any){
    this.gridSettingsForm.controls.branchCode.setValue(event.BRANCH_CODE)
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
        "VOCTYPE": this.commonService.nullToString(form.mainVocType),
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
          console.log(data);
        } else {
         
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
      })
    this.subscriptions.push(Sub)
  }

  //submit
  formSubmit() {
    let postData = {
      "SPID": "060",
      "parameter": {
        "FLAG": 'GET',
        "SUBFLAG": 'LIST',
        "MAIN_VOCTYPE": '',
        "VOCTYPE": '',
        "BRANCH_CODE": '',
        "CUSTOM_PARAM": '',
      }
    }
    this.commonService.showSnackBarMsg('Loading')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
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
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
