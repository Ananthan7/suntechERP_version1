import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { WholesaleSalesmanTargetDetailsComponent } from './wholesale-salesman-target-details/wholesale-salesman-target-details.component';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Component({
  selector: 'app-wholesale-salesman-target',
  templateUrl: './wholesale-salesman-target.component.html',
  styleUrls: ['./wholesale-salesman-target.component.scss']
})
export class WholesaleSalesmanTargetComponent implements OnInit {
  @Input() content!: any;
  maindetails :any[] =[];
  viewMode:boolean = false;
  modalReference!: NgbModalRef;
  wst_id:any;
  flag:any;
  details:any;
  viewOnly:boolean = false;
  private subscriptions: Subscription[] = [];
  dyndatas:any;
  username = localStorage.getItem('username');
  postdata:any;
  disable_code:boolean = false;



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private apiService: SuntechAPIService,
    private commonService: CommonServiceService,


  ) { }

  wholesalesmanform: FormGroup = this.formBuilder.group({
    salesman: [""],
    fin_year: [""],
    datefrom: [""],
    code: [""],
    dateto: [""],
   
  });

  enteredCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Username',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  finyearcodedata: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 103,
    SEARCH_FIELD: '',
    SEARCH_HEADING: 'FIN YEAR',
    SEARCH_VALUE: '',
    WHERECONDITION:"",
    VIEW_INPUT: true,
    VIEW_TABLE:true,
}

setcodevalues(){
  console.log(this.viewMode);
  console.log(this.disable_code);
  
  if(this.viewMode || this.disable_code){
    return;
  }
  let salesmancode = this.wholesalesmanform.controls.salesman.value;
  let finyearcode = this.wholesalesmanform.controls.fin_year.value;
  if(salesmancode != "" && finyearcode != ""){
    let data_code = salesmancode + '-' + finyearcode;
    this.wholesalesmanform.controls.code.setValue(data_code);
  }
}

 selectedfinyear(e:any){
  console.log(e);
  this.wholesalesmanform.controls.fin_year.setValue(e.FYEARCODE);
  this.wholesalesmanform.controls.datefrom.setValue(e.STARTYEAR);
  this.wholesalesmanform.controls.dateto.setValue(e.ENDYEAR);
 }

  enteredCodeSelected(e: any) {
    console.log(e);
    this.wholesalesmanform.controls.fin_year.setValue(e.FYEARCODE);
    this.wholesalesmanform.controls.fin_year.setValue(e.STARTYEAR);
    this.wholesalesmanform.controls.fin_year.setValue(e.ENDYEAR);
  }

  salesmanCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman type',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  selectedsalesman(e:any){
    console.log(e);
    this.wholesalesmanform.controls.salesman.setValue(e.SALESPERSON_CODE);
  }

  ngOnInit(): void {
    console.log(this.content);
   
    // this.wst_id = this.content?.MID;
    this.wst_id = this.content?.TARGET_CODE;
    console.log(this.wst_id);
    this.flag = this.content?.FLAG;
    if(this.flag == 'EDIT'){
      this.disable_code = true;
    }
    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == 'VIEW') {
      this.detailsapi(this.wst_id);
    }
  }

  detailsapi(wst_id: any) {
    this.viewOnly = true;
    let API = `WhlSmanTargetHeader/GetWhlSmanTargetFullDetail/${this.wst_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas.details);
        
        this.maindetails.push(...this.dyndatas?.details)

        this.flag = "EDIT";
      }, (err: any) => {
      })
    this.subscriptions.push(Sub);
  }


  initialController(FLAG: any, DATA: any) {
    if (FLAG === "VIEW") {
      this.viewMode = true;
      this.ViewController(DATA);
    }
    if (FLAG === "EDIT") {
      this.editController(DATA);
    }

    if (FLAG === "DELETE") {
      this.DeleteController(DATA);
    }
  }

  
  ViewController(DATA: any) {
    this.wholesalesmanform.controls.code.setValue(this.content?.TARGET_CODE);
    this.wholesalesmanform.controls.fin_year.setValue(this.content?.FYEARCODE);
    this.wholesalesmanform.controls.salesman.setValue(this.content?.SALESPERSON_CODE);
    this.wholesalesmanform.controls.datefrom.setValue(this.content?.FROM_DATE);
    this.wholesalesmanform.controls.dateto.setValue(this.content?.TO_DATE);
  }


  editController(DATA: any) {
    this.ViewController(DATA);
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

      "TARGET_CODE": this.wholesalesmanform.controls.code.value,
      "FYEARCODE": this.wholesalesmanform.controls.fin_year.value,
      "CREATED_BY": this.username,//"string",
      "CREATED_ON": new Date(),//"2024-11-15T07:07:04.433Z",
      "SALESPERSON_CODE": this.wholesalesmanform.controls.salesman.value,
      "FROM_DATE": this.wholesalesmanform.controls.datefrom.value,
      "TO_DATE": this.wholesalesmanform.controls.dateto.value,
      "MID": 0,
      "details": this.maindetails
     
    }

    if (this.flag === "EDIT") {
      let API = `WhlSmanTargetHeader/UpdateWhlSmanTargetHeader/${this.wst_id}`;
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
      let API = `WhlSmanTargetHeader/InsertWhlSmanTargetHeader`;
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
        const API = `WhlSmanTargetHeader/DeleteWhlSmanTargetHeader/${this.wst_id}`;
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


  
  addTableData(){
    this.modalReference = this.modalService.open(WholesaleSalesmanTargetDetailsComponent, {
      size: 'xl',
      backdrop: true,
      keyboard: false,
      windowClass: 'modal-full-width',
  });

  this.modalReference.closed.subscribe((result) => {
    if (result) {
      console.log('Data received from modal:', result);
      this.details = result;
      const newData = Array.isArray(result) ? result : [result];

      newData.forEach(e => {
        e.SLNO = this.maindetails.length + 1; 
      });
      
      this.maindetails.push(...newData); 

      // this.maindetails = result;
      // this.maindetails.push(result);
      console.log(result);
      
    }
  });
  }

  deleteTableData(){
    this.maindetails.pop();
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

                    this.wholesalesmanform.controls[formName].setValue(
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
      this.wholesalesmanform.controls[formName].setValue("");
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
            this.wholesalesmanform.controls[ctrl].setValue(value);
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
        this.wholesalesmanform.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }



}
