import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tds-master',
  templateUrl: './tds-master.component.html',
  styleUrls: ['./tds-master.component.scss']
})
export class TdsMasterComponent implements OnInit {

  @Input() content!: any;
  unq_id: any;
  BranchData:any=[];
  maindetails:any=[];
  private subscriptions: Subscription[] = [];
  viewOnly: boolean = false;
  viewMode: boolean = false;
  editMode: boolean = false;
  dyndatas: any;
  tds:any;
  flag: any;
  curr_branch :any = localStorage.getItem('userbranch');
  disable_code:boolean = false;
  finyears: string[] = [];
  


  constructor(
    private activeModal:NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private apiService: SuntechAPIService,
    private commonService: CommonServiceService,


  ) { }

  ngOnInit(): void {
    this.flag = this.content?.FLAG;
    this.unq_id = this.content?.TDS_CODE;
    console.log(this.unq_id);
    console.log(this.content);
    const API = `TDSMaster/GetFinancialYearDropdown/`;
    this.apiService.getDynamicAPI(API).subscribe((result) => {
      if (result.status.trim() === 'Success') {
        this.finyears = result.dynamicData[0].map((e: any) => e.FYEARCODE); 
      } else {
        this.finyears = [];
      }
    });

    if(this.flag == 'EDIT'){
      this.disable_code = true;
      this.editMode = true;
    }else if(this.flag == 'VIEW'){
      this.viewMode = true;
    }
    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == 'VIEW') {
      this.detailsapi(this.unq_id);
    }
  }

  tdsform: FormGroup = this.formBuilder.group({
    section_code:[''],
    financial_year:[''],
    description:[''],
    credit_ac:[''],
    debit_ac:[''],
    call:[''],
    effdate:[''],
    allbranch:[''],
  })

   creditacdata: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION: "ACCODE <>'' and ACCOUNT_MODE in ('G','B','L')",
    SEARCH_FIELD: "ACCODE",
    SEARCH_VALUE: "",
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  creditcodeselected(e: any) {
    console.log(e);
    this.tdsform.controls.credit_ac.setValue(e.ACCODE);
  }

  debitacdata: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION: "ACCODE <>'' and ACCOUNT_MODE in ('G','B','L')",
    SEARCH_FIELD: "ACCODE",
    SEARCH_VALUE: "",
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  debitcodeselected(e: any) {
    console.log(e);
    this.tdsform.controls.debit_ac.setValue(e.ACCODE);
  }



  initialController(FLAG: any, DATA: any) {
    if (FLAG === "VIEW") {
      this.ViewController(DATA);
      this.viewMode = true;
    }
    if (FLAG === "EDIT") {
      this.editController(DATA);
      this.editMode = true;
    }
    if (FLAG === "DELETE") {
      this.DeleteController(DATA);
    }
  }

  editController(DATA: any) {
    this.ViewController(DATA);
  }

  ViewController(DATA: any) {
    this.tdsform.controls.section_code.setValue(this.content?.TDS_CODE);
    this.tdsform.controls.financial_year.setValue(this.content?.TDS_CODE);
    this.tdsform.controls.description.setValue(this.content?.TDS_DESCRIPTION);
    this.tdsform.controls.credit_ac.setValue(this.content?.CREDIT_AC_CODE);
    this.tdsform.controls.debit_ac.setValue(this.content?.DEBIT_AC_CODE);
    this.tdsform.controls.call.setValue(this.content?.ON_TAXABLEAMT);
    this.unq_id = this.content?.TDS_CODE;
  }

  detailsapi(fm_id: any) {
    this.viewOnly = true;

    let API = `TDSMaster/GetTDSHeaderAndDetails/${this.unq_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);
        this.dyndatas.tdsDetails.forEach((ele:any) => {
          ele.EFFECT_FROM_DATE = new Date(ele.EFFECT_FROM_DATE).toISOString().split('T')[0];

          ele.INDIVIDUAL_PER = this.commonService.decimalQuantityFormat(this.commonService.emptyToZero(ele.INDIVIDUAL_PER),"METAL");
          ele.COMPANY_PER = this.commonService.decimalQuantityFormat(this.commonService.emptyToZero(ele.COMPANY_PER),"METAL");
          ele.NOPAN_PER = this.commonService.decimalQuantityFormat(this.commonService.emptyToZero(ele.NOPAN_PER),"METAL");
          ele.TDS_LIMIT = this.commonService.decimalQuantityFormat(this.commonService.emptyToZero(ele.TDS_LIMIT),"METAL");
        });
        this.maindetails.push(... this.dyndatas.tdsDetails)

        // this.flag = "EDIT";
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
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
        const API = `TDSMaster/DeleteTDSMaster/${this.unq_id}`;
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
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW'){
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
  }
  )
  }

  formSubmit() {

    const postData = {
      "TDS_CODE": this.tdsform.controls.section_code.value,
      "TDS_DESCRIPTION": this.tdsform.controls.description.value,
      "CREDIT_AC_CODE": this.tdsform.controls.credit_ac.value,
      "SYSTEM_DATE": new Date(),
      "MID": 0,
      "INDIVIDUAL_PER": 0,
      "COMPANY_PER": 0,
      "NOPAN_PER": 0,
      "DEBIT_AC_CODE":this.tdsform.controls.debit_ac.value,
      "BRANCH_CODE": this.curr_branch,
      "TDS_LIMIT": 0,
      "ON_TAXABLEAMT": this.tdsform.controls.call.value,
      "INCLUDE_GST": true,
      "tdsDetails": [
        {
          "UNIQUE_ID": 0,
          "REFMID": 0,
          "EFFECT_FROM_DATE": "2024-11-18T06:34:50.057Z",
          "INDIVIDUAL_PER": 0,
          "COMPANY_PER": 0,
          "NOPAN_PER": 0,
          "TDS_CODE": "string",
          "SRNO": 0,
          "BRANCH_CODE": "string",
          "YEARCODE": "string",
          "TDS_LIMIT": 0,
          "ON_TAXABLEAMT": true,
          "INCLUDE_GST": true
        }
      ]
    }

    if (this.flag === "EDIT") {


      const postData = {
        "TDS_CODE": this.tdsform.controls.section_code.value,
        "TDS_DESCRIPTION": this.tdsform.controls.description.value,
        "CREDIT_AC_CODE": this.tdsform.controls.credit_ac.value,
        "SYSTEM_DATE": new Date(),
        "MID": 0,
        "INDIVIDUAL_PER": 0,
        "COMPANY_PER": 0,
        "NOPAN_PER": 0,
        "DEBIT_AC_CODE":this.tdsform.controls.debit_ac.value,
        "BRANCH_CODE": this.curr_branch,
        "TDS_LIMIT": 0,
        "ON_TAXABLEAMT": this.tdsform.controls.call.value=='Y' ? true : false,
        "INCLUDE_GST": true,
        "tdsDetails": [
          {
            "UNIQUE_ID": 0,
            "REFMID": 0,
            "EFFECT_FROM_DATE": "2024-11-18T06:34:50.057Z",
            "INDIVIDUAL_PER": 0,
            "COMPANY_PER": 0,
            "NOPAN_PER": 0,
            "TDS_CODE": "string",
            "SRNO": 0,
            "BRANCH_CODE": "string",
            "YEARCODE": "string",
            "TDS_LIMIT": 0,
            "ON_TAXABLEAMT": true,
            "INCLUDE_GST": true
          }
        ]
      }


      let API = `TDSMaster/UpdateTDSMaster/${this.unq_id}`;
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
      let API = `TDSMaster/InsertTDSMaster`;
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

                    this.tdsform.controls[formName].setValue(
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
      this.tdsform.controls[formName].setValue("");
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
            this.tdsform.controls[ctrl].setValue(value);
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
      const value = e[modelfield];
      if (value !== undefined) {
        this.tdsform.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }

  individual_change(e: any, data: any) {
    e.preventDefault();
    Swal.fire({
      title: 'Do You Want to Apply for All?',
      text: 'Do You Want to Apply for All?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {

        let curr_index = data.data.SRNO - 1; 
        for (let i = curr_index; i < this.maindetails.length; i++) {
          this.maindetails[i].INDIVIDUAL_PER = this.commonService.decimalQuantityFormat(
            this.commonService.emptyToZero(e.target.value), "METAL"
          );
        }
      } else {
        const updatedSRNO = data.data.SRNO - 1;
        this.maindetails[updatedSRNO].INDIVIDUAL_PER = this.commonService.decimalQuantityFormat(this.commonService.emptyToZero(e.target.value), "METAL");
      }
    });
  }

  company_change(e: any, data: any) {
    e.preventDefault();
    Swal.fire({
      title: 'Do You Want to Apply for All?',
      text: 'Do You Want to Apply for All?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        let curr_index = data.data.SRNO - 1; 
        for (let i = curr_index; i < this.maindetails.length; i++) {
          this.maindetails[i].COMPANY_PER = this.commonService.decimalQuantityFormat(
            this.commonService.emptyToZero(e.target.value), "METAL"
          );
        }
      } else {
        const updatedSRNO = data.data.SRNO - 1;
        this.maindetails[updatedSRNO].COMPANY_PER = this.commonService.decimalQuantityFormat(this.commonService.emptyToZero(e.target.value), "METAL");
      }
    });
  }

  nopan_change(e: any, data: any) {
    e.preventDefault();
    Swal.fire({
      title: 'Do You Want to Apply for All?',
      text: 'Do You Want to Apply for All?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        let curr_index = data.data.SRNO - 1; 
        for (let i = curr_index; i < this.maindetails.length; i++) {
          this.maindetails[i].NOPAN_PER = this.commonService.decimalQuantityFormat(
            this.commonService.emptyToZero(e.target.value), "METAL"
          );
        }
      } else {
        const updatedSRNO = data.data.SRNO - 1;
        this.maindetails[updatedSRNO].NOPAN_PER = this.commonService.decimalQuantityFormat(this.commonService.emptyToZero(e.target.value), "METAL");
      }
    });
  }

  tdslimit_chnage(e: any, data: any) {
    e.preventDefault();
    Swal.fire({
      title: 'Do You Want to Apply for All?',
      text: 'Do You Want to Apply for All?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      let curr_index = data.data.SRNO - 1; 
      if (result.isConfirmed) {
        for (let i = curr_index; i < this.maindetails.length; i++) {
          this.maindetails[i].TDS_LIMIT = this.commonService.decimalQuantityFormat(
            this.commonService.emptyToZero(e.target.value), "METAL"
          );
        }
      } else {
        this.maindetails[curr_index].TDS_LIMIT = this.commonService.decimalQuantityFormat(
          this.commonService.emptyToZero(e.target.value), "METAL"
        );
      }
    });
    
  }


  // getgriddata(){
  //   let section_code = this.tdsform.controls.section_code.value;
    
    
  // }

  getgridvalues(){
    let section_code = this.tdsform.controls.section_code.value;

    let postData = {
      "strDate": "",
      "strIndivi": 0,
      "strComp": 0,
      "strNoPan": 0,
      "strTDSCode": section_code,
      "strTdsLimit": 0
    }
    let API = `TDSMaster/GetGetTDSFinancialDates/`;
      let sub: Subscription = this.apiService
        .postDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result.status.trim() === "Success") {
           console.log(result.dynamicData);
           let dyndatas = result.dynamicData[0];
           dyndatas.forEach((e:any) => {
              e.EFFECT_FROM_DATE
           });


           this.maindetails = dyndatas;
          } else {
            console.log("error");
           
          }
        });


  }

  

  

}
