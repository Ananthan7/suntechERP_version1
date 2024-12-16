import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier-quota-allocation',
  templateUrl: './supplier-quota-allocation.component.html',
  styleUrls: ['./supplier-quota-allocation.component.scss']
})
export class SupplierQuotaAllocationComponent implements OnInit {

  BranchData:any=[];
  maindetails:any=[];
  dur_type:any;
  metal_drop:any[]=[];
  private subscriptions: Subscription[] = [];
  flag:any;
  viewOnly:boolean = false;
  unq_id: any;
  @Input() content!: any;
  disable_code:boolean = false;
  editMode:boolean = false;
  viewMode:boolean = false;
  dyndatas: any;
  fyearcode:any;






  constructor(  
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private commonService: CommonServiceService,
    private renderer: Renderer2
  
  ) { }


  supplierquotaform: FormGroup = this.formBuilder.group({
    partycode:[''],
    metal_division:[''],
    periodType:[''],
    fin_year:[''],
  });
  
  finyearcodedata: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 103,
    SEARCH_FIELD: '',
    SEARCH_HEADING: 'FIN YEAR',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  PartyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Party Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  PartyCodeSelected(event: any) {
    console.log(event);
    this.supplierquotaform.controls.partycode.setValue(event.ACCODE)
  }

  selectedfinyear(e: any) {
    this.supplierquotaform.controls.fin_year.setValue(e.FYEARCODE);
  }

  getdiamond_divisionvalues(){
    let API = `POSTargetMaster/GetMetalDivisonsDropdown`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        console.log(result);
        this.metal_drop = result.dynamicData[0]
        console.log(this.metal_drop)
        const allDivisionCodes = this.metal_drop.map(option => option.DIVISION_CODE);
        const diaDivisionControl = this.supplierquotaform?.get('metal_divisions_');
        if (diaDivisionControl) {
          if(this.flag == undefined){
            diaDivisionControl.setValue(allDivisionCodes); 
          }
        } 
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
  }

  duration_type(){
    console.log(this.supplierquotaform.controls.periodType.value);
    this.dur_type = this.supplierquotaform.controls.periodType.value;
    if(this.dur_type == "monthWise"){
        this.loadgridvalues();
    }else{
      this.loadgridweek();
    }
  }


  ngOnInit(): void {
    this.getdiamond_divisionvalues();
    this.unq_id = this.content?.PARTYCODE;
    this.flag = this.content?.FLAG;
    this.fyearcode = this.content?.FYEARCODE;
    console.log(this.content)
    if(this.flag == undefined){
      this.renderer.selectRootElement('#partycode')?.focus();
    }
    if(this.flag == 'EDIT'){
      this.disable_code = true;
    }else if(this.flag == 'VIEW'){
      this.viewMode = true;
    }
    
    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == 'VIEW') {
      this.detailsapi(this.unq_id);
    }
    if(this.flag == undefined){
      this.loadgridvalues();
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
    this.supplierquotaform.controls.partycode.setValue(this.content?.PARTYCODE);
    this.supplierquotaform.controls.fin_year.setValue(this.content?.FYEARCODE);
    // this.supplierquotaform.controls.metal_division.setValue(this.content?.DIVISIONS);
    // this.supplierquotaform.controls.periodType.setValue(this.content?.MONTHWISE);
    // this.supplierquotaform.controls.periodType.setValue(this.content?.WEEKWISE); 
    // Set the value dynamically based on the content
    if (this.content?.MONTHWISE === 'Y') {
      this.supplierquotaform.controls.periodType.setValue('monthWise');
    } else if (this.content?.WEEKWISE === 'Y') {
      this.supplierquotaform.controls.periodType.setValue('weekWise');
    }

    let selectedDivisions = this.content?.DIVISIONS.split(',');

    this.supplierquotaform.controls.metal_division.setValue(selectedDivisions);
  }


  loadgridvalues(){
    const existingACCodes = new Set();
    let ind_amount = 0;
    let months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let datas :any[]=[]; 
    this.maindetails =datas;


    let data = months.map((month, index) => ({
          "UNIQUEID": index+1,
          "SRNO": index+1,
          "PARTYCODE": this.supplierquotaform.controls.partycode.value,
          "FYEARCODE": this.supplierquotaform.controls.fin_year.value,
          "QTY_G": 0,
          "QTY_S": 0,
          "QTY_T": 0,
          "QTY_P": 0,
          "MONTH": month,
          "WEEK": "FIRST"
  }));
  console.log(data);
  this.maindetails.push(...data);
  }


  loadgridweek(){

    const existingACCodes = new Set();
    let ind_amount = 0;
    let months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    let weeks = ['First', 'Second', 'Third', 'Fourth'];
    
    let count = 1; 
    let data :any[]=[]; 
    this.maindetails =data;
    
    months.forEach((e: any) => {
      weeks.forEach((week: any) => {
        data.push({
          "UNIQUEID": 0,
          "SRNO": count++,     
          "PARTYCODE": this.supplierquotaform.controls.partycode.value,
          "FYEARCODE": this.supplierquotaform.controls.fin_year.value,
          "QTY_G": 0,
          "QTY_S": 0,
          "QTY_T": 0,
          "QTY_P": 0,
          "MONTH": e,         
          "WEEK": week        
      });
    });
    });    
      // this.maindetails.push(...data);

  }

  change_type_g(data: any, event: any) {
    const updatedSRNO = data.data.SRNO - 1; 
    if(updatedSRNO == 0){
      Swal.fire({
        title: 'User Confirmation',
        text: 'Do you want to apply this for all below items',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        }).then((result) => {
          if (result.value) {
            this.maindetails.forEach((e : any)=> {
              e.QTY_G = event.target.value;
            });
          }else{
            this.maindetails[updatedSRNO].QTY_G = this.commonService.decimalQuantityFormat(event.target.value,'METAL');//             event.target.value;
            console.log('Updated QTY_G:', this.maindetails[updatedSRNO].QTY_G);
          }
      })
    }else{
        this.maindetails[updatedSRNO].QTY_G = this.commonService.decimalQuantityFormat(event.target.value,'METAL');//             event.target.value;
        console.log('Updated QTY_G:', this.maindetails[updatedSRNO].QTY_G);
    }
  }

  change_type_s(data: any, event: any) {
    const updatedSRNO = data.data.SRNO - 1; 
    if(updatedSRNO == 0){
      Swal.fire({
        title: 'User Confirmation',
        text: 'Do you want to apply this for all below items',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        }).then((result) => {
          if (result.value) {
            this.maindetails.forEach((e : any)=> {
              e.QTY_S = event.target.value;
            });
          }else{
            this.maindetails[updatedSRNO].QTY_S = this.commonService.decimalQuantityFormat(event.target.value,'METAL');
            // this.maindetails[updatedSRNO].QTY_S = event.target.value;
            console.log('Updated QTY_S:', this.maindetails[updatedSRNO].QTY_S);
          }
      })
    }else{
      this.maindetails[updatedSRNO].QTY_S = this.commonService.decimalQuantityFormat(event.target.value,'METAL');//             event.target.value;
      console.log('Updated QTY_G:', this.maindetails[updatedSRNO].QTY_S);
    }
  }

  formSubmit(){

    Object.keys(this.supplierquotaform.controls).forEach((controlName) => {
      const control = this.supplierquotaform.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.supplierquotaform.controls
    ).some((controlName) => {
      const control = this.supplierquotaform.controls[controlName];
      return control.hasError("required") && control.touched;
    });

    // let metal_division = this.supplierquotaform.controls.metal_division.value;
    // console.log(metal_division);

    let metal_division = this.supplierquotaform.controls.metal_division.value;
    let metal_division_str = metal_division.join(',');
    console.log(metal_division_str);

    this.maindetails.forEach((e:any) => {
      e.PARTYCODE = this.supplierquotaform.controls.partycode.value;
      e.FYEARCODE = this.supplierquotaform.controls.fin_year.value;
    });




    const postData = {
      "MID": 0,
      "PARTYCODE":  this.supplierquotaform.controls.partycode.value,//"string",
      "FYEARCODE": this.supplierquotaform.controls.fin_year.value,//"string",
      "DIVISIONS": metal_division_str, //this.supplierquotaform.controls.metal_division.value,//"string",
      "SYSTEM_DATE": new Date(),
      "MONTHWISE": this.supplierquotaform.controls.periodType.value == "monthWise" ? true :false,   //true,
      "WEEKWISE": this.supplierquotaform.controls.periodType.value == "weekWise" ? true :false, //true,
      "supplierQuotaDetails": this.maindetails
      // [
      //   {
      //     "UNIQUEID": 0,
      //     "SRNO": 0,
      //     "PARTYCODE": "string",
      //     "FYEARCODE": "string",
      //     "QTY_G": 0,
      //     "QTY_S": 0,
      //     "QTY_T": 0,
      //     "QTY_P": 0,
      //     "MONTH": "string",
      //     "WEEK": "string"
      //   }
      // ]
    }

    // console.log(postData);return;

    if (this.flag === "EDIT") {
      let API = `SupplierQuota/UpdateSupplierQuota/${this.unq_id}/${this.fyearcode}`;
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
      let API = `SupplierQuota/InsertSupplierQuota`;
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

  detailsapi(fm_id: any) {
    if(this.flag == 'VIEW'){
      this.viewOnly = true;
    }

    let API = `SupplierQuota/GetSupplierQuotaList/${this.unq_id}/${this.fyearcode}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);

        if(this.dyndatas.WEEKWISE == true){
          this.dur_type = 'weekWise';
        }else{
          this.dur_type = 'monthWise';
        }



        // this.supplierquotaform.controls.partycode.setValue(this.dyndatas?.PARTYCODE);
        // this.flag = "EDIT";

        this.maindetails.push(...result.response.supplierQuotaDetails)

      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
    console.log(this.dyndatas?.PREFIX_CODE);
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
        const API = `SupplierQuota/DeleteSupplierQuota/${this.unq_id}/${this.fyearcode}`;
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
        // this.flag = "VIEW";
        this.activeModal.close("");
      }
    });
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

                    this.supplierquotaform.controls[formName].setValue(
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
      this.supplierquotaform.controls[formName].setValue("");
    });
  }

}
