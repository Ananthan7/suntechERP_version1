import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';


@Component({
  selector: 'app-component-master',
  templateUrl: './component-master.component.html',
  styleUrls: ['./component-master.component.scss']
})
export class ComponentMasterComponent implements OnInit {
  @ViewChild('overlaycodedescSearch') overlaycodedescSearch!: MasterSearchComponent;
  @ViewChild('overlaysizeSetSearch') overlaysizeSetSearch!: MasterSearchComponent;
  @ViewChild('overlaytypeSearch') overlaytypeSearch!: MasterSearchComponent;
  @ViewChild('overlaysizeSearch') overlaysizeSearch!: MasterSearchComponent;
  @ViewChild('overlaycategorySearch') overlaycategorySearch!: MasterSearchComponent;
  @ViewChild('overlayshapeSearch') overlayshapeSearch!: MasterSearchComponent;
  @ViewChild('overlaysettingTypeSearch') overlaysettingTypeSearch!: MasterSearchComponent;
  @ViewChild('overlayprocessSeqSearch') overlayprocessSeqSearch!: MasterSearchComponent;
  @ViewChild('overlaycostCenterSearch') overlaycostCenterSearch!: MasterSearchComponent;

  @Input() content!: any;
  currentDate: any = new Date();
  isPCSDisabled: boolean = false;
  iskaratDisabled: boolean = false;
  tableData: any[] = [];
  maindetails: any[] = [];
  selectedIndexes: any = [];
  columnhead: any[] = ['Srno', 'Div.', 'Stock Code', 'Karat', 'Stock Type', 'Pcs', 'Wt/Ct', 'Color', 'Clarity', 'Shape', 'Sieve Std.', 'Description', 'Size', 'Process Type', 'Remarks', 'Pointer Wt', 'Ext.Clarity', 'Sieve From', 'Description', 'Sieve To', 'Description']
  columnhead2: any[] = ['Design', 'Description', 'Pcs', 'Type', 'Sub Category', 'Brand']
  selectedTabIndex = 0;
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  imageurl: any;
  image: string | ArrayBuffer | null | undefined;
  codeEnable: boolean = true;
  viewMode: boolean = false;
  editMode: boolean = false;
  editableMode: boolean = false;
  viewDisable: boolean = false;
  prefixMasterDetail: any;
  PICTURE_NAME: string | null = null;
  strBranchcode: any = localStorage.getItem("userbranch");
  // /images: any[] = [];
  private subscriptions: Subscription[] = [];
  images: string[] = [];
  imageNames: string[] = [];

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 51,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Master',
    SEARCH_VALUE: '',
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  // divisionCode: MasterSearchModel = {
  //   PAGENO: 1,
  //   RECORDS: 10,
  //   LOOKUPID: 18,
  //   SEARCH_FIELD: 'DIVISION_CODE',
  //   SEARCH_HEADING: 'Division Code',
  //   SEARCH_VALUE: '',
  //   WHERECONDITION: "DIVISION_CODE<>''",
  //   // WHERECONDITION: "division='M'",
  //   VIEW_INPUT: true,
  //   VIEW_TABLE: true,
  // }

  divisionCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division Code',
    SEARCH_VALUE: '',
    WHERECONDITION: this.getDivisionCondition(),
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  // Function to determine the WHERECONDITION based on some criteria
  getDivisionCondition(): string {
    // Example criteria; replace with actual logic as needed
    const condition = 'L'; // This value would be dynamically determined

    if (condition === 'L') {
      return "DIVISION_CODE NOT IN ('X','W','D','M','U','N','A','Z') ORDER BY DIVISION_CODE";
    } else if (condition === 'Z') {
      return "DIVISION_CODE NOT IN ('X','W','D','M','U','N','A','L') ORDER BY DIVISION_CODE";
    } else {
      // Default condition if none of the specific conditions are met
      return "DIVISION_CODE <> '' ORDER BY DIVISION_CODE ";
    }
  }


  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'CATEGORY MASTER' ORDER BY CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 17,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE <> '' ORDER BY KARAT_CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  codeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Prefix master',
    WHERECONDITION: "COMP_PREFIX='1' ORDER BY PREFIX_CODE",
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='TYPE MASTER' ORDER BY CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sizeSetCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 90,
    SEARCH_FIELD: 'COMPSET_CODE',
    SEARCH_HEADING: 'Size set',
    SEARCH_VALUE: '',
    WHERECONDITION: "COMPSET_CODE <> '' ORDER BY COMPSET_CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  shapeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: "types='SHAPE MASTER' ORDER BY CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  settingTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Setting Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='SETTING TYPE MASTER' ORDER BY CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  processSeqCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 93,
    SEARCH_FIELD: 'SEQ_CODE',
    SEARCH_HEADING: 'Sequence ',
    SEARCH_VALUE: '',
    WHERECONDITION: "SEQ_CODE<> '' ORDER BY SEQ_CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  costCenterCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPE = 'PRECIOUS STONES' ORDER BY COST_CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stonetypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Stone Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "types = 'STONE TYPE MASTER' ORDER BY CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  colorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "Types = 'COLOR MASTER' ORDER BY CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  clarityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "Types = 'CLARITY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sieveCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'SIEVE',
    SEARCH_VALUE: '',
    WHERECONDITION: "types = 'SIEVE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  descriptionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<>'' ORDER BY CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'TYPES',
    SEARCH_HEADING: 'SETTING TYPE MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='SETTING TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  pointerWtCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Pointer Wt',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<>'' ORDER BY CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  extColorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "Types = 'COLOR MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  extClarityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "Types = 'CLARITY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sieveFromCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'SIEVE MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "types = 'SIEVE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sieveToCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve To',
    SEARCH_VALUE: '',
    WHERECONDITION: "types = 'SIEVE MASTER' AND CODE > ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sizegridCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size',
    SEARCH_VALUE: '',
    WHERECONDITION: "types = 'SIZE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }


  sizeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 89,
    SEARCH_FIELD: 'types',
    SEARCH_HEADING: 'Size',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }


  componentmasterForm: FormGroup = this.formBuilder.group({
    code: ["", [Validators.required]],
    codedes: ["", [Validators.required]],
    sizeSet: [""],
    size: [""],
    type: [""],
    category: [""],
    shape: [""],
    settingType: [""],
    remarks: [""],
    height: [""],
    length: [""],
    width: [""],
    radius: [""],
    processSeq: ["", [Validators.required]],
    costCenter: ["", [Validators.required]],
    currencyCode: [""],
    currencyRate: [""],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
    private comService: CommonServiceService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    console.log(this.content)
    this.setInitialValues();
    // this.getDesignDetails();
    this.renderer.selectRootElement('#code')?.focus();
    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
        this.viewDisable = true;
      } else if (this.content.FLAG == 'EDIT') {
        this.maindesigndetails()
        this.editableMode = true;
        this.editMode = true;
      } else if (this.content?.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteComponentMaster()
      }
    }
    let CURRENCY_CODE = this.commonService.compCurrency
    this.componentmasterForm.controls.currencyCode.setValue(CURRENCY_CODE);
    let currrate = this.commonService.getCurrRate(CURRENCY_CODE)
    this.componentmasterForm.controls.currencyRate.setValue(currrate);

  }

  divisionCodeSelected(value: any, data: any, controlName: string) {
    console.log(value);
    console.log(data);
    this.tableData[data.data.SRNO - 1].DIVCODE = value.DIVISION_CODE;
    console.log(this.tableData);
    this.stockCodeData.WHERECONDITION = `DIVISION = '${value.DIVISION_CODE}'`;
    console.log(value.DIVISION)
    console.log(value.DIVISION_CODE)
    if (value.DIVISION === 'M') {
      this.isPCSDisabled = true;
    } else {
      this.isPCSDisabled = false;
    }
    if (value.DIVISION === 'S') {
      this.iskaratDisabled = true;
    } else {
      this.iskaratDisabled = false;
    }

  }



  stockCodeDataSelected(value: any, data: any, controlName: string,) {

    console.log(this.tableData);
    this.tableData[data.data.SRNO - 1].STOCK_CODE = value.STOCK_CODE;
    this.tableData[data.data.SRNO - 1].DESCRIPTION = value.DESCRIPTION;
    console.log(this.tableData);
    this.stockCodeValidate(this.tableData[data.data.SRNO - 1]);
    //  this.stockCodeData.WHERECONDITION = `DIVCODE = '${this.componentmasterForm.value.metalDivision}' and SUBCODE = '0'`;
  }

  codeEnabled() {
    if (this.componentmasterForm.value.code == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }
  }


 

  checkCode(): boolean {
    if (this.componentmasterForm.value.code == '') {
      this.commonService.toastErrorByMsgId('MSG1593')
      return true
    }
    return false
  }

  prefixCodeValidate() {
    const code = this.componentmasterForm.value.code;
    if (!code) return;
    let API = `PrefixMaster/GetPrefixMasterDetail/${code}`;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.response) {
          this.prefixMasterDetail = result.response;
          this.prefixMasterDetail.LAST_NO = this.incrementAndPadNumber(this.prefixMasterDetail.LAST_NO, 1)
          this.componentmasterForm.controls.code.setValue(this.prefixMasterDetail.PREFIX_CODE.toUpperCase() + this.prefixMasterDetail.LAST_NO)
          this.componentmasterForm.controls.codedes.setValue(result.response.DESCRIPTION.toUpperCase())

        } else {
          // this.alloyMastereForm.controls.code.setValue('')
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        // this.alloyMastereForm.controls.code.setValue('')
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  incrementAndPadNumber(input: any, incrementBy: any) {
    // Convert the input to an integer and increment it
    let incrementedValue = parseInt(input, 10) + incrementBy;

    // Convert the incremented value back to a string and pad with leading zeros
    let paddedValue = incrementedValue.toString().padStart(input.length, '0');

    return paddedValue;
  }

  updatePrefixMaster() {
    if (!this.prefixMasterDetail) {
    }
    let API = 'PrefixMaster/UpdatePrefixMaster/' + this.prefixMasterDetail.PREFIX_CODE
    let postData = this.prefixMasterDetail

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            // this.commonService.toastSuccessByText('Last number updated')
            console.log('Last number updated');

          }
        } else {
          this.commonService.toastErrorByMsgId('MSG2272')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  sieveToCodeSelected(value: any, data: any, controlName: string) {
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].SIEVE_TO = value.CODE;
    console.log(this.tableData);
  }

  sieveFromCodeSelected(value: any, data: any, controlName: string) {
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].SIEVE_FROM = value.CODE;
    this.sieveToCodeData.WHERECONDITION = `types = 'SIEVE MASTER' AND CODE > '${value.SIEVE_FROM}'`;
  }

  extClarityCodeSelected(value: any, data: any, controlName: string) {
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].EXT_CLARITY = value.CODE;
  }

  extColorCodeSelected(value: any, data: any, controlName: string) {
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].EXT_Color = value.CODE;
  }

  pointerWtCodeSelected(value: any, data: any, controlName: string) {
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].POINTER_WT = value.CODE;
  }

  processCodeSelected(value: any, data: any, controlName: string) {
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].PROCESS_TYPE = value.CODE;
  }

  descriptionCodeSelected(value: any, data: any, controlName: string) {
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].DESCRIPTION = value.DESCRIPTION;
  }

  sieveCodeSelected(value: any, data: any, controlName: string) {
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].SIEVE = value.CODE;
  }

  clarityCodeSelected(value: any, data: any, controlName: string) {
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].CLARITY = value.CODE;
  }

  colorCodeSelected(value: any, data: any, controlName: string) {
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].COLOR = value.CODE;
  }

  shapegridCodeSelected(value: any, data: any, controlName: string) {
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].SHAPE = value.CODE;
  }


  sizegridCodeSelected(value: any, data: any, controlName: string) {
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].DSIZE = value.CODE;
  }

  stocktypeCodeSelected(value: any, data: any, controlName: string) {
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].STOCK_FCCOST = value.CODE;
  }
  karatCodeSelected(value: any, data: any, controlName: string) {
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].KARAT_CODE = value.KARAT_CODE;
    //this.componentmasterForm.controls.karat.setValue(e.KARAT_CODE);
  }

  categoryCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.componentmasterForm.controls.category.setValue(e.CODE);
  }

  codeCodeSelected(e: any) {
    console.log(e);
    const prefixCode = e.PREFIX_CODE.toUpperCase();
    const des = e.DESCRIPTION.toUpperCase();
    this.componentmasterForm.controls.code.setValue(prefixCode);
    this.componentmasterForm.controls.codedes.setValue(des);
    this.prefixCodeValidate();
    this.getDesignDetails();
  }
  typeCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.componentmasterForm.controls.type.setValue(e.CODE);
  }

  // sizeSetCodeSelected(e: any) {
  //   if (this.checkCode()) return
  //   console.log(e);

  //   this.componentmasterForm.controls.sizeSet.setValue(e.COMPSET_CODE);
  //   console.log(this.componentmasterForm.value.sizeSet);

  //   //this.sizeCodeData.WHERECONDITION = `COMPSET_CODE='${this.componentmasterForm.value.sizeSet}'`;
  //  // this.componentmasterForm.controls.PROD_INSTRUCTION.setValue(e.DESCRIPTION);
  //  this.sizeCodeData.WHERECONDITION = COMPSIZE_CODE IN (SELECT COMPSIZE_CODE FROM COMPONENTSIZESET_DETAIL WHERE COMPSET_CODE = '${this.componentmasterForm.value.sizeSet}')
  // }

  sizeSetCodeSelected(e: any) {
    if (this.checkCode()) return;
    console.log(e);
    // Set the sizeSet form control value
    this.componentmasterForm.controls.sizeSet.setValue(e.COMPSET_CODE);
    console.log(this.componentmasterForm.value.sizeSet);
    // Set the WHERECONDITION with the correct syntax and value
    this.sizeCodeData.WHERECONDITION = `COMPSIZE_CODE IN (SELECT COMPSIZE_CODE FROM COMPONENTSIZESET_DETAIL WHERE COMPSET_CODE = '${this.componentmasterForm.value.sizeSet}')`;
  }

  getDesignDetails() {
    console.log("this.content", this.content);
    // if (this.content.FLAG == "VIEW") this.viewOnly = true;
    // if (this.content.FLAG == "EDIT") {
    //   console.log(this.comService.EditDetail.REASON);
    //   this.editOnly = true;
    // }

    this.snackBar.open("Loading...");
    let Sub: Subscription = this.dataService
      .getDynamicAPI(
        `DesignMaster/GetComponentsGridinCompMaster/${this.componentmasterForm.value.code}`
      ).subscribe((result) => {
        this.snackBar.dismiss();
        if (result.status == "Success") {
          const data = result.dynamicData;
        }
      });
  }

  sizeCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);

    const apiDescription = e.DESCRIPTION;

    // Split the DESCRIPTION string into an array using the ',' delimiter
    const descriptionArray = apiDescription.split(',');


    // Assign values to variables
    let height, width, length, radius;


    height = descriptionArray[0];
    width = descriptionArray[2];
    length = descriptionArray[1];
    radius = descriptionArray[3];


    console.log("Height:", height);
    console.log("Width:", width);
    console.log("Length:", length);
    console.log("Radius:", radius);



    const finalHeight = this.commonService.dataSplitPop(height);
    const finalWidth = this.commonService.dataSplitPop(width);
    const finalLength = this.commonService.dataSplitPop(length);
    const finalRadius = this.commonService.dataSplitPop(radius);


    this.componentmasterForm.controls.size.setValue(e.COMPSIZE_CODE);
    this.componentmasterForm.controls.height.setValue(this.commonService.transformDecimalVB(this.commonService.allbranchMaster?.BMQTYDECIMALS, finalHeight));
    this.componentmasterForm.controls.length.setValue(this.commonService.transformDecimalVB(this.commonService.allbranchMaster?.BMQTYDECIMALS, finalWidth));
    this.componentmasterForm.controls.width.setValue(this.commonService.transformDecimalVB(this.commonService.allbranchMaster?.BMQTYDECIMALS, finalLength));
    this.componentmasterForm.controls.radius.setValue(this.commonService.transformDecimalVB(this.commonService.allbranchMaster?.BMQTYDECIMALS, finalRadius));
  }

  // dataSplitPop(data:any){

  //   const result = data.split('');
  //   result.shift();
  //   result.pop();

  //   let heightValue = result.join("");
  //   console.log(heightValue);
  //   return heightValue;

  // }


  shapeCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.componentmasterForm.controls.shape.setValue(e.CODE);
  }

  settingTypeCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.componentmasterForm.controls.settingType.setValue(e.CODE);
  }

  processSeqCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.componentmasterForm.controls.processSeq.setValue(e.SEQ_CODE);
  }


  costCenterCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.componentmasterForm.controls.costCenter.setValue(e.COST_CODE);
  }



  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
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



  addTableData() {
    let length = this.tableData.length;

    let srno = length + 1;
    let data = {

      "UNIQUEID": 0,
      "SRNO": srno,
      "DIVCODE": "",
      "STOCK_CODE": "",
      "CARAT": 0,
      "STOCK_FCCOST": "",
      "PCS": 0,
      "GROSS_WT": "",
      "COLOR": "",
      "CLARITY": "",
      "SHAPE": "",
      "SIEVE": "",
      "DESCRIPTION": "",
      "DSIZE": "",
      "PROCESS_TYPE": "",
      "D_REMARKS": "",
      "POINTER_WT": 0,
      "EXT_Color": "",
      "EXT_CLARITY": "",
      "SIEVE_FROM": "",
      "SIEVE_TO": "",
      "METALSTONE": "",
      "KARAT_CODE": "",
      "RATE_TYPE": "",
      "CURRENCY_CODE": "AED",
      "KARAT": "",
      "PRICEID": "",
      "SIZE_FROM": "",
      "SIZE_TO": "",
      "PART_CODE": "",
      "LABCHGCODE": "",
      "PRICECODE": "",
      "DLABCHGCODE": "",
      "DPRICECODE": "",
      "RATEFC": 0,
      "DMMETALPERCENTAGE": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "MAKINGRATE": 0,
      "MAKINGAMOUNT": 0,
      "METALPER": 0,
      "METALRATE": 0,
      "CURR_RATE": 0,
      "LABOURCODE": "",
      "DETLINEREMARKS": "",
      "SIEVE_SET": "",
      "STONE_TYPE": "",
      "PURITY": 0,
      "OTHER_ATTR": ""

    };
    this.tableData.push(data);
    // this.tableData.filter((data, i) => data.SRNO = i + 1)
    this.tableData.forEach((item, i) => {
      item.SRNO = i + 1;
      item.isDisabled = true;
    });
  }

  onSelectionChanged(event: any) {
    // const values: number[] = event.selectedRowKeys;
    // const indexes: number[] = [];

    // values.forEach((selectedValue: number) => {
    //   const index = this.tableData.findIndex(item => parseFloat(item.SRNO) === selectedValue);

    //   // Check if the value is not already in the selectedIndexes array
    //   if (index !== -1 && !this.selectedIndexes.includes(index)) {
    //     indexes.push(index);
    //   }
    // });

    // this.selectedIndexes = indexes;
    // console.log(this.selectedIndexes);

    
    const values = event.selectedRowKeys;
    console.log(values);
    let indexes: Number[] = [];
    this.tableData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
        console.log(acc);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    console.log(this.selectedIndexes);
  }

  // deleteTableData() {
  //   console.log('Selected indexes:', this.selectedIndexes);
  //   if (this.selectedIndexes.length > 0) {
  //     this.selectedIndexes.sort((a: number, b: number) => b - a);

  //     console.log('Before deletion - tableData:', this.tableData);

  //     this.selectedIndexes.forEach((indexToRemove: number) => {
  //       console.log('Deleting index:', indexToRemove);
  //       this.tableData.splice(indexToRemove, 2);
  //     });

  //     console.log('After deletion - tableData:', this.tableData);

  //     this.selectedIndexes = [];
  //   } else {
  //     this.snackBar.open('Please select a record', 'OK', { duration: 2000 });
  //   }
  // }

  // deleteTableData() {
  //   console.log('Selected indexes:', this.selectedIndexes);
  //   if (this.selectedIndexes.length > 0) {

  //     // Show the confirmation dialog before deleting
  //     this.showConfirmationDialog().then((result) => {
  //       if (result.isConfirmed) {
  //         // Proceed with deletion if the user confirms
  //         this.selectedIndexes.sort((a: number, b: number) => b - a);

  //         console.log('Before deletion - tableData:', this.tableData);

  //         this.selectedIndexes.forEach((indexToRemove: number) => {
  //           console.log('Deleting index:', indexToRemove);
  //           this.tableData.splice(indexToRemove, 2);
  //         });

  //         console.log('After deletion - tableData:', this.tableData);

  //         this.selectedIndexes = [];
  //         this.snackBar.open('Records deleted successfully', 'OK', { duration: 2000 });
  //       }
  //     });

  //   } else {
  //     this.snackBar.open('Please select a record', 'OK', { duration: 2000 });
  //   }
  // }


  deleteTableData() {
    console.log("After Selecting " + this.selectedIndexes);
  
    if (this.selectedIndexes !== undefined && this.selectedIndexes.length > 0) {
      // Display confirmation dialog before deleting
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete!'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.tableData.length > 0) {
            // Log the selected indexes before filtering
            // console.log('Selected indexes to delete:', this.selectedIndexes);
  
            if (this.selectedIndexes && this.selectedIndexes.length > 0) {
              // console.log('Before deletion, tableData length:', this.tableData.length);
  
              // Filter out items whose index is included in the selectedIndexes
              this.tableData = this.tableData.filter((data, index) => {
                const shouldDelete = !this.selectedIndexes.includes(index);
                // console.log(`Index ${index} - Should Delete: ${!shouldDelete}`);
                return shouldDelete;
              });
  
              // console.log('After deletion, tableData length:', this.tableData.length);
              // console.log('Table data:', this.tableData);
              // Reset selectedIndexes after deletion
              this.selectedIndexes = [];
              // console.log('Selected indexes after reset:', this.selectedIndexes);
  
              // Show success message after deletion
              this.snackBar.open('Data deleted successfully!', 'OK', { duration: 2000 });
  
              // Update serial numbers after deletion
              this.tableData.forEach((item: any, i: number) => {
                item.SRNO = i + 1; // Reset serial numbers starting from 1
              });
  
            } else {
              // console.warn('No indexes selected for deletion.');
            }
          } else {
            this.snackBar.open('No data to delete!', 'OK', { duration: 2000 });
          }
        }
      });
    } else {
      this.snackBar.open('Please select a record', 'OK', { duration: 2000 });
    }
  }


  setFormValues() {
    if (!this.content) return

    this.componentmasterForm.controls.code.setValue(this.content.DESIGN_CODE)
    this.componentmasterForm.controls.codedes.setValue(this.content.DESIGN_DESCRIPTION)
    this.componentmasterForm.controls.sizeSet.setValue(this.content.COMPSET_CODE)
    this.componentmasterForm.controls.size.setValue(this.content.COMPSIZE_CODE)
    // this.componentmasterForm.controls.sieve_to.setValue(this.content.SIEVE)
    this.componentmasterForm.controls.type.setValue(this.content.TYPE_CODE)
    this.componentmasterForm.controls.category.setValue(this.content.CATEGORY_CODE)
    this.componentmasterForm.controls.shape.setValue(this.content.SHAPE)
    this.componentmasterForm.controls.settingType.setValue(this.content.PROCESS_TYPE)
    this.componentmasterForm.controls.remarks.setValue(this.content.D_REMARKS)
    // this.componentmasterForm.controls.height.setValue(this.content.HEIGHT)
    // this.componentmasterForm.controls.length.setValue(this.content.LENGTH)
    // this.componentmasterForm.controls.width.setValue(this.content.WIDTH)
    // this.componentmasterForm.controls.radius.setValue(this.content.RADIUS)
    this.componentmasterForm.controls.processSeq.setValue(this.content.SEQ_CODE)
    this.componentmasterForm.controls.costCenter.setValue(this.content.COST_CODE)
    this.componentmasterForm.controls.currencyCode.setValue(this.content.CURRENCY_CODE)
    this.componentmasterForm.controls.currencyRate.setValue(this.content.CC_RATE)
    this.componentmasterForm.controls.remarks.setValue(this.content.PROD_INSTRUCTION)


    this.componentmasterForm.controls.height.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.HEIGHT));

    this.componentmasterForm.controls.length.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.LENGTH));

    this.componentmasterForm.controls.width.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.WIDTH));


    this.componentmasterForm.controls.radius.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.RADIUS));

    this.images = this.content.PICTURE_NAME
    this.tableData = this.content.DESIGN_STNMTL_DETAIL

    this.dataService.getDynamicAPI('DesignMaster/GetDesignMasterDetails/' + this.content.DESIGN_CODE)
      .subscribe((data) => {
        if (data.status == 'Success') {
          this.tableData = data.response.DESIGN_STNMTL_DETAIL;
        }
      });

    //
  }


  private setInitialValues() {

    this.componentmasterForm.controls.height.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.componentmasterForm.controls.length.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.componentmasterForm.controls.width.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.componentmasterForm.controls.radius.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'));
  }

  setPostData() {

    console.log(this.tableData);

    let form = this.componentmasterForm.value
    // let heightValueData = form.height.toFixed(2);
    // let heightValueData = parseFloat(form.height).toFixed(2);
    // let lengthValueData = parseFloat(form.length).toFixed(2);
    let heightValueData = !isNaN(parseFloat(form.height)) ? parseFloat(form.height) : 0;
    let formattedHeight = heightValueData % 1 === 0 ? heightValueData.toString() : heightValueData.toFixed(2);
    let lengthValueData = !isNaN(parseFloat(form.length)) ? parseFloat(form.length) : 0;
    let formattedLength = lengthValueData % 1 === 0 ? lengthValueData.toString() : lengthValueData.toFixed(2);

    let postData = {
      "DESIGN_CODE": this.commonService.nullToString(form.code) || "",
      "DESIGN_DESCRIPTION": this.commonService.nullToString(form.codedes) || "",
      "CURRENCY_CODE": this.commonService.nullToString(form.currencyCode),
      "CC_RATE": "0",
      "COST_CODE": this.commonService.nullToString(form.costCenter) || "",
      "TYPE_CODE": this.commonService.nullToString(form.type),
      "CATEGORY_CODE": this.commonService.nullToString(form.category) || "",
      "SUBCATEGORY_CODE": "",
      "BRAND_CODE": "",
      "COUNTRY_CODE": "",
      "SUPPLIER_CODE": "",
      "SUPPLIER_REF": "",
      "SET_REF": "",
      "PICTURE_NAME": this.PICTURE_NAME || "",
      "PICTURE_NAME1": "",
      "STOCK_FCCOST": 0,
      "STOCK_LCCOST": 0,
      "PRICE1PER": "",
      "PRICE2PER": "",
      "PRICE3PER": "",
      "PRICE4PER": "",
      "PRICE5PER": "",
      "PRICE1FC": 0,
      "PRICE1LC": 0,
      "PRICE2FC": 0,
      "PRICE2LC": 0,
      "PRICE3FC": 0,
      "PRICE3LC": 0,
      "PRICE4FC": 0,
      "PRICE4LC": 0,
      "PRICE5FC": 0,
      "PRICE5LC": 0,
      "CHARGE1FC": 0,
      "CHARGE1LC": 0,
      "CHARGE2FC": 0,
      "CHARGE2LC": 0,
      "CHARGE3FC": 0,
      "CHARGE3LC": 0,
      "CHARGE4FC": 0,
      "CHARGE4LC": 0,
      "CHARGE5FC": 0,
      "CHARGE5LC": 0,
      "SHORT_ID": "",
      "COLOR": "",
      "CLARITY": "",
      "SIZE": "",
      "SIEVE": "",
      "SHAPE": this.commonService.nullToString(form.shape),
      "GRADE": "",
      "FLUOR": "",
      "FINISH": "",
      "CERT_BY": "",
      "CERT_NO": "",
      "CERT_DATE": "",
      "GRIDLE": "",
      "CULET": "",
      "TWIDTH": 0,
      "CRHEIGHT": 0,
      "PAVDEPTH": 0,
      "OVERALL": "",
      "MEASURE": "",
      "CERT_PICTURE_NAME": "",
      "TAG_LINES": "",
      "COMMENTS": "",
      "WATCH_TYPE": 0,
      "PEARL_TYPE": 0,
      "STRAP_TYPE": "",
      "STRAP_COLOR": "",
      "GW": 0,
      "MODEL_NO": "",
      "MODEL_YEAR": 0,
      "OPENED_ON": this.commonService.formatDateTime(this.currentDate),
      "OPENED_BY": "",
      "FIRST_TRN": "",
      "LAST_TRN": "",
      "MID": this.content?.MID || 0,
      "PRINTED": false,
      "PURVOCTYPE_NO": "",
      "PURPARTY": "",
      "PURDATE": "",
      "PURAMOUNT": 0,
      "PURBRLOC": "",
      "SALVOCTYPE_NO": "",
      "SALPARTY": "",
      "SALDATE": "",
      "SALAMOUNT": 0,
      "SALBRLOC": "",
      "METAL_TOTALGROSSWT": 0,
      "METAL_TOTALAMOUNT": 0,
      "METAL_TOTALMAKING": 0,
      "LOOSE_TOTALWT": 0,
      "LOOSE_TOTALAMOUNT": 0,
      "COLOR_TOTALWT": 0,
      "COLOR_TOTALAMOUNT": 0,
      "PEARL_TOTALWT": 0,
      "PEARL_TOTALAMOUNT": 0,
      "MANF_MID": 0,
      "MANF_BR_VOCTYPE_NO": "",
      "WATCH_REFNO": "",
      "WATCH_MODELNAME": "",
      "WATCH_MODELNO": "",
      "WATCH_MATERIAL": "",
      "WATCH_DIALCOLOR": "",
      "WATCH_BAZEL": "",
      "WATCH_MOVEMENT": "",
      "WATCH_STATUS": "",
      "ITEM_IMAGE": '',
      "DESIGN_HOLD": false,
      "DESIGN_EXCLUSSIVE": false,
      "JEWELLERY_SIZE": 0,
      "SIZE_UNIT": "",
      "METAL_MAX_WT": 0,
      "METAL_MIN_WT": 0,
      "STONE_MAX_CT": 0,
      "STONE_MIN_CT": 0,
      "STONE_TOLARANCE": 0,
      "TOTAL_PROD_PCS": 0,
      "LAST_PROD_ON": "",
      "LAST_PROD_REF": "",
      "LAST_CUST_ID": "",
      "LAST_STOCK_ID": "",
      "PENDING_JOB_PCS": 0,
      "PENDING_JOBS": 0,
      "LAST_COST": 0,
      "SEQ_CODE": this.commonService.nullToString(form.processSeq),
      "SEQ_DESCRIPTION": "",
      "EDITED_ON": "",
      "EDITED_BY": "",
      "MTL_STD_WT": 0,
      "MTL_TOLERANCE": 0,
      "LST_STD_WT": 0,
      "LST_TOLERANCE": 0,
      "CST_STD_WT": 0,
      "CST_TOLERANCE": 0,
      "ZIR_STD_WT": 0,
      "ZIR_TOLERANCE": 0,
      "PRL_STD_WT": 0,
      "PRL_TOLERANCE": 0,
      "OTH_STD_WT": 0,
      "OTH_TOLERANCE": 0,
      "WAX_WEIGHT": 0,
      "CAST_PCS_WEIGHT": 0,
      "SLV_MODEL_WEIGHT": 0,
      "STD_TIME": 0,
      "MAX_TIME": 0,
      "MODEL_MAKER": "",
      "SKETCH_NAME": "",
      "PROD_INSTRUCTION": this.commonService.nullToString(form.remarks),
      "LABOUR_FCCOST": 0,
      "MATERIAL_FCCOST": 0,
      "GROSS_WT": 0,
      "STONE_WT": 0,
      "GENDER": "",
      "TAG_LINESWOENTER": "",
      "PICTURE_NAME_THUMBNAIL": "",
      "KARAT_CODE": "",
      "PARTS": 0,
      "JOB_PREFIX": "",
      "SETREF_PREFIX": "",
      "DSURFACEPROPERTY": "",
      "DREFERENCE": "",
      "DWIDTH": 0,
      "DTHICKNESS": 0,
      "METAL_WT": 0,
      "CAD_DESIGNER": "",
      "DESIGNER": "",
      "INSTRUCTOR": "",
      "FINAL_APPROVAL": "",
      "TIME_CODE": "",
      "RANGE_CODE": "",
      "COMMENTS_CODE": "",
      "STYLE": "",
      "CHKCOMPONENTSUMMARY": "",
      "CHKCOMPONENTDETAIL": "",
      "METALWT": 0,
      "TOTAL_OTHER_FC": 0,
      "TOTAL_OTHER_LC": 0,
      "TOTAL_STONE_LC": 0,
      "TOTAL_STONE_FC": 0,
      "TOTAL_METAL_LC": 0,
      "TOTAL_METAL_FC": 0,
      "TOTAL_METAL_QTY": 0,
      "TOTAL_STONE_QTY": 0,
      "TOTVFC": 0,
      "TOTVLC": 0,
      "TOTALFC": 0,
      "TOTALCC": 0,
      "TOTPCS": 0,
      "TOTCARAT": 0,
      "TOTGMS": 0,
      "LAST_EDT_BY": "",
      "LAST_EDT_ON": "",
      "DIA_PCS": 0,
      "DIA_CARAT": 0,
      "DIA_VALUEFC": 0,
      "DIA_VALUECC": 0,
      "COLOR_PCS": 0,
      "COLOR_CARAT": 0,
      "COLOR_VALUEFC": 0,
      "COLOR_VALUECC": 0,
      "PEARL_PCS": 0,
      "PEARL_CARAT": 0,
      "PEARL_VALUEFC": 0,
      "PEARL_VALUECC": 0,
      "OTSTONES_PCS": 0,
      "OTSTONES_CARAT": 0,
      "OTSTONES_VALUEFC": 0,
      "OTSTONES_VALUECC": 0,
      "METAL_GROSSWT": 0,
      "METAL_VALUEFC": 0,
      "METAL_VALUECC": 0,
      "PAIR_REF": "",
      "SURFACEPROPERTY": "",
      "WIDTH": this.commonService.emptyToZero(form.width),
      "THICKNESS": 0,
      "ENGRAVING_TEXT": "",
      "ENGRAVING_FONT": "",
      "STYLEMASTER": "",
      "PARENT_DSNG_CODE": "",
      "FAULT_DETAILS": "",
      "DESIGN_TYPE": "COMP",
      "JEWELLERY_UNIT": "",
      "UDF1": "",
      "UDF2": "",
      "UDF3": "",
      "UDF4": "",
      "UDF5": "",
      "UDF6": "",
      "UDF7": "",
      "UDF8": "",
      "UDF9": "",
      "UDF10": "",
      "UDF11": "",
      "UDF12": "",
      "UDF13": "",
      "UDF14": "",
      "UDF15": "",
      "CUSTOMERSKU": "",
      "FINALAPPROVALDATE": this.commonService.formatDateTime(this.currentDate),
      "PRINT_COUNT": 0,
      "EXPIRY_DATE": this.commonService.formatDateTime(this.currentDate),
      "PROCESS_TYPE": this.commonService.nullToString(form.settingType),
      "DYE_STRIP": false,
      "CASTING_REQ": 0,
      "WAXING_REQ": 0,
      "PCS": 0,
      "ISSUEDWT": 0,
      "READYWT": 0,
      "FITTINGWT": 0,
      "CUTTINGWT": 0,
      "INNERWT": 0,
      "NON_CASTING": 0,
      "CC_MAKING": "",
      "STONE_INCLUDED": false,
      "CAD_REQUIRED": false,
      "HEIGHT": this.commonService.nullToString(formattedHeight),
      "RADIUS": this.commonService.nullToString(form.radius),
      "LENGTH": this.commonService.nullToString(formattedLength),
      "COMPSIZE_CODE": this.commonService.nullToString(form.size),
      "COMPSET_CODE": this.commonService.nullToString(form.sizeSet),
      "PROD_VARIANCE": 0,
      "METALCALC_GROSSWT": false,
      "MKGCALC_GROSSWT": false,
      "PURITY": 0,
      "DESIGN_DESC": "",
      "COST_CENTER_DESC": "",
      "karat_Desc": "",
      "SUPPLIER_DESC": "",
      "CATEGORY_DESC": "",
      "SUBCATEGORY_DESC": "",
      "TYPE_DESC": "",
      "BRAND_DESC": "",
      "STYLE_DESC": "",
      "RANGE_DESC": "",
      "COUNTRY_DESC": "",
      "UDF1_DESC": "",
      "UDF2_DESC": "",
      "UDF3_DESC": "",
      "UDF4_DESC": "",
      "UDF5_DESC": "",
      "UDF6_DESC": "",
      "UDF7_DESC": "",
      "UDF8_DESC": "",
      "UDF9_DESC": "",
      "UDF10_DESC": "",
      "UDF11_DESC": "",
      "UDF12_DESC": "",
      "UDF13_DESC": "",
      "UDF14_DESC": "",
      "UDF15_DESC": "",
      "REQ_METAL_WT": 0,
      "REQ_METAL_TYPE": false,
      "CHARGE6FC": 0,
      "CHARGE6LC": 0,
      "CHARGE7FC": 0,
      "CHARGE7LC": 0,
      "CHARGE8FC": 0,
      "CHARGE8LC": 0,
      "CHARGE9FC": 0,
      "CHARGE9LC": 0,
      "CHARGE10FC": 0,
      "CHARGE10LC": 0,
      "ADD_STEEL": false,
      "DESIGN_STNMTL_DETAIL": this.tableData,
      //[
      //   {
      //     "UNIQUEID": 0,
      //     "SRNO": 0,
      //     "METALSTONE": "5",
      //     "DIVCODE": "c",
      //     "KARAT_CODE": "",
      //     "CARAT": 0,
      //     "GROSS_WT": 0,
      //     "PCS": 0,
      //     "RATE_TYPE": "",
      //     "CURRENCY_CODE": form.currencyCode,
      //     "RATE": 0,
      //     "AMOUNTFC": 0,
      //     "AMOUNTLC": 0,
      //     "MAKINGRATE": 0,
      //     "MAKINGAMOUNT": 0,
      //     "SIEVE": "",
      //     "COLOR": "",
      //     "CLARITY": "",
      //     "SHAPE": "",
      //     "STOCK_CODE": "",
      //     "DESIGN_CODE": "",
      //     "KARAT": "",
      //     "PRICEID": "",
      //     "SIZE_FROM": form.sizeSet,
      //     "SIZE_TO": "",
      //     "RATEFC": 0,
      //     "PART_CODE": "",
      //     "DSIZE": "",
      //     "LABCHGCODE": "",
      //     "PRICECODE": "",
      //     "DMMETALPERCENTAGE": 0,
      //     "DLABCHGCODE": "",
      //     "DPRICECODE": "",
      //     "METALPER": 0,
      //     "METALRATE": 0,
      //     "CURR_RATE": 0,
      //     "LABOURCODE": "",
      //     "DETLINEREMARKS": "",
      //     "PROCESS_TYPE": "",
      //     "SIEVE_SET": "",
      //     "STONE_TYPE": "",
      //     "EXT_COLOR": "",
      //     "EXT_CLARITY": "",
      //     "D_REMARKS": form.remarks,
      //     "POINTER_WT": 0,
      //     "SIEVE_FROM": "",
      //     "SIEVE_TO": "",
      //     "PURITY": 0,
      //     "OTHER_ATTR": ""
      //   }
      // ]
      "DESIGN_SEQUENCE_DETAILS_DJ": [
        {
          "DESIGN_CODE": "",
          "SEQ_CODE": "",
          "SEQ_NO": 0,
          "PROCESS_CODE": "",
          "PROCESS_TYPE": "",
          "CURRENCY_CODE": "",
          "UNIT_RATE": 0,
          "UNIT": "",
          "NO_OF_UNITS": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "STD_LOSS": 0,
          "MIN_LOSS": 0,
          "MAX_LOSS": 0,
          "LOSS_ACCODE": "",
          "WIP_ACCODE": "",
          "POINTS": 0,
          "DESCRIPTION": "",
          "TIMEON_PROCESS": true,
          "LABCHRG_PERHOUR": 0
        }
      ],
      "DESIGN_PARTS": [
        {
          "DESIGN_CODE": "",
          "PART_CODE": "",
          "PART_DESCRIPTION": "",
          "METAL_WT": 0,
          "LS_PCS": 0,
          "LS_WT": 0,
          "CS_PCS": 0,
          "CS_WT": 0,
          "PL_PCS": 0,
          "PL_WT": 0,
          "OTH_PCS": 0,
          "OTH_WT": 0,
          "TOTAL_PCS": 0,
          "GROSS_WT": 0,
          "PICTURE_NAME": "",
          "PART_COLOR": ""
        }
      ],
      "DESIGN_ATTRIBUTES": [
        {
          "DESIGN_CODE": "",
          "ATTR_TYPE": "",
          "ATTR_CODE": "",
          "ATTR_DESCRIPTION": "",
          "WEIGHT": 0,
          "PCS": 0,
          "ST_PCS": 0,
          "ST_WEIGHT": 0,
          "DEFAULT_CODE": true
        }
      ],
      "Picture_Attachment": [
        {
          "CODE": "",
          "PICTURE_NAME": "",
          "DEFAULTPICTURE": true,
          "TYPE": "",
          "PICTURE_TYPE": "",
          "PICTURE_PATHOLD": ""
        }
      ],
      "METAL_STOCK_MASTER_VENDOR": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "STOCK_CODE": "",
          "ACCODE": "",
          "DEL_DAYS": 0,
          "CREDIT_DAYS": 0,
          "PAYMENT_MODE": "",
          "VENDOR_DESIGN": "",
          "DESCRIPTION": ""
        }
      ],
      "DESIGN_LABOUR_SUMMARY": [
        {
          "DESIGN_CODE": "",
          "CODE": "",
          "DESCRIPTION": "",
          "COST": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "SLNO": 0,
          "TYPE": "",
          "METHOD": "",
          "DIVISION": "",
          "SHAPE": "",
          "SIZE_FROM": "",
          "SIZE_TO": "",
          "UNIT": "",
          "SELLING_RATE": 0
        }
      ]
    }
    return postData
  }


  submitValidations(form: any) {
    if (this.commonService.nullToString(form.code) == '') {
      this.commonService.toastErrorByMsgId('MSG1124') //"Code cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.codedes) == '') {
      this.commonService.toastErrorByMsgId('MSG1193')//"description cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.processSeq) == '') {
      this.commonService.toastErrorByMsgId('MSG1680')//"process seq cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.costCenter) == '') {
      this.commonService.toastErrorByMsgId('MSG1150')//"Cost center cannot be empty"
      return true
    }
    return false;
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.submitValidations(this.componentmasterForm.value)) return;
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI('DesignMaster/InsertDesignMaster', postData)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.updatePrefixMaster()
          this.showSuccessDialog(this.commonService.getMsgByID('MSG2239') || 'Saved Successfully')
        } else if (result.status == "Failed") {
          this.commonService.toastErrorByMsgId('MSG1121')
        }
        else {
          Swal.fire({
            title: "Code is already Exists",
            icon: 'error',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          })
          // this.commonService.toastErrorByMsgId('MSG3577')

        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }

  update() {

    if (this.submitValidations(this.componentmasterForm.value)) return;

    let API = 'DesignMaster/UpdateDesignMaster/' + this.content.DESIGN_CODE
    let postData = this.setPostData()


    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {

        if (result.status == "Success") {
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.componentmasterForm.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
        else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)

  }

  maindesigndetails() {

    // this.jobCardFrom.controls.jobCardFrom.setValue(e.PRICE_CODE)
    let postData = {
      "SPID": "104",
      "parameter": {
        COMPCODE: this.componentmasterForm.value.code
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.maindetails = result.dynamicData[0] || []
          console.log(this.maindetails);

          // this.componentmasterForm.controls.jobno.setValue(result.dynamicData[0][0].JOB_NO)
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG81451')
      })
    this.subscriptions.push(Sub)
  }


  deleteComponentMaster() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content.DESIGN_CODE) {
      this.commonService.toastErrorByMsgId('MSG1644');
      return;
    }

    this.showConfirmationDialog().then((result) => {
      if (result.isConfirmed) {
        let API = 'DesignMaster/DeleteDesignMaster/' + this.content.DESIGN_CODE
        // this.commonService.showSnackBarMsg('MSG81447');
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                this.showSuccessDialog('Deleted Successfully');
              } else {
                this.showErrorDialog(result.message || 'Error please try again');
              }
            } else {
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => {
            this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
          });
        this.subscriptions.push(Sub);
      }
    });
  }

  showConfirmationDialog(): Promise<any> {
    return Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    });
  }

  showDeleteErrorDialog(message: string): void {
    Swal.fire({
      title: '',
      text: message,
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    });
  }

  showSuccessDialog(message: string): void {
    Swal.fire({
      title: message,
      text: '',
      icon: 'success',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      this.afterSave(result.value)
    });
  }

  showErrorDialog(message: string): void {
    Swal.fire({
      title: message,
      text: '',
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      this.afterSave(result.value)
    });
  }
  afterSave(value: any) {
    if (value) {
      this.componentmasterForm.reset()
      this.tableData = []
      this.close('reloadMainGrid')
    }
  }

  /**use: validate all lookups to check data exists in db */
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value;

    if (this.editMode && FORMNAME === 'code') {
      return;
    }
    if (this.editMode && FORMNAME === 'codedes') {
      return;
    }

    if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.componentmasterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          return
        }

        if (FORMNAME === 'code') {
          // console.log("dsffds")
          this.prefixCodeValidate();
        }

        this.componentMasterFormChecks(FORMNAME)// for validations
      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  //PrefixMaster/GetPrefixMasterDetail/DPM1/DMCC
  componentMasterFormChecks(FORMNAME: string) {
    if (FORMNAME == 'code') {
      this.prefixCodeValidate()
    }
  }

  // onFileChangedimage(event: any): void {
  //   this.images = [];
  //   this.imageNames = [];
  //   this.PICTURE_NAME = "";  // Clear PICTURE_NAME initially

  //   if (event.target.files && event.target.files.length > 0) {
  //     const files = event.target.files;
  //     const totalFiles = files.length;
  //     let loadedFiles = 0;

  //     for (let i = 0; i < totalFiles; i++) {
  //       const reader = new FileReader();
  //       const file = files[i];

  //       // Save file names or other metadata instead of the entire base64 data
  //       this.imageNames.push(file.name);

  //       reader.readAsDataURL(file);
  //       reader.onload = (() => {
  //         this.images.push(reader.result as string);
  //         loadedFiles++;

  //         // Update PICTURE_NAME after all files are loaded
  //         if (loadedFiles === totalFiles) {
  //           this.PICTURE_NAME = this.imageNames.join(',') || "";
  //         }
  //       }).bind(this);  // Ensure `this` context is maintained
  //     }
  //   }
  // }

  onFileChangedimage(event: any): void {
    // Clear the previous images and names
    this.images = [];
    this.imageNames = [];
    this.PICTURE_NAME = "";

    if (event.target.files && event.target.files.length > 0) {
      const files = event.target.files;
      const totalFiles = files.length;
      let loadedFiles = 0;

      for (let i = 0; i < totalFiles; i++) {
        const reader = new FileReader();
        const file = files[i];

        // Save file names or other metadata
        this.imageNames.push(file.name);

        reader.onload = ((event: ProgressEvent<FileReader>) => {
          this.images.push(event.target?.result as string);
          loadedFiles++;

          // Update PICTURE_NAME after all files are loaded
          if (loadedFiles === totalFiles) {
            this.PICTURE_NAME = this.imageNames.join(',') || "";
          }
        });

        reader.readAsDataURL(file);
      }
    }
  }


  // onFileChangedimage(event: any): void {
  //   this.images = [];
  //   this.imageNames = [];

  //   if (event.target.files && event.target.files.length > 0) {
  //     const files = event.target.files;
  //     const totalFiles = files.length;
  //     let loadedFiles = 0;

  //     for (let i = 0; i < totalFiles; i++) {
  //       const reader = new FileReader();
  //       const file = files[i];

  //       // Save file names or other metadata instead of the entire base64 data
  //       this.imageNames.push(file.name);

  //       reader.readAsDataURL(file);
  //       reader.onload = () => {
  //         this.images.push(reader.result as string);
  //         loadedFiles++;

  //         // Update PICTURE_NAME after all files are loaded
  //         if (loadedFiles === totalFiles) {
  //           this.PICTURE_NAME = this.imageNames.join(',') || "";
  //         }
  //       };
  //     }
  //   } else {
  //     this.PICTURE_NAME = "";  // Clear PICTURE_NAME if no files are selected
  //   }
  // }

  stockType(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].STOCK_FCCOST = data.target.value;
  }
  pcstemp(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].PCS = data.target.value;
  }
  wtCtt(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].GROSS_WT = data.target.value;
  }
  color(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].COLOR = data.target.value;
  }
  clarity(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].CLARITY = data.target.value;
  }
  shape(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].SHAPE = data.target.value;
  }
  sieve(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].SIEVE = data.target.value;
  }
  description(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].DESCRIPTION = data.target.value;
  }
  size(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].DSIZE = data.target.value;
  }
  processType(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].PROCESS_TYPE = data.target.value;
  }
  remark(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].D_REMARKS = data.target.value;
  }
  pointerWt(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].POINTER_WT = data.target.value;
  }
  extClarity(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].EXT.CLARITY = data.target.value;
  }
  sieveFrom(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].SIEVE_FROM = data.target.value;
  }
  sieveTo(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].SIEVE_TO = data.target.value;
  }
  extColor(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].EXT_Color = data.target.value;
  }
  // extColor(data: any, value: any) {
  //   this.tableData[value.data.SRNO - 1].EXT_Color = data.target.value;
  // }

  stockCodeValidate(event: any) {
    console.log(this.stockCodeData)
    let postData = {
      "SPID": "082",
      "parameter": {
        "strDivision": event.DIVCODE || '',
        "StockCode": event.STOCK_CODE,

      }
    }
    console.log('Post data:', postData); // Debugging statement

    this.comService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg();
        console.log('API response:', result); // Debugging statement

        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0];
          if (data) {
            this.tableData[event.SRNO - 1].KARAT_CODE = data[0].KARAT_CODE
            this.tableData[event.SRNO - 1].DIVCODE = data[0].DIVISION
            this.tableData[event.SRNO - 1].DESCRIPTION = data[0].DESCRIPTION
            this.tableData[event.SRNO - 1].SIEVE = data[0].SIEVE
            this.tableData[event.SRNO - 1].COLOR = data[0].DIVISIONMS
            this.tableData[event.SRNO - 1].CLARITY = data[0].CLARITY
            this.tableData[event.SRNO - 1].SHAPE = data[0].SHAPE
            this.tableData[event.SRNO - 1].DSIZE = data[0].SIZE
            this.tableData[event.SRNO - 1].SHAPE = data[0].SHAPE
            this.tableData[event.SRNO - 1].SIEVE_FROM = data[0].SIEVE_SET

            console.log('Dynamic data:', data[0]); // Debugging statement
          } else {
            this.comService.toastErrorByMsgId('MSG1531');
            return;
          }
        } else {
          this.comService.toastErrorByMsgId('MSG1747');
        }
      }, (err) => {
        console.error('API error:', err); // Debugging statement
        this.comService.closeSnackBarMsg();
        this.comService.toastErrorByMsgId('MSG1531');
      });

    this.subscriptions.push(Sub);
  }

  onFileChanged(event: any) {
    this.url = event.target.files[0].name
    console.log(this.url)
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.urls = reader.result;
      };
    }
  }


  // lookupKeyPress(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //   }
  // }

  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
      this.prefixCodeValidate()
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }

  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case 'code':
        this.overlaycodedescSearch.showOverlayPanel(event);
        break;
      // case 'codedes':
      //   this.overlaycodedescSearch.showOverlayPanel(event);
      //   break;
      case 'sizeSet':
        this.overlaysizeSetSearch.showOverlayPanel(event);
        break;
      case 'type':
        this.overlaytypeSearch.showOverlayPanel(event);
        break;
      case 'size':
        this.overlaysizeSearch.showOverlayPanel(event);
        break;
      case 'category':
        this.overlaycategorySearch.showOverlayPanel(event);
        break;
      case 'shape':
        this.overlayshapeSearch.showOverlayPanel(event);
        break;
      case 'settingType':
        this.overlaysettingTypeSearch.showOverlayPanel(event);
        break;
      case 'processSeq':
        this.overlayprocessSeqSearch.showOverlayPanel(event);
        break;
      case 'costCenter':
        this.overlaycostCenterSearch.showOverlayPanel(event);
        break;
      default:
    }
  }



  // showOverleyPanel(event: any, formControlName: string) {

  //   if (formControlName == 'codedes') {
  //     this.overlaycodedescSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'sizeSet') {
  //     this.overlaysizeSetSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'type') {
  //     this.overlaytypeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'size') {
  //     this.overlaysizeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'category') {
  //     this.overlaycategorySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'shape') {
  //     this.overlayshapeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'settingType') {
  //     this.overlaysettingTypeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'processSeq') {
  //     this.overlayprocessSeqSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'costCenter') {
  //     this.overlaycostCenterSearch.showOverlayPanel(event)
  //   }
  // }
}


