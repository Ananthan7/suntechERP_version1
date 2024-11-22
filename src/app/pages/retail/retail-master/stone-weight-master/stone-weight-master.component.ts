import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stone-weight-master',
  templateUrl: './stone-weight-master.component.html',
  styleUrls: ['./stone-weight-master.component.scss']
})
export class StoneWeightMasterComponent implements OnInit {
  viewOnly: boolean = false;
  private subscriptions: Subscription[] = [];
  data: any;
  viewMode: boolean = false;
  editMode: boolean = false;
  @Input() content!: any;
  mid: any;
  branchCode?: any = localStorage.getItem("userbranch");
  flag: any;



  enteredCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Sieve Set',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  enteredCodeSelected(e: any) {
    console.log(e);
    this.stoneweightmaster.controls.sieveset.setValue(e.sieveset);

  }

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    // private apiService: SuntechAPIService,
    private commonService: CommonServiceService,

  ) { }

  stoneweightmaster: FormGroup = this.formBuilder.group({
    mid: [""],
    sieveset: [""],
    division: ["L"],
    sievefrom: [""],
    sievefromdesc: [""],
    sizefrom: [""],
    pcs: ["0"],
    pointerwt: ["0.0000"],
    shape: ["RD"],
    sieveto: [""],
    sievetodesc: [""],
    sizeto: [""],
    variance1: ["0.00"],
    variance2: ["0.00"],

  });

  sieveSetcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 86,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve Set Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIEVE SET MASTER' AND CODE NOT IN(SELECT SIEVE_SET  FROM DIASIZEWT)",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  sieveSetcodeSelected(value: any) {
    console.log(value);
    this.stoneweightmaster.controls.sieveset.setValue(value.CODE);
  }

  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  divisionCodeSelected(e: any) {
    console.log(e);
    this.stoneweightmaster.controls.division.setValue(e.DIVISION_CODE);
  }

  sieveFromCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'types',
    SEARCH_HEADING: 'SIEVE MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "types = 'SIEVE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  sievecodeselected(e: any) {
    console.log(e);
    this.stoneweightmaster.controls.sievefrom.setValue(e.CODE);
    this.stoneweightmaster.controls.sievefromdesc.setValue(e.DESCRIPTION);
  }

  sieveToCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'types',
    SEARCH_HEADING: 'Sieve To',
    SEARCH_VALUE: '',
    WHERECONDITION: "types = 'SIEVE MASTER' AND CODE > ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  sievetoselected(e: any) {
    console.log(e);
    this.stoneweightmaster.controls.sieveto.setValue(e.CODE);
    this.stoneweightmaster.controls.sievetodesc.setValue(e.DESCRIPTION);
  }

  ShapecodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  ShapecodeSelected(value: any) {
    console.log(value);
    this.stoneweightmaster.controls.shape.setValue(value.CODE);
  }

  sizeFromCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size From',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIZE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  sizefromselected(e: any) {
    console.log(e);
    this.stoneweightmaster.controls.sizefrom.setValue(e.CODE);

  }

  sizeToCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size To',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIZE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  sizetoselected(e: any) {
    console.log(e);
    this.stoneweightmaster.controls.sizeto.setValue(e.CODE);
  }

  ngOnInit(): void {
    console.log(this.content);
    this.flag = this.content?.FLAG;
    if (this.content?.FLAG == "EDIT" || this.content?.FLAG == "VIEW") {
      if (this.content?.FLAG == "VIEW") {
        this.viewOnly = true;
        this.viewMode = true;
      }else {
        this.viewOnly = false;
        this.editMode = true;

      }
      this.mid = this.content.MID;
      this.stoneweightmaster.controls.division.setValue(this.content.DIVCODE);
      this.stoneweightmaster.controls.shape.setValue(this.content.SHAPE);
      this.stoneweightmaster.controls.sieveto.setValue(this.content.SIEVE_TO);
      this.stoneweightmaster.controls.sievefrom.setValue(this.content.SIEVE);
      this.stoneweightmaster.controls.sieveset.setValue(this.content.SIEVE_SET);
      this.stoneweightmaster.controls.sizefrom.setValue(this.content.SIZE_FROM);
      this.stoneweightmaster.controls.sizeto.setValue(this.content.SIZE_TO);
      this.stoneweightmaster.controls.pcs.setValue(this.content.PCS);
      this.stoneweightmaster.controls.variance1.setValue(this.content.VARIANCE);
      this.stoneweightmaster.controls.pointerwt.setValue(this.content.POINTER_WT);
      this.stoneweightmaster.controls.variance2.setValue(this.content.VARIANCE_POINTERWT);
      this.stoneweightmaster.controls.sievefromdesc.setValue(this.content.SIEVEFROM_DESC);
      this.stoneweightmaster.controls.sievetodesc.setValue(this.content.SIEVETO_DESC);
      this.stoneweightmaster.controls.sieveto.setValue(this.content.SIEVE_TO);
    }
    else if (this.content?.FLAG == "DELETE") {
      this.viewOnly = true;
      this.mid = this.content.MID;
      this.stoneweightmaster.controls.division.setValue(this.content.DIVCODE);
      this.stoneweightmaster.controls.shape.setValue(this.content.SHAPE);
      this.stoneweightmaster.controls.sieveto.setValue(this.content.SIEVE_TO);
      this.stoneweightmaster.controls.sievefrom.setValue(this.content.SIEVE);
      this.stoneweightmaster.controls.sieveset.setValue(this.content.SIEVE_SET);
      this.stoneweightmaster.controls.sizefrom.setValue(this.content.SIZE_FROM);
      this.stoneweightmaster.controls.sizeto.setValue(this.content.SIZE_TO);
      this.stoneweightmaster.controls.pcs.setValue(this.content.PCS);
      this.stoneweightmaster.controls.variance1.setValue(this.content.VARIANCE);
      this.stoneweightmaster.controls.pointerwt.setValue(this.content.POINTER_WT);
      this.stoneweightmaster.controls.variance2.setValue(this.content.VARIANCE_POINTERWT);
      this.stoneweightmaster.controls.sievefromdesc.setValue(this.content.SIEVEFROM_DESC);
      this.stoneweightmaster.controls.sievetodesc.setValue(this.content.SIEVETO_DESC);
      this.stoneweightmaster.controls.sieveto.setValue(this.content.SIEVE_TO);
      this.deleteTableData();
    }
  }

  formSubmit() {

    if (this.content && this.content.FLAG == "EDIT") {
      this.updatestoneweight();
      return;
    }

    if (this.stoneweightmaster.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API = `Manufacturing/Master/DiaSizeWt/InsertDiaSizeWt`;
    let postData = {
      "MID": 0,
      "DIVCODE": this.stoneweightmaster.controls.division.value,
      "SHAPE": this.stoneweightmaster.controls.shape.value,
      "SIEVE": this.stoneweightmaster.controls.sievefrom.value,
      "SIEVE_SET": this.stoneweightmaster.controls.sieveset.value,
      "SIZE_FROM": this.stoneweightmaster.controls.sizefrom.value,
      "SIZE_TO": this.stoneweightmaster.controls.sizeto.value,
      "PCS": this.stoneweightmaster.controls.pcs.value,
      "CARAT": this.stoneweightmaster.controls.pcs.value,
      "VARIANCE": this.stoneweightmaster.controls.variance1.value,
      "POINTER_WT": this.stoneweightmaster.controls.pointerwt.value,
      "VARIANCE_POINTERWT": this.stoneweightmaster.controls.variance2.value,
      "SIEVE_TO": this.stoneweightmaster.controls.sieveto.value,
      "RRR_PRICE_UPDATED": true,
      "NAVSEQNO": 0,
      "SIEVEFROM_DESC": this.stoneweightmaster.controls.sievefromdesc.value,
      "SIEVETO_DESC": this.stoneweightmaster.controls.sievetodesc.value
    };
    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status.trim() == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.stoneweightmaster.reset();
                  // this.flag='EDIT';
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.toastr.error("Not saved");
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);


  }

  updatestoneweight() {
    let API = `Manufacturing/Master/DiaSizeWt/UpdateDiaSizeWt/${this.mid}`;
    let postData = {
      "MID": 0,
      "DIVCODE": this.stoneweightmaster.controls.division.value,
      "SHAPE": this.stoneweightmaster.controls.shape.value,
      "SIEVE": this.stoneweightmaster.controls.sievefrom.value,
      "SIEVE_SET": this.stoneweightmaster.controls.sieveset.value,
      "SIZE_FROM": this.stoneweightmaster.controls.sizefrom.value,
      "SIZE_TO": this.stoneweightmaster.controls.sizeto.value,
      "PCS": this.stoneweightmaster.controls.pcs.value,
      "CARAT": this.stoneweightmaster.controls.pcs.value,
      "VARIANCE": this.stoneweightmaster.controls.variance1.value,
      "POINTER_WT": this.stoneweightmaster.controls.pointerwt.value,
      "VARIANCE_POINTERWT": this.stoneweightmaster.controls.variance2.value,
      "SIEVE_TO": this.stoneweightmaster.controls.sieveto.value,
      "RRR_PRICE_UPDATED": true,
      "NAVSEQNO": 0,
      "SIEVEFROM_DESC": this.stoneweightmaster.controls.sievefromdesc.value,
      "SIEVETO_DESC": this.stoneweightmaster.controls.sievetodesc.value
    };
    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status.trim() == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.stoneweightmaster.reset();
                  // this.flag='EDIT';
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.toastr.error("Not saved");
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }


  // close(data?: any) {
  //   if(data == 'reloadMainGrid'){
  //     this.activeModal.close(data);
  //   }else{
  //     if(this.flag == undefined || this.flag == 'EDIT'){
  //       Swal.fire({
  //         title: "Confirm",
  //         text: "Are you sure you want to close this window?",
  //         icon: "warning",
  //         showCancelButton: true,
  //         confirmButtonText: 'Yes',
  //         cancelButtonText: 'No'
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           this.activeModal.close(data);
  //         }
  //       });
  //     }else{
  //       this.activeModal.close(data);
  //     }
  //   }
  //   // console.log(this.flag)
  
  // }
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

  deleteTableData() {
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
        const API = `Manufacturing/Master/DiaSizeWt/DeleteDiaSizeWt/${this.mid}`;
        const Sub: Subscription = this.dataService
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



  addTableData() {

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

    const sub: Subscription = this.dataService
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

                    this.stoneweightmaster.controls[formName].setValue(
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
      this.stoneweightmaster.controls[formName].setValue("");
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
            this.stoneweightmaster.controls[ctrl].setValue(value);
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
        this.stoneweightmaster.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }
}
