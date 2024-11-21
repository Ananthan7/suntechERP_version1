import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-general-document-master',
  templateUrl: './general-document-master.component.html',
  styleUrls: ['./general-document-master.component.scss']
})
export class GeneralDocumentMasterComponent implements OnInit {

  BranchData:any=[];
  @Input() content!: any;
  unq_id: any;
  flag: any;
  dyndatas: any;
  private subscriptions: Subscription[] = [];
  viewOnly: boolean = false;
  disable_code:boolean = false;
  editMode:boolean = false;
  viewMode:boolean = false;
  codeedit:boolean = false;


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private commonService: CommonServiceService,
  ) { }


  UDF1Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: '',
    SEARCH_HEADING: 'UDF1',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field1'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF1CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_1.setValue(e.CODE);
  }

  UDF2Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF2',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field2'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF2CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_2.setValue(e.CODE);
  }

  UDF3Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF3',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field3'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF3CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_3.setValue(e.CODE);
  }

  UDF4Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF4',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field4'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF4CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_4.setValue(e.CODE);
  }

  UDF5Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF5',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field5'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF5CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_5.setValue(e.CODE);
  }

  UDF6Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF6',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field6'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF6CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_6.setValue(e.CODE);
  }

  UDF7Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF7',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field7'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF7CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_7.setValue(e.CODE);
  }

  UDF8Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF8',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field8'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF8CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_8.setValue(e.CODE);
  }

  UDF9Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF9',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field9'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF9CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_9.setValue(e.CODE);
  }

  UDF10Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF10',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field10'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF10CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_10.setValue(e.CODE);
  }

  UDF11Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF11',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field11'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF11CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_11.setValue(e.CODE);
  }

  UDF125Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF12',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field12'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF12CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_12.setValue(e.CODE);
  }

  UDF13Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF13',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field13'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF13CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_13.setValue(e.CODE);
  }

  UDF14Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF14',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field14'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF14CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_14.setValue(e.CODE);
  }

  UDF15Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF15',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field5'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  UDF15CodeSelected(e: any) {
    console.log(e);
    this.generaldocumentform.controls.user_defined_15.setValue(e.CODE);
  }

 
  
  generaldocumentform: FormGroup = this.formBuilder.group({
    code:[''],
    description:[''],
    reminderdays:[''],
    cust_applicable:[''],
    cust_mandatory:[''],
    branch_applicable:[''],
    branch_mandatory:[''],
    supplier_applicable:[''],
    supplier_mandatory:[''],
    employee_applicable:[''],
    employee_mandatory:[''],
    user_defined_1:[''],
    user_defined_2:[''],
    user_defined_3:[''],
    user_defined_4:[''],
    user_defined_5:[''],
    user_defined_6:[''],
    user_defined_7:[''],
    user_defined_8:[''],
    user_defined_9:[''],
    user_defined_10:[''],
    user_defined_11:[''],
    user_defined_12:[''],
    user_defined_13:[''],
    user_defined_14:[''],
    user_defined_15:[''],
  })

  ngOnInit(): void {
    console.log(this?.content);
    this.unq_id = this.content?.GENMST_CODE;
    console.log(this.unq_id);
    this.flag = this.content?.FLAG;
    if(this.flag == 'EDIT'){
      this.codeedit=true;
      this.disable_code = true;
      this.editMode = true;
    }else if(this.flag == 'VIEW'){
      this.viewMode = true;
      this.codeedit=true;

    }
    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == 'VIEW') {
      this.detailsapi(this.unq_id);
    }
  }

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "VIEW") {
      this.viewOnly = true;
      this.ViewController(DATA);
    }
    if (FLAG === "EDIT") {
      this.editController(DATA);
    }

    if (FLAG === "DELETE") {
      this.DeleteController(DATA);
    }
  }

  editController(DATA: any) {
    this.ViewController(DATA);
  }

  ViewController(DATA: any) {
    console.log(this.viewOnly);
    // this.generaldocumentform.controls.prefixcode.setValue(this.content?.PREFIX_CODE);
    // this.generaldocumentform.controls.prefixcodedesc.setValue(this.content?.DESCRIPTION);
    // this.generaldocumentform.controls.last_no.setValue(this.content?.LAST_NO);
    let API = `GeneralDocumentMaster/GetGeneralDocumentMasterDetail/${this.unq_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);
        this.generaldocumentform.controls.code.setValue(this.dyndatas?.GENMST_CODE);
        this.generaldocumentform.controls.description.setValue(this.dyndatas?.GENMST_DESC);
        this.generaldocumentform.controls.reminderdays.setValue(this.dyndatas?.GENMST_REMAINDER_DAYS);
        this.generaldocumentform.controls.cust_applicable.setValue(this.dyndatas?.GENMST_CUST_APPLICABLE);
        this.generaldocumentform.controls.cust_mandatory.setValue(this.dyndatas?.GENMST_CUST_MANDATORY);
        this.generaldocumentform.controls.branch_applicable.setValue(this.dyndatas?.GENMST_BRANCH_APPLICABLE);
        this.generaldocumentform.controls.branch_mandatory.setValue(this.dyndatas?.GENMST_BRANCH_MANDATORY);
        this.generaldocumentform.controls.supplier_applicable.setValue(this.dyndatas?.GENMST_SUPPLIER_APPLICABLE);
        this.generaldocumentform.controls.supplier_mandatory.setValue(this.dyndatas?.GENMST_SUPPLIER_MANDATORY);
        this.generaldocumentform.controls.employee_applicable.setValue(this.dyndatas?.GENMST_EMP_APPLICABLE);
        this.generaldocumentform.controls.employee_mandatory.setValue(this.dyndatas?.GENMST_EMP_MANDATORY);
        this.generaldocumentform.controls.user_defined_1.setValue(this.dyndatas?.UDF1);
        this.generaldocumentform.controls.user_defined_2.setValue(this.dyndatas?.UDF2);
        this.generaldocumentform.controls.user_defined_3.setValue(this.dyndatas?.UDF3);
        this.generaldocumentform.controls.user_defined_4.setValue(this.dyndatas?.UDF4);
        this.generaldocumentform.controls.user_defined_5.setValue(this.dyndatas?.UDF5);
        this.generaldocumentform.controls.user_defined_6.setValue(this.dyndatas?.UDF6);
        this.generaldocumentform.controls.user_defined_7.setValue(this.dyndatas?.UDF7);
        this.generaldocumentform.controls.user_defined_8.setValue(this.dyndatas?.UDF8);
        this.generaldocumentform.controls.user_defined_9.setValue(this.dyndatas?.UDF9);
        this.generaldocumentform.controls.user_defined_10.setValue(this.dyndatas?.UDF10);
        this.generaldocumentform.controls.user_defined_11.setValue(this.dyndatas?.UDF11);
        this.generaldocumentform.controls.user_defined_12.setValue(this.dyndatas?.UDF12);
        this.generaldocumentform.controls.user_defined_13.setValue(this.dyndatas?.UDF13);
        this.generaldocumentform.controls.user_defined_14.setValue(this.dyndatas?.UDF14);
        this.generaldocumentform.controls.user_defined_15.setValue(this.dyndatas?.UDF15);

        // this.flag = "EDIT";
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
    console.log(this.dyndatas?.PREFIX_CODE);
  }
  detailsapi(fm_id: any) {
    if(this.flag == 'VIEW'){
      this.viewOnly = true;
    }

    let API = `GeneralDocumentMaster/GetGeneralDocumentMasterDetail/${this.unq_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);
        this.generaldocumentform.controls.prefixcode.setValue(this.dyndatas?.PREFIX_CODE);
        // this.flag = "EDIT";
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
    console.log(this.dyndatas?.PREFIX_CODE);
  }

  DeleteController(DATA?: any) {
    this.ViewController(DATA);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        const API = `GeneralDocumentMaster/DeleteGeneralDocumentMaster/${this.unq_id}`;
        const Sub: Subscription = this.apiService
          .deleteDynamicAPI(API)
          .subscribe({
            next: (response: any) => {
              Swal.fire({
                title:
                  response.status === "Success"
                    ? "Deleted Successfully"
                    : "Not Deleted",
                icon: response.status === "Success" ? "success" : "error",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });

              response.status === "Success"
                ? this.close("reloadMainGrid")
                : console.log("Delete Error");
            },
            error: (err: any) => {
              Swal.fire({
                title: "Error",
                text: "Failed to delete the item.",
                icon: "error",
                confirmButtonColor: "#d33",
              });
              console.error(err);
            },
          });
        this.subscriptions.push(Sub);
      } else {
        this.flag = "VIEW";
      }
    });
  }


  close(data?: any) {
    this.activeModal.close(data);
  }

  formSubmit(){
    
    // console.log( this.generaldocumentform.controls.cust_applicable.value)
    // console.log( this.generaldocumentform.controls.cust_mandatory.value)
    // return;
    const postData = {
      "MID": 0,
      "GENMST_CODE": this.generaldocumentform.controls.code.value,
      "GENMST_DESC": this.generaldocumentform.controls.description.value,
      "GENMST_REMAINDER_DAYS": this.generaldocumentform.controls.reminderdays.value,
      "GENMST_CUST_APPLICABLE": this.generaldocumentform.controls.cust_applicable.value === true ? 1 : 0,
      "GENMST_CUST_MANDATORY": this.generaldocumentform.controls.cust_mandatory.value === true ? 1 : 0,
      "GENMST_BRANCH_APPLICABLE": this.generaldocumentform.controls.branch_applicable.value === true ? 1 : 0,
      "GENMST_BRANCH_MANDATORY": this.generaldocumentform.controls.branch_mandatory.value === true ? 1 : 0,
      "GENMST_SUPPLIER_APPLICABLE": this.generaldocumentform.controls.supplier_applicable.value === true ? 1 : 0,
      "GENMST_SUPPLIER_MANDATORY": this.generaldocumentform.controls.supplier_mandatory.value === true ? 1 : 0,
      "GENMST_EMP_APPLICABLE": this.generaldocumentform.controls.employee_applicable.value === true ? 1 : 0,
      "GENMST_EMP_MANDATORY": this.generaldocumentform.controls.employee_mandatory.value ===  true ? 1 : 0,
      "UDF1":  this.generaldocumentform.controls.user_defined_1.value,
      "UDF2": this.generaldocumentform.controls.user_defined_2.value,
      "UDF3": this.generaldocumentform.controls.user_defined_3.value,
      "UDF4": this.generaldocumentform.controls.user_defined_4.value,
      "UDF5": this.generaldocumentform.controls.user_defined_5.value,
      "UDF6": this.generaldocumentform.controls.user_defined_6.value,
      "UDF7": this.generaldocumentform.controls.user_defined_7.value,
      "UDF8": this.generaldocumentform.controls.user_defined_8.value,
      "UDF9": this.generaldocumentform.controls.user_defined_9.value,
      "UDF10": this.generaldocumentform.controls.user_defined_10.value,
      "UDF11":this.generaldocumentform.controls.user_defined_11.value,
      "UDF12":this.generaldocumentform.controls.user_defined_12.value,
      "UDF13":this.generaldocumentform.controls.user_defined_13.value,
      "UDF14":this.generaldocumentform.controls.user_defined_14.value,
      "UDF15":this.generaldocumentform.controls.user_defined_15.value
    }

    if (this.flag === "EDIT") {
      let API = `GeneralDocumentMaster/UpdatetGeneralDocumentMaster/${this.unq_id}`;
      let sub: Subscription = this.apiService
        .putDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result.status.trim() === "Success") {
            Swal.fire({
              title: "Success",
              text: result.message ? result.message : "Updated successfully!",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });

            this.close("reloadMainGrid");
          } else {
            Swal.fire({
              title: "Failed",
              text: result.message ? result.message : "Failed!",
              icon: "error",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });
          }
        });
    } else {
      let API = `GeneralDocumentMaster/InsertGeneralDocumentMaster`;
      let sub: Subscription = this.apiService
        .postDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result.status.trim() === "Success") {
            Swal.fire({
              title: "Success",
              text: result.message ? result.message : "Inserted successfully!",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });

            this.close("reloadMainGrid");
          } else {
            Swal.fire({
              title: "Failed",
              text: "Not Inserted Successfully",
              icon: "error",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });
          }
        });
    }
  }

  BranchDataSelected(e:any){

  }

  SPvalidateLookupFieldModified(
    event: any,
    LOOKUPDATA: MasterSearchModel,
    FORMNAMES: string[],
    isCurrencyField: boolean,
    lookupFields?: string[],
    FROMCODE?: boolean
  ) {
    const searchValue = event.target.value?.trim();

    if (!searchValue || this.flag == "VIEW") return;

    LOOKUPDATA.SEARCH_VALUE = searchValue;

    const param = {
      PAGENO: LOOKUPDATA.PAGENO,
      RECORDS: LOOKUPDATA.RECORDS,
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECONDITION: LOOKUPDATA.WHERECONDITION,
      searchField: LOOKUPDATA.SEARCH_FIELD,
      searchValue: LOOKUPDATA.SEARCH_VALUE,
    };

    this.commonService.showSnackBarMsg("MSG81447");

    const sub: Subscription = this.apiService
      .postDynamicAPI("MasterLookUp", param)
      .subscribe({
        next: (result: any) => {
          this.commonService.closeSnackBarMsg();
          const data = result.dynamicData?.[0];

          console.log("API Response Data:", data);

          if (data?.length) {
            if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE) {

              let searchResult = this.commonService.searchAllItemsInArray(
                data,
                LOOKUPDATA.SEARCH_VALUE
              );

              console.log("Filtered Search Result:", searchResult);

              if (FROMCODE === true) {
                searchResult = [
                  ...searchResult.filter(
                    (item: any) =>
                      item.MobileCountryCode === LOOKUPDATA.SEARCH_VALUE
                  ),
                  ...searchResult.filter(
                    (item: any) =>
                      item.MobileCountryCode !== LOOKUPDATA.SEARCH_VALUE
                  ),
                ];
              } else if (FROMCODE === false) {
                searchResult = [
                  ...searchResult.filter(
                    (item: any) => item.DESCRIPTION === LOOKUPDATA.SEARCH_VALUE
                  ),
                  ...searchResult.filter(
                    (item: any) => item.DESCRIPTION !== LOOKUPDATA.SEARCH_VALUE
                  ),
                ];
              }

              if (searchResult?.length) {
                const matchedItem = searchResult[0];

                FORMNAMES.forEach((formName, index) => {
                  const field = lookupFields?.[index];
                  if (field && field in matchedItem) {

                    this.generaldocumentform.controls[formName].setValue(
                      matchedItem[field]
                    );
                  } else {
                    console.error(
                      `Property ${field} not found in matched item.`
                    );
                    this.commonService.toastErrorByMsgId("No data found");
                    this.clearLookupData(LOOKUPDATA, FORMNAMES);
                  }
                });
              } else {
                this.commonService.toastErrorByMsgId("No data found");
                this.clearLookupData(LOOKUPDATA, FORMNAMES);
              }
            }
          } else {
            this.commonService.toastErrorByMsgId("No data found");
            this.clearLookupData(LOOKUPDATA, FORMNAMES);
          }
        },
        error: () => {
          this.commonService.toastErrorByMsgId("MSG2272");
          this.clearLookupData(LOOKUPDATA, FORMNAMES);
        },
      });

    this.subscriptions.push(sub);
  }

  clearLookupData(LOOKUPDATA: MasterSearchModel, FORMNAMES: string[]) {
    LOOKUPDATA.SEARCH_VALUE = "";
    FORMNAMES.forEach((formName) => {
      this.generaldocumentform.controls[formName].setValue("");
    });
  }



}
