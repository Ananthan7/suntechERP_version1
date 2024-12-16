import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-receipt-modes",
  templateUrl: "./receipt-modes.component.html",
  styleUrls: ["./receipt-modes.component.scss"],
})
export class ReceiptModesComponent implements OnInit {
  @ViewChild("codeField") codeField!: ElementRef;
  @ViewChild("overlayAccodeData") overlayAccodeData!: MasterSearchComponent;
  @ViewChild("overlayCommissionAccount")
  overlayCommissionAccount!: MasterSearchComponent;
  @ViewChild("overlayBankCode") overlayBankCode!: MasterSearchComponent;
  @ViewChild("overlayInputVat") overlayInputVat!: MasterSearchComponent;
  @ViewChild("overlayOutputVat") overlayOutputVat!: MasterSearchComponent;

  @Input() content!: any;
  private subscriptions: Subscription[] = [];

  AccodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION:
      " ACCOUNT_MODE in ('G','B','L') AND AC_OnHold = 0 AND BRANCH_CODE='STRBRANCHCODE'",
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "ACCODE",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  bankCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION:
      " ACCOUNT_MODE in ('G','B','L') AND AC_OnHold = 0 AND BRANCH_CODE='STRBRANCHCODE'",
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "BANK CODE",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  commisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION:
      " ACCOUNT_MODE in ('L') AND AC_OnHold = 0 AND BRANCH_CODE='STRBRANCHCODE '",
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "COMMISION",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  inputVatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION:
      "  ACCOUNT_MODE in ('L','G')  and BRANCH_CODE = 'STRBRANCHCODE ' AND AC_OnHold = 0 ",
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "INPUT VAT",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  outputVatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    WHERECONDITION:
      "  ACCOUNT_MODE in ('L','G')  and BRANCH_CODE = 'STRBRANCHCODE ' AND AC_OnHold = 0 ",
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "OUTPUT VAT",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  flag: any;
  code: any;
  RcmCreditCard!: boolean;
  excludeTax!: boolean;
  LoyaltyItem!: boolean;
  modeDorpdown!: any[];
  fetchedBranchDataParam: any= [];
  fetchedBranchData: any[] =[];
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  isEnableRCM!:boolean

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {}

  receiptModesMainForm: FormGroup = this.formBuilder.group({
    mode: [""],
    code: [""],
    desc: [""],
    accode: [""],
    commision: [""],
    currencyCode: [""],
    commisionAccount: [""],
    bank: [""],
    maxCommAcc: [""],
    branches: [""],
    inputVat: [""],
    outputVat: [""],
    vat: [""],
    rcmInput: [""],
    rcmOutputVat: [""],
    loyalty: [""],
    rcmCredit: [""],
    excludeTax: [""],
    
  });

  ngOnInit(): void {


    this.flag = this.content
      ? this.content.FLAG
      : (this.content = { FLAG: "ADD" }).FLAG;

    this.initialController(this.flag, this.content);
    this.setFlag(this.flag, this.content);
  }

  ngAfterViewInit(): void {
    if (this.flag === "ADD") {
      this.codeField.nativeElement.focus();
    }
  }

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "ADD") {
    }
    if (FLAG === "VIEW") {
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
    this.code = DATA.CREDIT_CODE;
    console.log(DATA);

    this.receiptModesMainForm.controls["mode"].setValue(DATA.MODE.toString());
    this.receiptModesMainForm.controls["code"].setValue(DATA.CREDIT_CODE);
    this.receiptModesMainForm.controls["desc"].setValue(DATA.DESCRIPTION);
    this.receiptModesMainForm.controls["accode"].setValue(DATA.ACCODE);
    this.receiptModesMainForm.controls["commision"].setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(DATA.COMMISION),
        "METAL"
      )
    );
    this.receiptModesMainForm.controls["currencyCode"].setValue(
      DATA.CURRENCY_CODE
    );
    this.receiptModesMainForm.controls["commisionAccount"].setValue(
      DATA.COMMISION_CODE
    );
    this.receiptModesMainForm.controls["bank"].setValue(DATA.BANK);
    this.receiptModesMainForm.controls["maxCommAcc"].setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(DATA.MAXCOMMAMT),
        "METAL"
      )
    );
    this.receiptModesMainForm.controls["branches"].setValue(DATA.CC_BRANCHCODE);
    this.receiptModesMainForm.controls["loyalty"].setValue(DATA.LOYALTYITEM);
    this.receiptModesMainForm.controls["rcmCredit"].setValue(
      DATA.RCMCREDITCARD
    );
    this.receiptModesMainForm.controls["excludeTax"].setValue(
      DATA.EXCLUDETAX === 1 ? true : false
    );
    this.receiptModesMainForm.controls["rcmInput"].setValue(
      DATA.RCMVATINPUTACCODE
    );
    this.receiptModesMainForm.controls["rcmOutputVat"].setValue(
      DATA.RCMVATOUTPUTACCODE
    );
    this.receiptModesMainForm.controls["inputVat"].setValue(
      DATA.VATACCODEINPUT
    );
    this.receiptModesMainForm.controls["outputVat"].setValue(DATA.VATACCODE);
    this.receiptModesMainForm.controls["vat"].setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(DATA.VATPER),
        "METAL"
      )
    );
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
        const API = `CreditCardMaster/${this.code}`;
        const Sub: Subscription = this.apiService
          .deleteDynamicAPI(API)
          .subscribe({
            next: (response) => {
              Swal.fire({
                title:
                  response.status === "Success"
                    ? "Deleted Successfully"
                    : "Not Deleted",
                icon: response.status === "Success" ? "success" : "error",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });

              response.status === "Success" &&
                this.close("reloadMainGrid", true);
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
        this.close("reloadMainGrid", true);
      }
    });
  }

  close(data?: any, calling?: boolean) {
    if (this.flag !== "VIEW" && !calling) {
      Swal.fire({
        title: "Are you sure you want to close this ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Close!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.activeModal.close(data);
        }
      });
    } else {
      this.activeModal.close(data);
    }
  }

  receiptModesMainFormSubmit() {
    Object.keys(this.receiptModesMainForm.controls).forEach((controlName) => {
      const control = this.receiptModesMainForm.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.receiptModesMainForm.controls
    ).some((controlName) => {
      const control = this.receiptModesMainForm.controls[controlName];
      return control.hasError("required") && control.touched;
    });

    if (!requiredFieldsInvalid) {
      const postData = {
        MODE: this.receiptModesMainForm.value.mode,
        CREDIT_CODE: this.receiptModesMainForm.value.code,
        DESCRIPTION: this.receiptModesMainForm.value.desc,
        ACCODE: this.receiptModesMainForm.value.accode,
        ACCOUNT_HEAD: "",
        BANK: this.receiptModesMainForm.value.bank,
        CURRENCY_CODE: this.receiptModesMainForm.value.currencyCode,
        COMMISION: Number(this.receiptModesMainForm.value.commision),
        COMMISION_CODE: this.receiptModesMainForm.value.commisionAccount,
        MID: 0,
        SYSTEM_DATE: new Date(),
        POSFILTER: 0,
        CC_BRANCHCODE: this.receiptModesMainForm.value.branches,
        VATACCODE: "string",
        VATCOMMISION: 0,
        LOYALTYITEM: this.LoyaltyItem,
        MAXCOMMAMT: this.receiptModesMainForm.value.maxCommAcc,
        EXCLUDETAX: this.excludeTax === true ? 1 : 0,
        VATACCODEINPUT: this.receiptModesMainForm.value.inputVat,
        VATPER: this.receiptModesMainForm.value.vat,
        RCMCREDITCARD: this.RcmCreditCard,
        RCMVATINPUTACCODE: this.receiptModesMainForm.value.rcmInput,
        RCMVATOUTPUTACCODE: this.receiptModesMainForm.value.rcmOutputVat,
      };

      if (this.flag === "EDIT") {
        let API = `CreditCardMaster/${this.code}`;
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

              this.close("reloadMainGrid", true);
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
        let API = `CreditCardMaster`;
        let sub: Subscription = this.apiService
          .postDynamicAPI(API, postData)
          .subscribe((result) => {
            if (result.status.trim() === "Success") {
              Swal.fire({
                title: "Success",
                text: result.message
                  ? result.message
                  : "Inserted successfully!",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });

              this.close("reloadMainGrid", true);
            } else {
              Swal.fire({
                title: "Failed",
                text: result.message
                  ? result.message
                  : "Inserted successfully!",
                icon: "error",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });
            }
          });
      }
    } else {
      this.commonService.showSnackBarMsg("Please fill mandatory fields.");
    }
  }

  preventInvalidInput(event: KeyboardEvent) {
    if (["e", "E", "+", "-"].includes(event.key)) {
      event.preventDefault();
    }
  }

  matBoxChecker(event: MatCheckboxChange, controller: string) {
    let checked = event.checked;

    switch (controller) {
      case "loyalty":
        this.LoyaltyItem = checked;
        break;
      case "rcmCredit":
        this.isEnableRCM = checked
        this.cdr.detectChanges()
        this.RcmCreditCard = checked;
        break;
      case "excludeTax":
        this.excludeTax = checked;
        break;

      default:
        break;
    }
  }

  setFlag(currentFlag: string, DATA: any): void {
    this.flag = currentFlag;

    switch (this.flag) {
      

      case "ADD":

      this.modeDorpdown = this.getUniqueValues(
        this.commonService.getComboFilterByID("Receipt Mode"),
        "ENGLISH"
      );
        this.receiptModesMainForm.controls["mode"].setValue(this.modeDorpdown[0].SRNO)
        console.log(this.modeDorpdown);
        

        break;
      case "VIEW":
        this.receiptModesMainForm.controls["loyalty"].disable();
        this.receiptModesMainForm.controls["rcmCredit"].disable();
        this.receiptModesMainForm.controls["excludeTax"].disable();

        break;

      default:
        break;
    }
  }

  getUniqueValues(List: any[], field: string) {
    return List.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => t[field] === item[field] && t[field] !== "")
    );
  }

  openTab(event: KeyboardEvent, formControlName: string) {
    const control = this.receiptModesMainForm.get(formControlName);
    if (
      (event.key === "Tab" || event.key === "Enter") &&
      control?.value === "" &&
      control?.valid
    ) {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "accode":
        this.overlayAccodeData.showOverlayPanel(event);
        break;

      case "commisionAccount":
        this.overlayCommissionAccount.showOverlayPanel(event);
        break;
      case "bank":
        this.overlayBankCode.showOverlayPanel(event);
        break;
      case "inputVat":
        this.overlayInputVat.showOverlayPanel(event);
        break;

      case "outputVat":
        this.overlayOutputVat.showOverlayPanel(event);
        break;
      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
      if (controller.length === modelfield.length) {
        controller.forEach((ctrl, index) => {
          const field = modelfield[index];
          const value = e[field];
          if (value !== undefined) {
            this.receiptModesMainForm.controls[ctrl].setValue(value);
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
        this.receiptModesMainForm.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }

  SPvalidateLookupFieldModified(
    event: any,
    LOOKUPDATA: MasterSearchModel,
    FORMNAMES: string[],
    lookupFields?: string[]
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
            console.log("In");

            if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE) {
              let searchResult = this.commonService.searchAllItemsInArray(
                data,
                LOOKUPDATA.SEARCH_VALUE
              );

              console.log("Up");

              console.log("Filtered Search Result:", searchResult);

              if (searchResult?.length) {
                const matchedItem = searchResult[0];

                FORMNAMES.forEach((formName, index) => {
                  const field = lookupFields?.[index];
                  if (field && field in matchedItem) {
                    this.receiptModesMainForm.controls[formName].setValue(
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
      this.receiptModesMainForm.controls[formName].setValue("");
    });
  }

  prefillScreenValues(){
    if ( Object.keys(this.content).length > 0) {
      //  this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
    }
    else{
      const userBranch = localStorage.getItem('userbranch');
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.receiptModesMainForm.controls.branch.setValue(formattedUserBranch);
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData= this.fetchedBranchDataParam?.split("#")
   
      this.dateToPass = {
        fromDate:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!
      };
    }
  }

  selectedData(data: any) {
    console.log(data)
    // let content= ``, content2 =``,  content3 =``, content4 =``
    let content = `Current Selected Branches:  \n`
    let content2 = `Current Selected Divisions:  \n`
    let content3 = `Current Selected Area:  \n`
    let content4 = `Current Selected B category:  \n`
    let branchDivisionData = '';
    if(data.BranchData){
      // content = `Current Selected Branches:  \n`
      data.BranchData.forEach((Bdata: any)=>{
        branchDivisionData += Bdata.BRANCH_CODE+'#'
        content += Bdata.BRANCH_CODE ? `${Bdata.BRANCH_CODE}, ` : ''
      }) 
    }

    if(data.DivisionData){
      // content2 = `Current Selected Divisions:  \n`
      data.DivisionData.forEach((Ddata: any)=>{
        branchDivisionData += Ddata.DIVISION_CODE+'#'
        content2 += Ddata.DIVISION_CODE ? `${Ddata.DIVISION_CODE}, ` : ''
      }) 
    }

    if(data.AreaData){
      // content3 = `Current Selected Area:  \n`
      data.AreaData.forEach((Adata: any)=>{
        branchDivisionData += Adata.AREA_CODE+'#'
        content3 += Adata.AREA_CODE ? `${Adata.AREA_CODE}, ` : ''
      }) 
    }

    if(data.BusinessCategData){
      // content4 = `Current Selected B category:  \n`
      data.BusinessCategData.forEach((BCdata: any)=>{
        branchDivisionData += BCdata.CATEGORY_CODE+'#'
        content4 += BCdata.CATEGORY_CODE ? `${BCdata.CATEGORY_CODE}, ` : ''
      }) 
    }

    content = content.replace(/, $/, '');
    content2 = content2.replace(/, $/, '');
    content3 = content3.replace(/, $/, '');
    content4 = content4.replace(/, $/, '');
    this.branchDivisionControlsTooltip = content +'\n'+content2 +'\n'+ content3 +'\n'+ content4

    this.formattedBranchDivisionData = branchDivisionData
    this.receiptModesMainForm.controls.branches.setValue(this.formattedBranchDivisionData);
  }
}
