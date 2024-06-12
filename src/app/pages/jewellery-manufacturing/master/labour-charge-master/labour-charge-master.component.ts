import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormArrayName, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-labour-charge-master',
  templateUrl: './labour-charge-master.component.html',
  styleUrls: ['./labour-charge-master.component.scss']
})
export class LabourChargeMasterComponent implements OnInit {
  @Input() content!: any;
  viewMode: boolean = false;
  buttonField: boolean = true;
  forDesignOnlyTrue: boolean = true;
  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
  stockcodeDisable: boolean = false;
  brandDisable: boolean = false;

  currencyList: any[] = [];
  divisionMS: any = 'ID';
  salesRate: any;
  salesRatePercentage: any;
  salesRateMetal: any;
  salesRatePercentageMetal: any;
  editMode: boolean = false;
  grossWt: boolean = false;
  codeEnableMetal: boolean = true;
  codeEnableDiamond: boolean = true;
  isDisableSaveBtn: boolean = false;

  displayDiaCostRate: any;
  displayDiaSellingRate: any;
  displayDiaCtWtFrom: any;
  displayDiaCtWtTo: any;
  displayMetalCostRate: any;
  displayMetalSellingRate: any;
  displayMetalWtFrom: any;
  displayMetalWtTo: any;
  viewDisable: boolean = false;
  viewDisable1: boolean = false;

  viewselling: boolean = false;
  viewsellingrate: boolean = false;

  viewsellingrateMetal: boolean = false;
  viewsellingMetal: boolean = false;

  viewModeSetting: boolean = false;
  ViewModemethod: boolean = false;
  codeEnable1: boolean = true;
  codeEnable2: boolean = true;

  DialabourTypeList = [
    {
      name: 'SETTING',
      value: 'SETTING'
    },
    {
      name: 'HANDLING',
      value: 'HANDLING'
    },
    {
      name: 'CERTIFICATE',
      value: 'CERTIFICATE'
    },
    {
      name: 'GENERAL',
      value: 'GENERAL'
    },
  ];

  settingTypeList = [
    {
      name: 'GEN',
      value: 'GEN'
    },
    {
      name: 'PRESSURE',
      value: 'PRESSURE'
    },
  ];

  labourTypeList = [
    {
      name: 'MAKING',
      value: 'MAKING'
    },
    {
      name: 'POLISH',
      value: 'POLISH'
    },
    {
      name: 'FINISHING',
      value: 'FINISHING'
    },
    {
      name: 'CASTING',
      value: 'CASTING'
    },
    {
      name: 'GENERAL',
      value: 'GENERAL'
    },
    {
      name: 'RHODIUM',
      value: 'RHODIUM'
    },
    {
      name: 'STAMPING',
      value: 'STAMPING'
    },
    {
      name: 'WASTAGE',
      value: 'WASTAGE'
    },
  ];
  unitList = [
    {
      name: 'Lumpsum ',
      value: 'Lumpsum '
    },
    {
      name: 'PCS',
      value: 'PCS'
    },
    {
      name: 'Grams',
      value: 'Grams'
    },
    {
      name: 'Carat',
      value: 'Carat'
    },
    {
      name: 'Hours',
      value: 'Hours'
    }
  ];

  methodList = [
    {
      name: 'Hand Setting ',
      value: 'Hand Setting '
    },
    {
      name: 'Wax Setting',
      value: 'Wax Setting'
    },
    {
      name: 'Other Setting',
      value: 'Other Setting'
    },
    {
      name: 'GENERAL',
      value: 'GENERAL'
    },

  ];
  // master search data starts
  diaDivisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION='S'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  metalDivisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION='M'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  shapeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 33,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SHAPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true
  }

  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "process_code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
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
    LOAD_ONCLICK: true
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
    LOAD_ONCLICK: true
  }
  labouracCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Labour A/C',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sieveCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIEVE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true
  }
  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency',
    SEARCH_VALUE: '',
    WHERECONDITION: " CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 17,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true
  }
  colorData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COLOR MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true
  }
  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true
  }
  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true
  }

  subcategoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Subcategory Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SUB CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true
  }

  brandCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Brand Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'BRAND MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true
  }
  diamondlabourMasterForm: FormGroup = this.formBuilder.group({
    mid: [],
    divisions: ['', [Validators.required]],
    labour_code: ['', [Validators.required]],
    labour_description: ['', [Validators.required]],
    shape: [''],
    process: ['', [Validators.required]],
    size_from: [''],
    labour_ac: ['', [Validators.required]],
    size_to: [''],
    cost_rate: [0, [Validators.required]],
    sieve: [''],
    selling_rate: [''],
    sieve_desc: [''],
    selling: [''],
    ctWtFrom: [''],
    ctWtTo: [''],
    settingType: [''],
    labourType: ['', [Validators.required]],
    unitList: [''],
    method: [''],
    currency: ['', [Validators.required]],
    accessories: [''],
    BRANCH_CODE: [''],
  });


  metallabourMasterForm: FormGroup = this.formBuilder.group({
    mid: [],
    metalDivision: ['', [Validators.required]],
    stock_code: [''],
    metallabour_code: ['', [Validators.required]],
    metallabour_description: ['', [Validators.required]],
    metallabourType: ['', [Validators.required]],
    metalcurrency: ['', [Validators.required]],
    karat: ['', [Validators.required]],
    labourAc: ['', [Validators.required]],
    color: [''],
    metalcost_rate: ['', [Validators.required]],
    typecode: [''],
    metalselling_rate: [''],
    category: ['', [Validators.required]],
    metalSelling: [''],
    subCategory: [''],
    wastage: ['', [Validators.required]],
    brand: [''],
    metalunitList: ['', [Validators.required]],
    purity: [''],
    wtFrom: [''],
    wtTo: [''],
    onGrossWt: [false, [Validators.required]],
    forDesignOnly: [false, [Validators.required]],
  });

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Type',
    SEARCH_VALUE: '',
    WHERECONDITION: `DIVISION_CODE = '${this.metallabourMasterForm.value.metalDivision}' and SUBCODE = '0'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  @ViewChild('codeInput1') codeInput1!: ElementRef;
  @ViewChild('codeInput2') codeInput2!: ElementRef;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.renderer.selectRootElement('#code')?.focus();
    this.grossWt = true;
    this.codeEnable1 = true;
    this.setInitialValues();
    console.log(this.content)
    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
        this.viewDisable = true;
      } else if (this.content.FLAG == 'EDIT') {
        this.codeEnableDiamond = false;
        this.codeEnableMetal = false;
        this.editMode = true;
      } else if (this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteMeltingType()
      }
    }
    this.metallabourMasterForm.controls['stock_code'].enable();
    this.metallabourMasterForm.controls['color'].enable();
    this.metallabourMasterForm.controls['metallabourType'].enable();
    this.getcurrencyOptions()
  }


  inputValidate(event: any) {
    if (event.target.value != '') {
      this.isDisableSaveBtn = true;
    } else {
      this.isDisableSaveBtn = false;
    }
  }

  ngAfterViewInit() {
    // Focus on the first input
    if (this.codeInput1) {
      this.codeInput1.nativeElement.focus();
    }
    setTimeout(() => {
      if (this.codeInput2) {
        this.codeInput2.nativeElement.focus();
      }
    }, 2000); // Adjust the delay as needed
  }
  checkCode(): boolean {
    if (this.metallabourMasterForm.value.metallabour_code == '') {
      this.commonService.toastErrorByMsgId('Please Enter the Code')
      return true
    }
    return false
  }

  checkCodeDia(): boolean {
    if (this.diamondlabourMasterForm.value.labour_code == '') {
      this.commonService.toastErrorByMsgId('Please Enter the Code')
      return true
    }
    return false
  }

  codeEnabledMetal() {
    if (this.metallabourMasterForm.value.metallabour_code == '') {
      this.codeEnableMetal = true;
    }
    else {
      this.codeEnableMetal = false;
    }
  }

  onlabourtypeChange() {
    this.diamondlabourMasterForm.controls.method.setValue('GENERAL');
    this.diamondlabourMasterForm.get('labourType')?.valueChanges.subscribe((selectedLabourType) => {
      if (selectedLabourType === 'SETTING') {
        this.viewModeSetting = false;
        this.ViewModemethod = false;

      } else {

        this.viewModeSetting = true;
        this.ViewModemethod = true;
      }
    });
  }
  onSievetto(event: any) {
    if (this.diamondlabourMasterForm.value.size_form > this.diamondlabourMasterForm.value.size_to) {
      Swal.fire({
        title: event.message || ' Sieve To Should be greater than the Sieve From',
        text: '',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      })
    }
  }

  setFormValues() {
    if (!this.content) return
    this.diamondlabourMasterForm.controls.mid.setValue(this.content.MID);
    this.diamondlabourMasterForm.controls.labour_code.setValue(this.content.CODE);
    this.diamondlabourMasterForm.controls.labour_description.setValue(this.content.DESCRIPTION);
    this.diamondlabourMasterForm.controls.labourType.setValue(this.content.LABTYPE);
    this.diamondlabourMasterForm.controls.method.setValue(this.content.METHOD);
    this.diamondlabourMasterForm.controls.divisions.setValue(this.content.DIVISION_CODE);
    this.diamondlabourMasterForm.controls.shape.setValue(this.content.SHAPE);
    this.diamondlabourMasterForm.controls.size_from.setValue(this.content.SIZE_FROM);
    this.diamondlabourMasterForm.controls.size_to.setValue(this.content.SIZE_TO);
    this.diamondlabourMasterForm.controls.currency.setValue(this.content.CURRENCYCODE);
    this.diamondlabourMasterForm.controls.sieve.setValue(this.content.SIEVE);
    this.diamondlabourMasterForm.controls.process.setValue(this.content.PROCESS_TYPE);
    this.diamondlabourMasterForm.controls.sieve_desc.setValue(this.content.SIEVEFROM_DESC);
    this.diamondlabourMasterForm.controls.unitList.setValue(this.content.UNITCODE);
    this.diamondlabourMasterForm.controls.accessories.setValue(this.content.ACCESSORIES);
    this.diamondlabourMasterForm.controls.labour_ac.setValue(this.content.CRACCODE);


    this.diamondlabourMasterForm.controls.ctWtFrom.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.CARATWT_FROM));

    this.diamondlabourMasterForm.controls.ctWtTo.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.CARATWT_TO));

    this.diamondlabourMasterForm.controls.selling_rate.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.SELLING_RATE));

    this.diamondlabourMasterForm.controls.selling.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.SELLING_PER));

    this.diamondlabourMasterForm.controls.cost_rate.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.COST_RATE));



    this.metallabourMasterForm.controls.metallabour_code.setValue(this.content.CODE);
    this.metallabourMasterForm.controls.metallabour_description.setValue(this.content.DESCRIPTION);
    this.metallabourMasterForm.controls.metalDivision.setValue(this.content.DIVISION_CODE);
    this.metallabourMasterForm.controls.metalcurrency.setValue(this.content.CURRENCY_CODE);
    this.metallabourMasterForm.controls.wastage.setValue(this.content.WASTAGE_PER);
    this.metallabourMasterForm.controls.category.setValue(this.content.CATEGORY_CODE);
    this.metallabourMasterForm.controls.subCategory.setValue(this.content.SUB_CATEGORY_CODE);
    this.metallabourMasterForm.controls.brand.setValue(this.content.BRAND_CODE);
    this.metallabourMasterForm.controls.karat.setValue(this.content.KARAT_CODE);
    this.metallabourMasterForm.controls.stock_code.setValue(this.content.STOCK_CODE);
    this.metallabourMasterForm.controls.purity.setValue(this.content.PURITY);
    this.metallabourMasterForm.controls.color.setValue(this.content.COLOR);
    this.metallabourMasterForm.controls.forDesignOnly.setValue(this.content.FOR_DESIGN);
    this.metallabourMasterForm.controls.onGrossWt.setValue(this.content.ON_GROSSWT);
    this.metallabourMasterForm.controls.metalcost_rate.setValue(this.content.LAST_COST_RATE);
    this.metallabourMasterForm.controls.typecode.setValue(this.content.TYPE_CODE);

    this.metallabourMasterForm.controls.purity.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.PURITY));

    this.metallabourMasterForm.controls.metalselling_rate.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.LAST_SELLING_RATE));

    this.metallabourMasterForm.controls.metalcost_rate.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.LAST_COST_RATE));

    // this.metallabourMasterForm.controls.metalselling.setValue(
    //   this.commonService.transformDecimalVB(
    //     this.commonService.allbranchMaster?.BMQTYDECIMALS,
    //     this.content.METALSTONE));

  }

  private setInitialValues() {
    this.diamondlabourMasterForm.controls.settingType.setValue('GEN');
    // this.metallabourMasterForm.controls.wtFromdeci.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    // this.metallabourMasterForm.controls.wtToDeci.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.metallabourMasterForm.controls.metalcost_rate.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.metallabourMasterForm.controls.wtFrom.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.metallabourMasterForm.controls.wtTo.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.metallabourMasterForm.controls.metalselling_rate.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.metallabourMasterForm.controls.metalSelling.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.metallabourMasterForm.controls.metalcost_rate.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.metallabourMasterForm.controls.wastage.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))


    this.diamondlabourMasterForm.controls.BRANCH_CODE.setValue(this.commonService.branchCode)
    this.diamondlabourMasterForm.controls.cost_rate.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.diamondlabourMasterForm.controls.selling_rate.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.diamondlabourMasterForm.controls.selling.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.diamondlabourMasterForm.controls.ctWtFrom.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.diamondlabourMasterForm.controls.ctWtTo.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
  }

  divisionCodeSelected(e: any) {
    this.diamondlabourMasterForm.controls.divisions.setValue(e.DIVISION_CODE);
  }


  categorySelected(e: any) {
    if (this.checkCode()) return
    this.metallabourMasterForm.controls.category.setValue(e.CODE);
  }

  subcategorySelected(e: any) {
    if (this.checkCode()) return
    this.metallabourMasterForm.controls.subCategory.setValue(e.CODE);
  }

  brandSelected(e: any) {
    if (this.checkCode()) return
    this.metallabourMasterForm.controls.brand.setValue(e.CODE);
  }

  typeCodeSelected(e: any) {
    if (this.checkCode()) return
    this.metallabourMasterForm.controls.typecode.setValue(e.CODE);
  }

  colorDataSelected(data: any) {
    if (this.checkCode()) return
    this.metallabourMasterForm.controls.color.setValue(data.CODE)
  }

  metaldivisionCodeSelected(e: any) {
    this.metallabourMasterForm.controls.stock_code.setValue('');
    this.metallabourMasterForm.controls.metalDivision.setValue(e.DIVISION_CODE);
    this.stockCodeData.WHERECONDITION = `DIVISION_CODE = '${this.metallabourMasterForm.value.metalDivision}' and SUBCODE = '0'`;
  }

  labouracSelected(e: any) {
    if (this.checkCodeDia()) return
    this.diamondlabourMasterForm.controls.labour_ac.setValue(e.ACCODE);
  }

  labourAcSelected(e: any) {
    if (this.checkCode()) return
    this.metallabourMasterForm.controls.labourAc.setValue(e.ACCODE);
  }

  sieveSelected(e: any) {
    if (this.checkCodeDia()) return
    this.diamondlabourMasterForm.controls.sieve.setValue(e.CODE);
    this.diamondlabourMasterForm.controls.sieve_desc.setValue(e.DESCRIPTION);

  }

  stockCodeSelected(e: any) {
    if (this.checkCode()) return
    this.metallabourMasterForm.controls.stock_code.setValue(e.STOCK_CODE);
    this.metallabourMasterForm.controls.karat.setValue(e.KARAT_CODE);
    this.metallabourMasterForm.controls.purity.setValue(e.STD_PURITY);
    this.stockCodeData.WHERECONDITION = `DIVISION_CODE = '${this.metallabourMasterForm.value.metalDivision}' and SUBCODE = '0'`;
  }

  currencyCodeSelected(e: any) {
    if (this.checkCodeDia()) return
    this.diamondlabourMasterForm.controls.currency.setValue(e.CURRENCY_CODE);
  }

  metalcurrencyCodeSelected(e: any) {
    if (this.checkCode()) return
    this.metallabourMasterForm.controls.metalcurrency.setValue(e.CURRENCY_CODE);
  }

  karatCodeSelected(e: any) {
    if (this.checkCode()) return
    this.metallabourMasterForm.controls.karat.setValue(e.KARAT_CODE);
    this.metallabourMasterForm.controls.purity.setValue(e.STD_PURITY);
  }

  shapeCodeSelected(e: any) {
    if (this.checkCodeDia()) return
    this.diamondlabourMasterForm.controls.shape.setValue(e.CODE);
  }

  processCodeSelected(e: any) {
    if (this.checkCodeDia()) return
    this.diamondlabourMasterForm.controls.process.setValue(e.Process_Code);
  }
  sizeFromCodeSelected(e: any) {
    if (this.checkCodeDia()) return
    this.diamondlabourMasterForm.controls.size_from.setValue(e.CODE);
    this.sizeFromToValidate('size_from')
  }

  sizeToCodeSelected(e: any) {
    if (this.checkCodeDia()) return
    this.diamondlabourMasterForm.controls.size_to.setValue(e.CODE);
    this.sizeFromToValidate('size_to')
  }
  /**use: to check size from is greater than size to */
  sizeFromToValidate(data: string) {
    let form: any = this.diamondlabourMasterForm.value;
    let size_from: any;
    let size_to: any;
    if (form.size_from.includes('-')) {
      let val: any = form.size_from.split('-')
      size_from = val[1]
    } else {
      size_from = form.size_from
    }
    if (form.size_to.includes('-')) {
      let val: any = form.size_to.split('-')
      size_to = val[1]
    } else {
      size_to = form.size_from
    }
    // Retrieve the values of Ct Wt From and Ct Wt To from the form
    size_from = parseFloat(size_from.replace(/[+-]/g, ''));
    size_to = parseFloat(size_to.replace(/[+-]/g, ''));

    // if (data !== 'sizefrom') {
    // Check if Ct Wt From is greater than Ct Wt To
    if (size_from > size_to) {
      // Display an error message
      this.commonService.toastErrorByMsgId('Size From should be lesser than Weight To');
      // Clear the value of Ct Wt To input field
      this.diamondlabourMasterForm.controls.size_to.setValue('');
    }
    // }
  }

  // USE: get select options Process TypeMaster
  private getcurrencyOptions(): void {
    let API = '/BranchCurrencyMaster/GetBranchCurrencyMasterDetail/' + this.diamondlabourMasterForm.value.BRANCH_CODE;
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((result) => {
      if (result.response) {
        this.currencyList = result.response;
      }
    });
    this.subscriptions.push(Sub)
  }
  // USE: get diamondLabourCodeValidate
  diamondLabourCodeValidate(): void {
    if (this.viewMode || this.editMode) return;
    if (this.diamondlabourMasterForm.value.labour_code == '') {
      this.codeEnableDiamond = true;
      return
    }
    this.codeEnableDiamond = false;
    let API = 'LabourChargeMasterDj/GetLabourChargeMasterDjWithCode/' + this.diamondlabourMasterForm.value.labour_code;
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success") {
          this.commonService.toastErrorByMsgId('Code Already Exists')
          this.diamondlabourMasterForm.controls.labour_code.setValue('')
          this.renderer.selectRootElement('#code')?.focus();
        }
      });
    this.subscriptions.push(Sub)
  }

  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    const inputValue = event.target.value.toUpperCase();
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch`
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.getDynamicAPIwithParams(API, param)
      .subscribe((result) => {
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.diamondlabourMasterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'sieve') {
            if (FORMNAME === 'sieve') {
              console.log(FORMNAME)
              this.diamondlabourMasterForm.controls.sieve_desc.setValue('');
            }
          }
          return
        }
        const matchedItem = data.find((item: any) => item.CODE.toUpperCase() == inputValue);
              if (matchedItem) {
                this.diamondlabourMasterForm.controls[FORMNAME].setValue(matchedItem.CODE);
                if (FORMNAME === 'sieve') {
                  this.diamondlabourMasterForm.controls.sieve_desc.setValue(matchedItem.DESCRIPTION);
      
                }
              } else {
                this.commonService.toastErrorByMsgId('MSG1531');
                this.diamondlabourMasterForm.controls[FORMNAME].setValue('');
      
                    this.renderer.selectRootElement(FORMNAME).focus();
                    //this.diamondlabourMasterForm.controls(FORMNAME).focus();
      
                if (FORMNAME === 'sieve') {
                  this.diamondlabourMasterForm.controls.sieve_desc.setValue('');
                }
              }
      }, err => {
        this.commonService.toastErrorByMsgId('network issue found')
      })
    this.subscriptions.push(Sub)
  }

  // validateLookupField(event: any, LOOKUPDATA: any, FORMNAME: string) {
  //   const inputValue = event.target.value.toUpperCase();
  //   LOOKUPDATA.SEARCH_VALUE = event.target.value;

  //   if (event.target.value === '' || this.viewMode) return;

  //   let param = {
  //     LOOKUPID: LOOKUPDATA.LOOKUPID,
  //     WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${inputValue}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
  //   };

  //   let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch`;
  //   this.commonService.showSnackBarMsg('MSG81447');

  //   let Sub: Subscription = this.dataService.getDynamicAPIwithParams(API, param)
  //     .subscribe((result) => {
  //       let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0]);
  //       if (data.length == 0) {
  //         this.commonService.toastErrorByMsgId('MSG1531');
  //         this.diamondlabourMasterForm.controls[FORMNAME].setValue('');

  //         this.renderer.selectRootElement(FORMNAME).focus();
  //         LOOKUPDATA.SEARCH_VALUE = '';
  //         if (FORMNAME === 'sieve') {
  //           console.log(FORMNAME)
  //           this.diamondlabourMasterForm.controls.sieve_desc.setValue('');
  //         }
  //         return;
  //       }

  //       const matchedItem = data.find((item: any) => item.CODE === inputValue);
  //       if (matchedItem) {
  //         this.diamondlabourMasterForm.controls[FORMNAME].setValue(matchedItem.CODE);
  //         if (FORMNAME === 'sieve') {
  //           this.diamondlabourMasterForm.controls.sieve_desc.setValue(matchedItem.DESCRIPTION);

  //         }
  //       } else {
  //         this.commonService.toastErrorByMsgId('MSG1531');
  //         this.diamondlabourMasterForm.controls[FORMNAME].setValue('');

  //             this.renderer.selectRootElement(FORMNAME).focus();
  //             //this.diamondlabourMasterForm.controls(FORMNAME).focus();

  //         if (FORMNAME === 'sieve') {
  //           this.diamondlabourMasterForm.controls.sieve_desc.setValue('');
  //         }
  //       }
  //     }, err => {
  //       this.commonService.toastErrorByMsgId('network issue found');
  //     });

  //   this.subscriptions.push(Sub);
  // }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  submitValidation(): boolean {
    if (this.content && this.content.FLAG == 'VIEW') return true
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updatelabourChargeMaster()
      return true
    }
    if (this.diamondlabourMasterForm.invalid && this.metallabourMasterForm.invalid) {
      this.toastr.error('Select all required fields')
      return true
    }

    if (this.diamondlabourMasterForm.value.selling_rate == 0 && this.diamondlabourMasterForm.value.selling == 0) {
      this.toastr.error('Select Either Selling % or Selling Rate');
      return true
    }



    if (this.diamondlabourMasterForm.value.wtFrom > this.diamondlabourMasterForm.value.wtTo) {
      this.toastr.error('Weight From should be lesser than Weight To')
      return true
    }

    if (this.metallabourMasterForm.value.ctWtFrom > this.metallabourMasterForm.value.ctWtTo) {
      this.toastr.error('carat From should be lesser than Weight To')
      return true
    }

    if (this.metallabourMasterForm.value.size_from > this.metallabourMasterForm.value.size_to) {
      this.toastr.error('size From should be lesser than Weight To')
      return true
    }
    return false;
  }
  setPostData() {
    let diamondForm = this.diamondlabourMasterForm.value
    let metalForm = this.metallabourMasterForm.value
    return {
      "MID": this.content?.MID || 0,
      "SRNO": 0,
      "CODE": this.commonService.nullToString(diamondForm.labour_code?.toUpperCase()),
      "DESCRIPTION": this.commonService.nullToString(diamondForm.labour_description?.toUpperCase()),
      "LABTYPE": this.commonService.nullToString(diamondForm.labourType),
      "METHOD": this.commonService.nullToString(diamondForm.method),
      "DIVISION": this.commonService.nullToString(diamondForm.divisions),
      "SHAPE": this.commonService.nullToString(diamondForm.shape),
      "SIZE_FROM": this.commonService.nullToString(diamondForm.size_from),
      "SIZE_TO": this.commonService.nullToString(diamondForm.size_to),
      "CURRENCYCODE": this.commonService.nullToString(diamondForm.currency),
      "UNITCODE": this.commonService.nullToString(diamondForm.unitList),
      "COST_RATE": this.commonService.emptyToZero(diamondForm.cost_rate),
      "SELLING_RATE": this.commonService.emptyToZero(diamondForm.selling_rate),
      "LAST_COST_RATE": this.commonService.emptyToZero(metalForm.metalcost_rate),
      "LAST_SELLING_RATE": 0,
      "LAST_UPDATE": this.commonService.formatDateTime(this.commonService.currentDate),
      "CRACCODE": this.commonService.nullToString(diamondForm.labour_ac),
      "DIVISION_CODE": this.commonService.nullToString(diamondForm.divisions),
      "CURRENCY_CODE": this.commonService.nullToString(metalForm.currency),
      "SELLING_PER": this.commonService.emptyToZero(diamondForm.selling),
      "ACCESSORIES": diamondForm.accessories ? 1 : 0,
      "CARATWT_FROM": this.commonService.emptyToZero(diamondForm.ctWtFrom),
      "CARATWT_TO": this.commonService.emptyToZero(diamondForm.ctWtTo),
      "SIEVE": diamondForm.sieve,
      "WASTAGE_PER": this.commonService.emptyToZero(metalForm.wastage),
      "WASTAGE_AMT": 0,
      "TYPE_CODE": this.commonService.nullToString(metalForm.typecode),
      "CATEGORY_CODE": this.commonService.nullToString(metalForm.category),
      "SUB_CATEGORY_CODE": this.commonService.nullToString(metalForm.subCategory),
      "BRAND_CODE": this.commonService.nullToString(metalForm.brand),
      "PROCESS_TYPE": this.commonService.nullToString(diamondForm.settingType),
      "KARAT_CODE": this.commonService.nullToString(metalForm.karat),
      "METALSTONE": "S",
      "STOCK_CODE": this.commonService.nullToString(metalForm.stock_code),
      "PURITY": this.commonService.emptyToZero(this.metallabourMasterForm.value.purity),
      "COLOR": this.commonService.nullToString(metalForm.color),
      "FOR_DESIGN": true,
      "SIEVEFROM_DESC": diamondForm.sieve_desc,
      "ON_GROSSWT": true,
    }
  }
  formSubmit() {
    if (this.submitValidation()) return

    let API = 'LabourChargeMasterDj/InsertLabourChargeMaster'
    let postData = this.setPostData();

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result: any) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result?.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.diamondlabourMasterForm.reset()
                this.metallabourMasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }
        , err => alert('save ' + err)
      )
    this.subscriptions.push(Sub)
  }

  updatelabourChargeMaster() {

    if (this.diamondlabourMasterForm.value.wtFrom > this.diamondlabourMasterForm.value.wtTo) {
      this.toastr.error('Weight From should be lesser than Weight To')
      return
    }

    let API = 'LabourChargeMasterDj/UpdateLabourChargeMaster/' + this.content.CODE;
    let postData = this.setPostData()
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.diamondlabourMasterForm.reset()
                this.metallabourMasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert('update ' + err))
    this.subscriptions.push(Sub)
  }

  /**USE: delete Melting Type From Row */
  deleteMeltingType() {
    debugger
    if (this.content && this.content.FLAG == 'VIEW') return
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
        let API = 'LabourChargeMasterDj/DeleteLabourChargeMaster/' + this.content.CODE;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.diamondlabourMasterForm.reset()
                    this.metallabourMasterForm.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.diamondlabourMasterForm.reset()
                    this.metallabourMasterForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert('delete ' + err))
        this.subscriptions.push(Sub)
      }
    });
  }

  onforDesignOnlyChange(event: any) {
    if (event.checked === true) {
      this.stockcodeDisable = true;
      this.viewDisable1 = true;
      this.metallabourMasterForm.controls['stock_code'].disable();
      this.metallabourMasterForm.controls['stock_code'].setValue('');
      this.metallabourMasterForm.controls['karat'].disable();
      this.metallabourMasterForm.controls['karat'].setValue('');
      this.metallabourMasterForm.controls['color'].disable();
      this.metallabourMasterForm.controls['color'].setValue('');
      this.metallabourMasterForm.controls['metallabourType'].disable();
      this.metallabourMasterForm.controls['metallabourType'].setValue('');
      this.metallabourMasterForm.controls['metalunitList'].disable();
      this.metallabourMasterForm.controls['metalunitList'].setValue('');
      this.metallabourMasterForm.controls['typecode'].disable();
      this.metallabourMasterForm.controls['typecode'].setValue('');
      this.metallabourMasterForm.controls['category'].disable();
      this.metallabourMasterForm.controls['category'].setValue('');
      this.metallabourMasterForm.controls['subCategory'].disable();
      this.metallabourMasterForm.controls['subCategory'].setValue('');
    }
    else {
      this.stockcodeDisable = false;
      this.viewDisable1 = false;
      this.metallabourMasterForm.controls['stock_code'].enable();
      this.metallabourMasterForm.controls['color'].enable();
      this.metallabourMasterForm.controls['metallabourType'].enable();
      this.metallabourMasterForm.controls['metalunitList'].enable();
      this.metallabourMasterForm.controls['typecode'].enable();
      this.metallabourMasterForm.controls['karat'].enable();
      this.metallabourMasterForm.controls['subCategory'].enable();
      this.metallabourMasterForm.controls['category'].enable();

    }
  }

  onforongrossOnlyChange(event: any) {

    if (event.checked === true) {
      this.brandDisable = true;
      this.metallabourMasterForm.controls['brand'].disable();
      this.metallabourMasterForm.controls['brand'].setValue('');
    }
    else {
      this.brandDisable = false;
      this.metallabourMasterForm.controls['brand'].enable();
    }
  }

  DiaCostRatekeyupvalue(e: any) {
    this.displayDiaCostRate = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  DiaSellingRatekeyupvalue(e: any) {
    this.displayDiaSellingRate = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  DiaCtWtFromkeyupvalue(e: any) {
    this.displayDiaCtWtFrom = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // DiaCtWtTokeyupvalue(e: any) {
  //   this.displayDiaCtWtTo = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // }

  MetalCostRatekeyupvalue(e: any) {
    this.displayMetalCostRate = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  MetalSellingRatekeyupvalue(e: any) {
    this.displayMetalSellingRate = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  MetalWtFromkeyupvalue(e: any) {
    this.displayMetalWtFrom = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  MetalWtTokeyupvalue(e: any) {
    this.displayMetalWtTo = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  // onweightto(event: any, data: String) {
  //   let wtf = this.metallabourMasterForm.value.wtFrom;
  //   let wtt = this.metallabourMasterForm.value.wtTo;
  //   if (data != 'wtFrom') {
  //     if (wtf > wtt) {
  //       Swal.fire({
  //         title: event.message || 'Weight From should be lesseTr than Weight To',
  //         text: '',
  //         icon: 'error',
  //         confirmButtonColor: '#336699',
  //         confirmButtonText: 'Ok'
  //       })
  //       this.metallabourMasterForm.controls.wtTo.setValue('');
  //     }

  //   }
  // }

  //onweightto(event: any, data: string) {
  //   // Retrieve the values of Wt From and Wt To from the form
  //   const wtf: number = parseFloat(this.metallabourMasterForm.value.wtFrom);
  //   const wtt: number = parseFloat(this.metallabourMasterForm.value.wtTo);

  //   // Check if the data parameter is not 'wtfrom'
  //   if (data !== 'wtfrom') {
  //     // Check if Wt From is greater than Wt To
  //     if (wtf > wtt) {
  //       // Display an error message
  //       Swal.fire({
  //         title: event.message || 'Weight From should be lesser than Weight To',
  //         text: '',
  //         icon: 'error',
  //         confirmButtonColor: '#336699',
  //         confirmButtonText: 'Ok'
  //       });

  //       // Clear the value of Wt To input field
  //       this.metallabourMasterForm.controls.wtTo.setValue('');
  //     }
  //   }
  // }


  //  onCtweighttto(event: any, data: String) {
  //   let Ctwtf = this.diamondlabourMasterForm.value.ctWtFrom;
  //   let Ctwtt = this.diamondlabourMasterForm.value.ctWtTo;
  //   if (data != 'Ctwtfrom') {
  //     if (Ctwtf > Ctwtt) {
  //       Swal.fire({
  //         title: event.message || 'Weight From sHhould be lesser than Weight To',
  //         text: '',
  //         icon: 'error',
  //         confirmButtonColor: '#336699',
  //         confirmButtonText: 'Ok'
  //       })
  //       this.diamondlabourMasterForm.controls.ctWtTo.setValue('');
  //     }
  //   }


  // }

  onCtweighttto(event: any, data: string) {
    // Retrieve the values of Ct Wt From and Ct Wt To from the form
    const Ctwtf: number = parseFloat(this.diamondlabourMasterForm.value.ctWtFrom);
    const Ctwtt: number = parseFloat(this.diamondlabourMasterForm.value.ctWtTo);

    // Check if the data parameter is not 'Ctwtfrom'
    if (data == 'Ctwtto') {
      // Check if Ct Wt From is greater than Ct Wt To
      if (Ctwtf > Ctwtt) {
        // Display an error message
        Swal.fire({
          title: event.message || 'Weight From should be lesser than Weight To',
          text: '',
          icon: 'error',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        });

        // Clear the value of Ct Wt To input field
        this.diamondlabourMasterForm.controls.ctWtTo.setValue('');
      }
    }
  }

  unitSelected() {
    this.metallabourMasterForm.get('metalunitList')?.valueChanges.subscribe((selectedLabourType) => {
      const settingTypeControl = this.metallabourMasterForm.get('metalunitList');
      const methodControl = this.metallabourMasterForm.get('onGrossWt');
      if (selectedLabourType === 'Grams') {
        this.grossWt = false;

      } else {
        this.grossWt = true;
        this.metallabourMasterForm.controls.onGrossWt.setValue(false);
      }
    });
  }

  WtcodeEnabled() {
    if (this.metallabourMasterForm.value.wtFrom == '') {
      this.codeEnable1 = true;
    }
    else {
      this.codeEnable1 = false;
    }
  }

  CtWtcodeEnabled() {
    if (this.diamondlabourMasterForm.value.ctWtFrom == '') {
      this.codeEnable2 = true;
    }
    else {
      this.codeEnable2 = false;
    }

  }

  salesChange(data: any) {
    if (data == 'metalSelling') {
      this.viewsellingrateMetal = true;
      this.viewsellingMetal = false;
      this.metallabourMasterForm.controls.metalselling_rate.setValue('');
    } else if (data == 'metalselling_rate') {
      this.viewsellingMetal = true;
      this.viewsellingrateMetal = false;
      this.metallabourMasterForm.controls.metalSelling.setValue('');
    } else {
      this.viewsellingMetal = false;
      this.viewsellingrateMetal = false;
    }

  }

  salesChangesDia(data: any) {
    if (data == 'selling') {
      this.viewsellingrate = true;
      this.viewselling = false;
      this.diamondlabourMasterForm.controls.selling_rate.setValue('');
    } else if (data == 'selling_rate') {
      this.viewselling = true;
      this.viewsellingrate = false;
      this.diamondlabourMasterForm.controls.selling.setValue('');
    } else {
      this.viewselling = false;
      this.viewsellingrate = false;
    }

  }

}
