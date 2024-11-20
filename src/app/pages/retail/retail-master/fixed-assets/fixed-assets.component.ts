import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fixed-assets',
  templateUrl: './fixed-assets.component.html',
  styleUrls: ['./fixed-assets.component.scss']
})
export class FixedAssetsComponent implements OnInit {
  flag: any;
  fa_id: any;
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  username = localStorage.getItem('username');
  viewOnly: boolean = false;
  dyndatas: any = [];
  disable_code:boolean = false;


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private commonService: CommonServiceService,


  ) { }

  fixedassetsform: FormGroup = this.formBuilder.group({
    category_code: [''],
    category_code_desc: [''],
    assets_code: [''],
    description: [''],
    curr_code: [''],
    curr_rate: [''],
    land_cost_lc: [''],
    cost_lc: [''],
    code: [''],
    opening_acc_dep: [''],
    costfc: [''],
    open_net_val: [''],
    Branchcode: [''],
    Branch: [''],
    department_code: [''],
    department: [''],
    loc_code: [''],
    location: [''],
    used_by_code: [''],
    used_by: [''],
    type_code: [''],
    type: [''],
    start_from: [''],
    method: [''],
    percent: [''],
    life_period: [''],
    months: [''],
    last_dep_date: [''],
    status: [''],
    status_desc: [''],
    disposal_date: [''],
    opening: [''],
    supplier_code: [''],
    supplier_code_desc: [''],
    subledger_code: [''],
    subledger_code_desc: [''],
    purchase_inv: [''],
    supp_inv_date: [''],
    cost_lc_dt: [''],
    cost_fc_dt: [''],
    remarks: [''],
    reg_no: [''],
    insurance: [''],
    certi_no: [''],
    install_dt: [''],
    created_by: [''],
    created_on: [''],
    warranty: [''],
    service_upto: [''],
    insurance_upto: [''],
    reg_upto: [''],
    certi_upto: [''],
    userdefined_1: [''],
    userdefined_2: [''],
    userdefined_3: [''],
    userdefined_4: [''],
    userdefined_5: [''],
    doc_type: [''],
    doc_no: [''],
  });

  ngOnInit(): void {
    console.log(this.content);
    this.fa_id = this.content?.MID;
    console.log(this.fa_id);
    this.flag = this.content?.FLAG;
    if(this.flag == 'EDIT'){
      this.disable_code = true;
    }
    this.initialController(this.flag, this.content);
  }

  UDF1Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
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
    this.fixedassetsform.controls.userdefined_1.setValue(e.CODE);
  }

  UDF2Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
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
    this.fixedassetsform.controls.userdefined_2.setValue(e.CODE);
  }

  UDF3Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
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
    this.fixedassetsform.controls.userdefined_3.setValue(e.CODE);
  }

  UDF4Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
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
    this.fixedassetsform.controls.userdefined_4.setValue(e.CODE);
  }

  UDF5Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
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
    this.fixedassetsform.controls.userdefined_5.setValue(e.CODE);
  }

  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  branchCodeSelected(e: any) {
    console.log(e);
    this.fixedassetsform.controls.Branchcode.setValue(e.BRANCH_CODE);
    this.fixedassetsform.controls.Branch.setValue(e.BRANCH_NAME);
  }

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  selectionlocation(e: any) {
    console.log(e);
    this.fixedassetsform.controls.location.setValue(e.DESCRIPTION);
    this.fixedassetsform.controls.loc_code.setValue(e.LOCATION_CODE);
  }

  supplierCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Supplier type',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  supplierCodeSelected(e: any) {
    console.log(e);
    this.fixedassetsform.controls.supplier_code.setValue(e.ACCODE);
    this.fixedassetsform.controls.supplier_code_desc.setValue(e.ACCOUNT_HEAD);
  }
  docTypeData: MasterSearchModel =
    {
      PAGENO: 1,
      RECORDS: 10,
      LOOKUPID: 3,
      ORDER_TYPE: 0,
      WHERECONDITION: "TYPES='DOCUMENT TYPE'",
      SEARCH_FIELD: "CODE",
      SEARCH_VALUE: "",
      LOAD_ONCLICK: true,
      FRONTENDFILTER: true,
    }
  docTypeSelected(e: any) {
    console.log(e);
    this.fixedassetsform.controls.doc_type.setValue(e.CODE);
  }


  subledgerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 180,
    SEARCH_FIELD: 'SUBLEDGER_CODE',
    SEARCH_HEADING: 'Sub Ledger Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SUBLEDGER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  subledgerCodeSelected(e: any) {
    console.log(e);
    this.fixedassetsform.controls.subledger_code.setValue(e.SUBLEDGER_CODE);
    this.fixedassetsform.controls.subledger_code_desc.setValue(e.SUBLEDGER_CODE);
  }

  fixingassetscodedata: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 104,
    ORDER_TYPE: 0,
    SEARCH_HEADING: 'fixing assets code',
    SEARCH_VALUE: "",
    SEARCH_FIELD: "CODE",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }


  selectedfixingassets(e: any) {
    console.log(e);
    this.fixedassetsform.controls.category_code.setValue(e.CODE);
    this.fixedassetsform.controls.category_code_desc.setValue(e.DESCRIPTION);
  }


  departmentcodedata: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    ORDER_TYPE: 0,
    SEARCH_HEADING: 'Department',
    SEARCH_VALUE: "",
    SEARCH_FIELD: 'Types',
    WHERECONDITION: "Types = 'FA DEPARTMENT'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }


  selecteddepartment(e: any) {
    console.log(e);
    this.fixedassetsform.controls.department_code.setValue(e.CODE);
    this.fixedassetsform.controls.department.setValue(e.DESCRIPTION);
  }


  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_HEADING: "Type Code",
    SEARCH_VALUE: "",
    SEARCH_FIELD: 'Types',
    WHERECONDITION: "Types = 'FA CATEGORY'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  typeSelected(value: any) {
    console.log(value);
    this.fixedassetsform.controls.type_code.setValue(value.CODE);
    this.fixedassetsform.controls.type.setValue(value.DESCRIPTION);
  }

  usedcodedata: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_HEADING: "Used By",
    SEARCH_VALUE: "",
    SEARCH_FIELD: 'Types',
    WHERECONDITION: "Types = 'USED BY'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  selectedused(value: any) {
    console.log(value);
    this.fixedassetsform.controls.used_by_code.setValue(value.CODE);
    this.fixedassetsform.controls.used_by.setValue(value.DESCRIPTION);
  }

  statusCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Status",
    SEARCH_VALUE: "",
    WHERECONDITION: "Types = 'REPAIR ITEM STATUS MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  statusCodeSelected(e: any) {
    console.log(e);
    this.fixedassetsform.controls.status.setValue(e.CODE);
    this.fixedassetsform.controls.status_desc.setValue(e.DESCRIPTION);
  }

  BranchData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  BranchDataSelected(e: any) {
    console.log(e);

  }






  initialController(FLAG: any, DATA: any) {
    if (FLAG === "VIEW") {
      this.ViewController(DATA);
      this.viewOnly = true;

    }
    if (FLAG === "EDIT") {
      this.editController(DATA);
    }

    if (FLAG === "DELETE") {
      this.DeleteController(DATA);
    }
  }

  ViewController(DATA: any) {

    let API = `FAMaster/GetFAMasterDetail/${this.fa_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);
        this.fixedassetsform.controls.category_code.setValue(this.dyndatas.FA_CATEGORY);
        this.fixedassetsform.controls.assets_code.setValue(this.dyndatas.FA_CODE);
        this.fixedassetsform.controls.description.setValue(this.dyndatas.FA_DESC);
        this.fixedassetsform.controls.method.setValue(this.dyndatas.FA_DEP_METHOD);
        this.fixedassetsform.controls.life_period.setValue(this.dyndatas.FA_DEP_PERCENTAGE);
        this.fixedassetsform.controls.cost_lc.setValue(this.dyndatas.FA_COST);
        this.fixedassetsform.controls.land_cost_lc.setValue(this.dyndatas.FA_LANDEDCOST);
        this.fixedassetsform.controls.open_net_val.setValue(this.dyndatas.FA_OPN_DEP_AMOUNT);
        this.fixedassetsform.controls.opening_acc_dep.setValue(this.dyndatas.FA_ACC_DEP_AMOUNT);
        this.fixedassetsform.controls.start_from.setValue(this.dyndatas.FA_START_DEP_DATE);
        this.fixedassetsform.controls.last_dep_date.setValue(this.dyndatas.FA_LAST_DEP_DATE);
        this.fixedassetsform.controls.purchase_inv.setValue(this.dyndatas.FA_PUR_VOCNO);
        this.fixedassetsform.controls.supp_inv_date.setValue(this.dyndatas.FA_PUR_VOCDATE);
        this.fixedassetsform.controls.supplier_code.setValue(this.dyndatas.FA_SUPPLIER);
        this.fixedassetsform.controls.disposal_date.setValue(this.dyndatas.FA_DISPOSAL_DATE);
        this.fixedassetsform.controls.remarks.setValue(this.dyndatas.FA_DISPOSAL_REMARKS);
        this.fixedassetsform.controls.created_by.setValue(this.dyndatas.FA_CREATEDBY);
        this.fixedassetsform.controls.created_on.setValue(this.dyndatas.FA_CREATEDTIME);
        this.fixedassetsform.controls.Branchcode.setValue(this.dyndatas.FA_BRANCHCODE);
        this.fixedassetsform.controls.department_code.setValue(this.dyndatas.FA_DEPARTMENT);
        this.fixedassetsform.controls.loc_code.setValue(this.dyndatas.FA_LOCATION);
        this.fixedassetsform.controls.used_by_code.setValue(this.dyndatas.FA_USEDBY);
        this.fixedassetsform.controls.category_code_desc.setValue(this.dyndatas.FA_DET_CATEGORY);
        this.fixedassetsform.controls.status.setValue(this.dyndatas.FA_ACTIVESTATUS);
        this.fixedassetsform.controls.warranty.setValue(this.dyndatas.FA_WARRANTYUPTO_DATE);
        this.fixedassetsform.controls.service_upto.setValue(this.dyndatas.FA_SERVICECTRLUPTO_DATE);
        this.fixedassetsform.controls.insurance_upto.setValue(this.dyndatas.FA_INSURANCEUPTO_DATE);
        this.fixedassetsform.controls.reg_upto.setValue(this.dyndatas.FA_REGISTRATIONUPTO_DATE);
        this.fixedassetsform.controls.certi_upto.setValue(this.dyndatas.FA_CERTIFICATIONUPTO_DATE);
        this.fixedassetsform.controls.reg_no.setValue(this.dyndatas.FA_REGNO);
        this.fixedassetsform.controls.insurance.setValue(this.dyndatas.FA_INSURANCE);
        this.fixedassetsform.controls.certi_no.setValue(this.dyndatas.FA_CERTIFICATIONNO);
        this.fixedassetsform.controls.install_dt.setValue(this.dyndatas.FA_INSTALLATION_DETAILS);
        this.fixedassetsform.controls.costfc.setValue(this.dyndatas.FA_COST_FC);
        this.fixedassetsform.controls.curr_rate.setValue(this.dyndatas.FA_CONV_RATE);
        this.fixedassetsform.controls.curr_code.setValue(this.dyndatas.FA_CURRENCY);
        this.fixedassetsform.controls.months.setValue(this.dyndatas.FA_DEP_PERIOD);
        this.fixedassetsform.controls.userdefined_1.setValue(this.dyndatas.UDF1);
        this.fixedassetsform.controls.userdefined_2.setValue(this.dyndatas.UDF2);
        this.fixedassetsform.controls.userdefined_3.setValue(this.dyndatas.UDF3);
        this.fixedassetsform.controls.userdefined_4.setValue(this.dyndatas.UDF4);
        this.fixedassetsform.controls.userdefined_5.setValue(this.dyndatas.UDF5);
        // this.flag = "EDIT";

      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
    console.log(this.dyndatas.FA_CATEGORY);





  }

  editController(DATA: any) {
    this.ViewController(DATA);
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
        const API = `FAMaster/DeleteFAMaster/${this.fa_id}`;
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
            error: (err) => {
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
    // this.activeModal.close(data);
    if(this.flag == undefined || this.flag == 'EDIT'){
      Swal.fire({
        title: "Confirm",
        text: "Are you sure you want to close this window?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          this.activeModal.close(data);
        }
      });
    }else{
      this.activeModal.close(data);
    }
  }

  formSubmit() {

    const postData = {
      "MID": 0,
      "FA_CATEGORY": this.fixedassetsform.controls.category_code.value,
      "FA_CODE": this.fixedassetsform.controls.assets_code.value,
      "FA_DESC": this.fixedassetsform.controls.description.value,
      "FA_MSTORADDITION": "string",
      "FA_DEP_METHOD": this.fixedassetsform.controls.method.value,
      "FA_DEP_PERCENTAGE": this.fixedassetsform.controls.life_period.value,
      "FA_CALCULATION_METHOD": "string",
      "FA_CM_LENGTH_MONTH": 0,
      "FA_NO_OF_PCS": 0,
      "FA_COST": this.fixedassetsform.controls.cost_lc.value,
      "FA_LANDEDCOST": this.fixedassetsform.controls.land_cost_lc.value,
      "FA_OPN_DEP_AMOUNT": this.fixedassetsform.controls.open_net_val.value,
      "FA_ACC_DEP_AMOUNT": this.fixedassetsform.controls.opening_acc_dep.value,
      "FA_START_DEP_DATE": this.fixedassetsform.controls.start_from.value,
      "FA_LAST_DEP_DATE": this.fixedassetsform.controls.last_dep_date.value,
      "FA_PUR_DETAILS": "string",
      "FA_PUR_VOCNO": this.fixedassetsform.controls.purchase_inv.value,
      "FA_PUR_VOCDATE": this.fixedassetsform.controls.supp_inv_date.value,
      "FA_SUPPLIER": this.fixedassetsform.controls.supplier_code.value,
      "FA_PUR_AMOUNT": 0,
      "FA_DISPOSAL_DATE": this.fixedassetsform.controls.disposal_date.value,
      "FA_DISPOSAL_REMARKS": this.fixedassetsform.controls.remarks.value,
      "FA_CREATEDBY": this.fixedassetsform.controls.created_by.value,
      "FA_CREATEDTIME": this.fixedassetsform.controls.created_on.value,
      "FA_BRANCHCODE": this.fixedassetsform.controls.Branchcode.value,
      "FA_DEPARTMENT": this.fixedassetsform.controls.department_code.value,
      "FA_DIVISION": "string",
      "FA_LOCATION": this.fixedassetsform.controls.loc_code.value,
      "FA_USEDBY": this.fixedassetsform.controls.used_by_code.value,
      "FA_DET_CATEGORY": this.fixedassetsform.controls.category_code_desc.value,
      "FA_ACTIVESTATUS": this.fixedassetsform.controls.status.value,
      "FA_IMAGEPATH": "string",
      "FA_WARRANTYUPTO_DATE": this.fixedassetsform.controls.warranty.value,
      "FA_SERVICECTRLUPTO_DATE": this.fixedassetsform.controls.service_upto.value,
      "FA_INSURANCEUPTO_DATE": this.fixedassetsform.controls.insurance_upto.value,
      "FA_REGISTRATIONUPTO_DATE": this.fixedassetsform.controls.reg_upto.value,
      "FA_CERTIFICATIONUPTO_DATE": this.fixedassetsform.controls.certi_upto.value,
      "FA_REGNO": this.fixedassetsform.controls.reg_no.value,
      "FA_INSURANCE": this.fixedassetsform.controls.insurance.value,
      "FA_CERTIFICATIONNO": this.fixedassetsform.controls.certi_no.value,
      "FA_INSTALLATION_DETAILS": this.fixedassetsform.controls.install_dt.value,
      "FA_COST_FC": this.fixedassetsform.controls.costfc.value,
      "FA_CONV_RATE": this.fixedassetsform.controls.curr_rate.value,
      "FA_CURRENCY": this.fixedassetsform.controls.curr_code.value,
      "FA_DEP_PERIOD": this.fixedassetsform.controls.months.value,
      "UDF1": this.fixedassetsform.controls.userdefined_1.value,
      "UDF2": this.fixedassetsform.controls.userdefined_2.value,
      "UDF3": this.fixedassetsform.controls.userdefined_3.value,
      "UDF4": this.fixedassetsform.controls.userdefined_4.value,
      "UDF5": this.fixedassetsform.controls.userdefined_5.value
    }

    if (this.flag === "EDIT") {
      let API = `FAMaster/UpdateFAMaster/${this.fa_id}`;
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
      let API = `FAMaster/InsertFAMaster`;
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

                    this.fixedassetsform.controls[formName].setValue(
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
      this.fixedassetsform.controls[formName].setValue("");
    });
  }

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    console.log(e);
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
      // Handle multiple controllers and fields
      if (controller.length === modelfield.length) {
        controller.forEach((ctrl, index) => {
          const field = modelfield[index];
          const value = e[field];
          if (value !== undefined) {
            this.fixedassetsform.controls[ctrl].setValue(value);
          } else {
            console.warn(`Model field '${field}' not found in event object.`);
          }
        });
      } else {
        console.warn(
          "Controller and modelfield arrays must be of equal length."
        );
      }
    } else if (controller && modelfield) {
      // Handle single controller and field
      const value = e[modelfield];
      if (value !== undefined) {
        this.fixedassetsform.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }



}
