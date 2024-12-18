import { Component, Input, OnInit, Renderer2 } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-pos-salesperson-target",
  templateUrl: "./pos-salesperson-target.component.html",
  styleUrls: ["./pos-salesperson-target.component.scss"],
})
export class PosSalespersonTargetComponent implements OnInit {
  BranchData: MasterSearchModel = {};
  maindetails: any = [];
  maindetails2: any = [];
  @Input() content!: any;
  unq_id: any;
  flag: any;
  dyndatas: any;
  private subscriptions: Subscription[] = [];
  viewOnly: boolean = false;
  curr_branch: any = localStorage.getItem("userbranch");
  disable_code: boolean = false;
  editMode: boolean = false;
  viewMode: boolean = false;
  diamond_drop: any[] = [];
  metal_drop: any[] = [];
  curr_target_on: any;
  _isdis_goldqty: boolean = false;
  _isdis_goldmakingcharge: boolean = false;
  codeedit: boolean = false;
  code_occurs: boolean = false;
  salesperson_occurs: boolean = false;

  salespersontargetform: FormGroup = this.formBuilder.group({
    code: ["", [Validators.required]],
    finyear: [""],
    datefrom: [""],
    dateto: [""],
    salesman: [""],
    diamond_division: ["F"],
    metal_division: ["F"],
    diamondjewellery: [""],
    goldmakingcharge: [""],
    goldquantity: [""],
    dia_division: [""],
    metal_divisions_: [""],
  });

  finyearcodedata: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 103,
    SEARCH_FIELD: "",
    SEARCH_HEADING: "FIN YEAR",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER:true
  };

  selectedfinyear(e: any) {
    console.log(e);
    this.salespersontargetform.controls.finyear.setValue(e.FYEARCODE);
    this.salespersontargetform.controls.datefrom.setValue(e.STARTYEAR);
    this.salespersontargetform.controls.dateto.setValue(e.ENDYEAR);
  }

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private commonService: CommonServiceService,
    private renderer: Renderer2
  ) {}

  SalesmanData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: "SALESPERSON_CODE",
    SEARCH_HEADING: "Salesman",
    SEARCH_VALUE: "",
    WHERECONDITION: "SALESPERSON_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER:true
  };

  salesmanSelected(event: any) {
    this.salespersontargetform.controls.salesman.setValue(
      event.SALESPERSON_CODE
    );
  }

  ngOnInit(): void {
    console.log(this.content);
    this.unq_id = this.content?.TARGET_CODE;
    console.log(this.unq_id);
    this.flag = this.content?.FLAG;
    // if(this.flag == undefined){
    this.getmetal_divisionvalues();
    this.getdiamond_divisionvalues();
    // }
    if (this.flag == "EDIT") {
      this.disable_code = true;
      this.editMode = false;
      this.codeedit = true;
    } else if (this.flag == "VIEW") {
      this.viewMode = true;
      this.codeedit = true;
      this.viewOnly = true;
    }
    if(this.flag == undefined){
      this.renderer.selectRootElement('#code')?.focus();
    }
    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == "VIEW") {
      this.code_occurs = true;
      this.detailsapi(this.unq_id);
    }

    this.flag = this.content
      ? this.content.FLAG
      : (this.content = { FLAG: "ADD" }).FLAG;

    this.getGridDataObjects(this.flag);
  }

  getmetal_divisionvalues() {
    let API = `POSTargetMaster/GetDiaDivisonsDropdown`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
      (result: any) => {
        console.log(result);
        this.diamond_drop = result.dynamicData[0];
        console.log(this.diamond_drop);
        const allDivisionCodes = this.diamond_drop.map(
          (option) => option.DIVISION_CODE
        );
        const diaDivisionControl =
          this.salespersontargetform?.get("dia_division");
        if (diaDivisionControl) {
          if (this.flag == undefined) {
            diaDivisionControl.setValue(allDivisionCodes);
          }
        }
      },
      (err: any) => {}
    );
    this.subscriptions.push(Sub);
  }

  getdiamond_divisionvalues() {
    let API = `POSTargetMaster/GetMetalDivisonsDropdown`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
      (result: any) => {
        console.log(result);
        this.metal_drop = result.dynamicData[0];
        console.log(this.metal_drop);
        const allDivisionCodes = this.metal_drop.map(
          (option) => option.DIVISION_CODE
        );
        const diaDivisionControl =
          this.salespersontargetform?.get("metal_divisions_");
        if (diaDivisionControl) {
          if (this.flag == undefined) {
            diaDivisionControl.setValue(allDivisionCodes);
          }
        }
      },
      (err: any) => {}
    );
    this.subscriptions.push(Sub);
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
    this.salespersontargetform.controls.code.setValue(
      this.content?.TARGET_CODE
    );
    // this.salespersontargetform.controls.datefrom.setValue(this.content?.FROM_DATE);
    const dateParts = this.content?.FROM_DATE.split("-");
    const formattedDate = new Date(
      +dateParts[2],
      +dateParts[1] - 1,
      +dateParts[0]
    );
    this.salespersontargetform.controls.datefrom.setValue(formattedDate);

    const dateParts2 = this.content?.TO_DATE.split("-");
    const formattedDate2 = new Date(
      +dateParts2[2],
      +dateParts2[1] - 1,
      +dateParts2[0]
    );
    this.salespersontargetform.controls.dateto.setValue(formattedDate2);

    // this.salespersontargetform.controls.dateto.setValue(this.content?.TO_DATE);
    this.salespersontargetform.controls.salesman.setValue(
      this.content?.SALESPERSON_CODE
    );
    this.salespersontargetform.controls.finyear.setValue(
      this.content?.FYEARCODE
    );
    this.salespersontargetform.controls.diamond_division.setValue(
      this.content?.DIA_DIVISIONS
    );
    this.salespersontargetform.controls.metal_division.setValue(
      this.content?.MTL_DIVISIONS
    );
    this.salespersontargetform.controls.goldquantity.setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(this.content?.GOLD_QTY),
        "METAL"
      )
    );
    this.salespersontargetform.controls.goldmakingcharge.setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(this.content?.GOLD_AMOUNT),
        "AMOUNT"
      )
    );
    this.salespersontargetform.controls.diamondjewellery.setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(this.content?.DIA_AMOUNT),
        "AMOUNT"
      )
    );
  }

  detailsapi(fm_id: any) {
    if (this.flag == "VIEW") {
      this.viewOnly = true;
    }

    let API = `PosSmanTargetMaster/GetPosSmanTargetMasterDetail/${this.unq_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
      (result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);
        this.salespersontargetform.controls.code.setValue(
          this.dyndatas?.TARGET_CODE
        );
        if (this.dyndatas?.DIA_DIVISIONS) {
          this.salespersontargetform.controls.dia_division.setValue(
            this.dyndatas.DIA_DIVISIONS.split(",")
          );
        }

        if (this.dyndatas?.MTL_DIVISIONS) {
          this.salespersontargetform.controls.metal_divisions_.setValue(
            this.dyndatas.MTL_DIVISIONS.split(",")
          );
        }

        if (this.dyndatas?.METAL_QTY == "F") {
          this.salespersontargetform.controls.diamond_division.setValue(
            this.dyndatas.METAL_QTY
          );
        } else if (this.dyndatas?.METAL_MKGCHARGE == "P") {
          this.salespersontargetform.controls.diamond_division.setValue(
            this.dyndatas.METAL_MKGCHARGE
          );
        }

        if (this.dyndatas?.PROFIT == "P") {
          this.salespersontargetform.controls.metal_division.setValue(
            this.dyndatas.PROFIT
          );
        } else if (this.dyndatas?.SALES_AMOUNT == "F") {
          this.salespersontargetform.controls.metal_division.setValue(
            this.dyndatas.SALES_AMOUNT
          );
        }
        this.maindetails2 = this.dyndatas.Details;

        //

        let total_value = this.dyndatas.GOLD_QTY;
        let total_gold = this.dyndatas.GOLD_AMOUNT;
        let split_value = total_value / 12;
        let split_gold = total_gold / 12;
        split_value = this.commonService.decimalQuantityFormat(
          this.commonService.emptyToZero(split_value),
          "METAL"
        );
        split_gold = this.commonService.decimalQuantityFormat(
          this.commonService.emptyToZero(split_gold),
          "AMOUNT"
        );

        let datas = this.maindetails2;
        if (Array.isArray(datas)) {
          datas.forEach((e: any) => {
            e.GOLD_QTY = split_value;
            e.GOLD_AMOUNT = split_gold;
          });
        }
        this.maindetails2 = datas;
      },
      (err: any) => {}
    );
    this.subscriptions.push(Sub);
    console.log(this.dyndatas?.PREFIX_CODE);
  }

  checkcode() {
    const prefixCodeControl = this.salespersontargetform.controls.code;
    if (!prefixCodeControl.value || prefixCodeControl.value.trim() === "") {
      this.commonService.toastErrorByMsgId("MSG1124");
      this.renderer.selectRootElement("#code")?.focus();
    }else{
      this.code_occurs = true;
    }
  }

  formSubmit() {
    // let sales_amt = 0;
    // let mkg_charge = 0;
    // let metal_qty = 0;

    // let data = this.maindetails2;
    // if (Array.isArray(data)) {
    //   data.forEach((e: any) => {
    //     sales_amt += parseFloat(e.DIA_TARGET);
    //     mkg_charge += parseFloat(e.GOLD_AMOUNT);
    //     metal_qty += parseFloat(e.GOLD_QTY);
    //   });
    // }

    Object.keys(this.salespersontargetform.controls).forEach((controlName) => {
      const control = this.salespersontargetform.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.salespersontargetform.controls
    ).some((controlName) => {
      const control = this.salespersontargetform.controls[controlName];
      return control.hasError("required") && control.touched;
    });

if(!requiredFieldsInvalid){

  if(!this.salesperson_occurs){
    this.commonService.toastErrorByMsgId("MSG1766");
    Swal.fire({
      text: "Sales Person is Mandatory",
      icon: "warning",
    });return;
  }else if(this.maindetails2.length>0){
    this.commonService.toastErrorByMsgId("MSG1200");
    Swal.fire({
      text: "Detail Record Not Found",
      icon: "warning",
    });return;
  }


  let dia_type = this.salespersontargetform.controls.diamond_division.value;
    if (dia_type != "") {
      dia_type = true;
    } else {
      dia_type = false;
    }

    let metal_type = this.salespersontargetform.controls.metal_division.value;
    if (metal_type != "") {
      metal_type = true;
    } else {
      metal_type = false;
    }

    const postData = {
      MID: 0,
      TARGET_CODE: this.salespersontargetform.controls.code.value,
      TARGET_DESCRIPTION: "",
      FROM_DATE: this.salespersontargetform.controls.datefrom.value,
      TO_DATE: this.salespersontargetform.controls.dateto.value,
      SYSTEM_DATE: new Date(),
      DIA_AMOUNT: this.salespersontargetform.controls.diamondjewellery.value,
      GOLD_AMOUNT: this.salespersontargetform.controls.goldmakingcharge.value,
      GOLD_QTY: this.salespersontargetform.controls.goldquantity.value,
      FYEARCODE: this.salespersontargetform.controls.finyear.value,
      DIA_DIVISIONS:
        this.salespersontargetform.controls.dia_division.value.join(","),
      MTL_DIVISIONS:
        this.salespersontargetform.controls.metal_divisions_.value.join(","),
      DIA_TARGET_TYPE: dia_type, //this.salespersontargetform.controls.code.value,//true,
      MTL_TARGET_TYPE: metal_type, // this.salespersontargetform.controls.code.value, //true,
      SALES_AMOUNT:
        this.salespersontargetform.controls.diamond_division.value == "F"
          ? "F"
          : "", //"s",
      METAL_MKGCHARGE:
        this.salespersontargetform.controls.metal_division.value == "P"
          ? "P"
          : "", //"s",
      METAL_QTY:
        this.salespersontargetform.controls.metal_division.value == "F"
          ? "F"
          : "", //"s",
      PROFIT:
        this.salespersontargetform.controls.diamond_division.value == "P"
          ? "P"
          : "", //"s",
      SALESPERSON_CODE: this.salespersontargetform.controls.salesman.value,
      Details: this.maindetails2,
    };

    // console.log(postData);return;

    if (this.flag === "EDIT") {
      let API = `PosSmanTargetMaster/UpdatePosSmanTargetMaster/${this.unq_id}`;
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
      let API = `PosSmanTargetMaster/InsertPosSmanTargetMaster`;
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
        const API = `PosSmanTargetMaster/DeletePosSmanTargetMaster/${this.unq_id}`;
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
        this.activeModal.close("");
      }
    });
  }

  BranchDataSelected(e: any) {}

  onSelectionChanged(event:any) {
    console.log(event);
    if(event.selectedRowKeys.length >0){
      this.salesperson_occurs = true;
    }else{
      this.salesperson_occurs = false;
    }

  }

  close(data?: any) {
    if (data) {
      this.viewMode = true;
      this.activeModal.close(data);
      return;
    }
    if (this.content && this.content.FLAG == "VIEW") {
      this.activeModal.close(data);
      return;
    }
    Swal.fire({
      title: "Do you want to exit?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    });
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
                    this.salespersontargetform.controls[formName].setValue(
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
      this.salespersontargetform.controls[formName].setValue("");
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
            this.salespersontargetform.controls[ctrl].setValue(value);
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
        this.salespersontargetform.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }

  changediamond_amt(data: any, event: any) {
    const updatedSRNO = data.data.SRNO - 1;
    const budgetedAmt = parseFloat(event.target.value);
    if (!isNaN(budgetedAmt)) {
      this.maindetails2[updatedSRNO].DIA_TARGET = budgetedAmt.toFixed(2);
      let amount = this.maindetails2[updatedSRNO].DIA_TARGET;
      let accode = data.data.ACCODE;
      this.calculate_total_diamond();
    } else {
      console.error("Invalid amount:", event.target.value);
    }
  }

  calculate_total_diamond() {
    let total = 0;
    let data = this.maindetails2;
    if (Array.isArray(data)) {
      data.forEach((e: any) => {
        total += parseFloat(e.DIA_TARGET);
      });
    } else {
      console.error("Data is not an array", data);
    }
    this.salespersontargetform.controls.diamondjewellery.setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(total),
        "AMOUNT"
      )
    );
  }

  chnagegold_amt(data: any, event: any) {
    const updatedSRNO = data.data.SRNO - 1;
    const budgetedAmt = parseFloat(event.target.value);
    if (!isNaN(budgetedAmt)) {
      this.maindetails2[updatedSRNO].GOLD_AMOUNT = budgetedAmt.toFixed(2);
      let amount = this.maindetails2[updatedSRNO].GOLD_AMOUNT;
      let accode = data.data.ACCODE;
      this.calculate_total_gold();
    } else {
      console.error("Invalid amount:", event.target.value);
    }
  }

  calculate_total_gold() {
    let total = 0;
    let data = this.maindetails2;
    if (Array.isArray(data)) {
      data.forEach((e: any) => {
        total += parseFloat(e.GOLD_AMOUNT);
      });
    } else {
      console.error("Data is not an array", data);
    }
    this.salespersontargetform.controls.goldmakingcharge.setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(total),
        "AMOUNT"
      )
    );
  }

  changegold_qty(data: any, event: any) {
    const updatedSRNO = data.data.SRNO - 1;
    const budgetedAmt = parseFloat(event.target.value);
    if (!isNaN(budgetedAmt)) {
      this.maindetails2[updatedSRNO].GOLD_QTY = budgetedAmt.toFixed(2);
      let amount = this.maindetails2[updatedSRNO].GOLD_QTY;
      let accode = data.data.ACCODE;
      this.calculate_total_qty();
    } else {
      console.error("Invalid amount:", event.target.value);
    }
  }

  calculate_total_qty() {
    let total = 0;
    let data = this.maindetails2;
    if (Array.isArray(data)) {
      data.forEach((e: any) => {
        total += parseFloat(e.GOLD_QTY);
      });
    } else {
      console.error("Data is not an array", data);
    }
    this.salespersontargetform.controls.goldquantity.setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(total),
        "METAL"
      )
    );
  }

  addmonthtosubgrid() {
    let total_value =
      this.salespersontargetform.controls.diamondjewellery.value;
    let split_value = total_value / 12;
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let data = months.map((month, index) => ({
      TARGET_CODE: this.salespersontargetform.controls.code.value,
      BRANCH_CODE: this.curr_branch,
      SRNO: index + 1,
      UNIQUEID: index + 1,
      MONTH: month,
      FYEARCODE: this.salespersontargetform.controls.finyear.value,
      DIA_TARGET: split_value,
      MTL_TARGET: 0,
      SALESPERSON_CODE: this.salespersontargetform.controls.salesman.value,
      AMOUNT: 0,
    }));
    console.log(data);
    this.maindetails2 = data;
  }

  setdia_amount() {
    let total_value =
      this.salespersontargetform.controls.goldmakingcharge.value;
    let split_value = total_value / 12;
    split_value = this.commonService.decimalQuantityFormat(
      this.commonService.emptyToZero(split_value),
      "AMOUNT"
    );
    let datas = this.maindetails2;
    if (Array.isArray(datas)) {
      datas.forEach((e: any) => {
        e.GOLD_AMOUNT = split_value;
      });
    } else {
      console.error("datas is not an array:", datas);
    }
    this.maindetails2 = datas;
  }

  setgold_amt() {
    let total_value = this.salespersontargetform.controls.goldquantity.value;
    let split_value = total_value / 12;
    split_value = this.commonService.decimalQuantityFormat(
      this.commonService.emptyToZero(split_value),
      "AMOUNT"
    );
    let datas = this.maindetails2;
    if (Array.isArray(datas)) {
      datas.forEach((e: any) => {
        e.GOLD_QTY = split_value;
      });
    } else {
      console.error("datas is not an array:", datas);
    }
    this.maindetails2 = datas;
  }

  // calculate_total(amount:any,accode:any ) {

  //   let ind_amount = amount / 12;
  //   let details = this.maindetails;
  //   let loc_data: any[] = [];
  //   details.forEach((e: any) => {
  //     if (e.ACCODE == accode) {
  //       console.log(e.dtlMonth);
  //       loc_data = e.dtlMonth;
  //     }
  //   });
  //   loc_data.forEach((s: any) => {
  //     s.BUDGET_AMOUNT = ind_amount.toFixed(2);
  //   });
  // }

  disabletable() {
    // if(this.curr_target_on == undefined){
    //   this.curr_target_on = this.salespersontargetform.controls.metal_division.value
    // }
    let cur_value = this.salespersontargetform.controls.metal_division.value;

    // if(cur_value == 'F'){

    //   this.salespersontargetform.controls['goldmakingcharge'].disable();
    //   this.salespersontargetform.controls['goldquantity'].enable();
    //   this.salespersontargetform.controls['goldquantity'].reset();

    // }else{
    //   // console.log(cur_value);
    //   this.salespersontargetform.controls['goldquantity'].disable();
    //   this.salespersontargetform.controls['goldmakingcharge'].enable();
    //   this.salespersontargetform.controls['goldmakingcharge'].reset();

    // }

    // if(cur_value != this.curr_target_on){
    Swal.fire({
      title: "Target Master",
      text: "Changing Target-on Would clear Target Values ! Do you want to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.value) {
        let data = this.maindetails2;

        if (cur_value == "F") {
          this.salespersontargetform.controls["goldmakingcharge"].disable();
          this.salespersontargetform.controls["goldquantity"].enable();
          this.salespersontargetform.controls["goldquantity"].reset();
          let data = this.maindetails2;
          if (Array.isArray(data)) {
            data.forEach((e: any) => {
              e.GOLD_QTY = this.commonService.decimalQuantityFormat(
                this.commonService.emptyToZero(0),
                "AMOUNT"
              );
            });
          }
        } else {
          this.salespersontargetform.controls["goldquantity"].disable();
          this.salespersontargetform.controls["goldmakingcharge"].enable();
          this.salespersontargetform.controls["goldmakingcharge"].reset();

          let data = this.maindetails2;
          if (Array.isArray(data)) {
            data.forEach((e: any) => {
              e.GOLD_AMOUNT = this.commonService.decimalQuantityFormat(
                this.commonService.emptyToZero(0),
                "AMOUNT"
              );
            });
          }
        }

        this.maindetails2 = data;
      } else {
      }
    });
    // }
    this.curr_target_on = cur_value;
  }

  getGridDataObjects(FLAG: any) {
    let API = `POSTargetMaster/GetPosTargetSalesmanGrid/DAR/${FLAG}`;
    let sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
      (result) => {
        if (result.status.trim() === "Success") {
          console.log(result.dynamicData[0]);
          this.maindetails = result.dynamicData[0];
        }
      },
      (err) => {
        console.error("Error fetching data:", err);
        this.commonService.toastErrorByMsgId("MSG1531");
      }
    );
  }
}
