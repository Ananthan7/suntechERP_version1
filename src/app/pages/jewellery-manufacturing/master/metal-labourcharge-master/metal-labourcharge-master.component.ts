import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { Console } from 'console';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';

@Component({
  selector: 'app-metal-labourcharge-master',
  templateUrl: './metal-labourcharge-master.component.html',
  styleUrls: ['./metal-labourcharge-master.component.scss']
})
export class MetalLabourchargeMasterComponent implements OnInit {
  @ViewChild('overlaymetalDivisionSearch') overlaymetalDivisionSearch!: MasterSearchComponent;
  @ViewChild('overlaystockcodeSearch') overlaystockcodeSearch!: MasterSearchComponent;
  @ViewChild('overlaymetalcurrencySearch') overlaymetalcurrencySearch!: MasterSearchComponent;
  @ViewChild('overlaykaratSearch') overlaykaratSearch!: MasterSearchComponent;
  @ViewChild('overlaylabourAcSearch') overlaylabourAcSearch!: MasterSearchComponent;
  @ViewChild('overlaycolorSearch') overlaycolorSearch!: MasterSearchComponent;
  @ViewChild('overlaytypeSearch') overlaytypeSearch!: MasterSearchComponent;
  @ViewChild('overlaycategorySearch') overlaycategorySearch!: MasterSearchComponent;
  @ViewChild('overlaysubCategorySearch') overlaysubCategorySearch!: MasterSearchComponent;
  @ViewChild('overlaybrandSearch') overlaybrandSearch!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;


  @Input() content!: any;
  viewMode: boolean = false;
  editModeKarat: boolean = false;
  editDisableModeKarat = false;
  buttonField: boolean = true;
  forDesignOnlyTrue: boolean = true;
  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
  stockcodeDisable: boolean = true;
  brandDisable: boolean = false;
  codedisable: boolean = false;
  PurityEditMode: boolean = true;
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
    selling_rate: ['', [Validators.required]],
    sieve_desc: [''],
    selling: [''],
    ctWtFrom: [''],
    ctWtTo: [''],
    settingType: [''],
    labourType: ['', [Validators.required]],
    unitList: [''],
    method: ['', [Validators.required]],
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
    karat: [''],
    labourAc: ['', [Validators.required]],
    color: [''],
    metalcost_rate: [''],
    typecode: [''],
    metalselling_rate: ['', [Validators.required]],
    category: [''],
    metalSelling: ['', [Validators.required]],
    subCategory: [''],
    wastage: [''],
    brand: [''],
    metalunitList: ['', [Validators.required]],
    purity: [''],
    wtFrom: [''],
    wtTo: [''],
    variance: [''],
    onGrossWt: [false],
    forDesignOnly: [false],
  });



  @ViewChild('codeInput1') codeInput1!: ElementRef;
  @ViewChild('codeInput2') codeInput2!: ElementRef;
  srno: any;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.setInitialValues();
    this.setFormValues();
    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      this.viewDisable = true;
      this.unitSelected();
    } else if (this.content.FLAG == 'EDIT') {
      this.editMode = true;
      this.codeEnableMetal = false;
      this.stockcodeDisable = false;
      this.editModeKarat = true;
      this.editDisableModeKarat = true;
      this.unitSelected();
    } else if (this.content.FLAG == 'DELETE') {
      this.viewMode = true;
      this.deleteMeltingType()
    }



    this.grossWt = true;
    this.codeEnable1 = true;



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


  Attachedfile: any[] = [];
  savedAttachments: any[] = [];

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {

    this.Attachedfile = file
    console.log(this.Attachedfile);

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
      this.commonService.toastErrorByMsgId('MSG1124')// Please Enter the Code
      return true
    }
    return false
  }

  checkCodeDia(): boolean {
    if (this.diamondlabourMasterForm.value.labour_code == '') {
      this.commonService.toastErrorByMsgId('MSG1124')// Please Enter the Code
      return true
    }
    return false
  }

  codeEnabledMetal() {
    if (this.metallabourMasterForm.value.metallabour_code == '') {
      this.codeEnableMetal = true;
      this.commonService.toastErrorByMsgId('MSG1124')// Please Enter the Code
    }
    else {
      this.codeEnableMetal = false;
    }
  }

  onlabourtypeChange() {
    this.diamondlabourMasterForm.get('labourType')?.valueChanges.subscribe((selectedLabourType) => {
      const settingTypeControl = this.diamondlabourMasterForm.get('settingType');
      const methodControl = this.diamondlabourMasterForm.get('method');
      if (selectedLabourType === 'SETTING') {
        this.viewModeSetting = false;
        this.ViewModemethod = false;

        // settingTypeControl;
        // methodControl?.enable();
      } else {
        // settingTypeControl?.disable();
        // methodControl?.disable();
        this.viewModeSetting = true;
        this.ViewModemethod = true;
        this.diamondlabourMasterForm.controls.settingType.setValue('');
        this.diamondlabourMasterForm.controls.method.setValue('');
      }
      // console.log(this.settingTypeList);
    });
  }

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

  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.metallabourMasterForm.controls[formControlName].setValue(
      this.commonService.setCommaSerperatedNumber(value, Decimal)
    )
  }


  setFormValues() {
    if (!this.content) return
    //   this.diamondlabourMasterForm.controls.mid.setValue(this.content.MID);
    //   this.diamondlabourMasterForm.controls.labour_code.setValue(this.content.CODE);
    //   this.diamondlabourMasterForm.controls.labour_description.setValue(this.content.DESCRIPTION);
    //  // this.diamondlabourMasterForm.controls.metallabourType.setValue(this.content.LABTYPE);
    //   this.diamondlabourMasterForm.controls.method.setValue(this.content.METHOD);
    //   this.diamondlabourMasterForm.controls.divisions.setValue(this.content.DIVISION);
    //   this.diamondlabourMasterForm.controls.shape.setValue(this.content.SHAPE);
    //   this.diamondlabourMasterForm.controls.size_from.setValue(this.content.SIZE_FROM);
    //   this.diamondlabourMasterForm.controls.size_to.setValue(this.content.SIZE_TO);
    //   this.diamondlabourMasterForm.controls.currency.setValue(this.content.CURRENCYCODE);
    //   this.diamondlabourMasterForm.controls.sieve.setValue(this.content.SIEVE);
    //   this.diamondlabourMasterForm.controls.process.setValue(this.content.PROCESS_TYPE);
    //   this.diamondlabourMasterForm.controls.sieve_desc.setValue(this.content.SIEVEFROM_DESC);

    //   this.diamondlabourMasterForm.controls.ctWtFrom.setValue(
    //     this.commonService.transformDecimalVB(
    //       this.commonService.allbranchMaster?.BMQTYDECIMALS,
    //       this.content.CARATWT_FROM));

    //   this.diamondlabourMasterForm.controls.ctWtTo.setValue(
    //     this.commonService.transformDecimalVB(
    //       this.commonService.allbranchMaster?.BMQTYDECIMALS,
    //       this.content.CARATWT_TO));

    //   this.diamondlabourMasterForm.controls.selling_rate.setValue(
    //     this.commonService.transformDecimalVB(
    //       this.commonService.allbranchMaster?.BMQTYDECIMALS,
    //       this.content.SELLING_RATE));

    //   this.diamondlabourMasterForm.controls.selling.setValue(
    //     this.commonService.transformDecimalVB(
    //       this.commonService.allbranchMaster?.BMQTYDECIMALS,
    //       this.content.SELLING_PER));

    //   this.diamondlabourMasterForm.controls.cost_rate.setValue(
    //     this.commonService.transformDecimalVB(
    //       this.commonService.allbranchMaster?.BMQTYDECIMALS,
    //       this.content.COST_RATE));

    // this.metallabourMasterForm.controls.ctWtFrom.setValue(
    //   this.commonService.transformDecimalVB(
    //     this.commonService.allbranchMaster?.BMQTYDECIMALS,
    //     this.content.CARATWT_FROM));

    this.metallabourMasterForm.controls.metallabourType.setValue(this.content.LABTYPE);
    this.metallabourMasterForm.controls.metalunitList.setValue(this.content.UNITCODE);
    this.metallabourMasterForm.controls.labourAc.setValue(this.content.CRACCODE);
    this.metallabourMasterForm.controls.metallabour_code.setValue(this.content.CODE);
    this.metallabourMasterForm.controls.metallabour_description.setValue(this.content.DESCRIPTION);
    this.metallabourMasterForm.controls.metalDivision.setValue(this.content.DIVISION_CODE);
    this.metallabourMasterForm.controls.metalcurrency.setValue(this.content.CURRENCYCODE);
    // this.metallabourMasterForm.controls.wastage.setValue(this.content.WASTAGE_PER);
    this.metallabourMasterForm.controls.category.setValue(this.content.CATEGORY_CODE);
    this.metallabourMasterForm.controls.subCategory.setValue(this.content.SUB_CATEGORY_CODE);
    this.metallabourMasterForm.controls.brand.setValue(this.content.BRAND_CODE);
    this.metallabourMasterForm.controls.karat.setValue(this.content.KARAT_CODE);
    this.metallabourMasterForm.controls.stock_code.setValue(this.content.STOCK_CODE);
    // this.metallabourMasterForm.controls.purity.setValue(this.commonService.decimalQuantityFormat(this.content.PURITY, "RATE"));
    this.metallabourMasterForm.controls.metalSelling.setValue(this.content.SELLING_PER);
    this.metallabourMasterForm.controls.color.setValue(this.content.COLOR);
    this.metallabourMasterForm.controls.forDesignOnly.setValue(this.viewchangeYorN(this.content.FOR_DESIGN));
    this.metallabourMasterForm.controls.onGrossWt.setValue(this.viewchangeYorN(this.content.ON_GROSSWT));
    //  this.metallabourMasterForm.controls.metalcost_rate.setValue(this.content.COST_RATE);
    this.metallabourMasterForm.controls.typecode.setValue(this.content.TYPE_CODE);
    this.metallabourMasterForm.controls.wtFrom.setValue(this.content.CARATWT_FROM);
    this.metallabourMasterForm.controls.wtTo.setValue(this.content.CARATWT_TO);
    // this.metallabourMasterForm.controls.variance.setValue(this.content.VAR_PER);
    this.metallabourMasterForm.controls.metalSelling.setValue(this.content.SELLING_PER);


    this.stockCodeData.WHERECONDITION = `DIVISION_CODE = '${this.metallabourMasterForm.value.metalDivision}' and SUBCODE = '0'`;


    this.metallabourMasterForm.controls.purity.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.PURITY));

    // this.metallabourMasterForm.controls.wastage.setValue(
    //   this.commonService.transformDecimalVB(
    //     this.commonService.allbranchMaster?.BMQTYDECIMALS,
    //     this.content.WASTAGE_PER));

    this.metallabourMasterForm.controls.variance.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.VAR_PER));

    this.metallabourMasterForm.controls.wtFrom.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.CARATWT_FROM));

    this.metallabourMasterForm.controls.wtTo.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.CARATWT_TO));


    // this.metallabourMasterForm.controls.metalselling_rate.setValue(
    //   this.commonService.commaSeperation(this.content.SELLING_RATE)
    // )


    // this.metallabourMasterForm.controls.metalselling_rate.setValue(
    //   this.commonService.transformDecimalVB(
    //     this.commonService.allbranchMaster?.BAMTDECIMALS,
    //     this.content.SELLING_RATE));

    // this.metallabourMasterForm.controls.metalcost_rate.setValue(
    //   this.commonService.commaSeperation(this.content.COST_RATE)
    // )

    // this.metallabourMasterForm.controls.metalcost_rate.setValue(
    //   this.commonService.transformDecimalVB(
    //     this.commonService.allbranchMaster?.BAMTDECIMALS,
    //     this.content.COST_RATE));

    // this.metallabourMasterForm.controls.metalSelling.setValue(
    //   this.commonService.commaSeperation(this.content.SELLING_PER)
    // )

    // Set the selling rate with comma separator and decimals
    this.metallabourMasterForm.controls.metalselling_rate.setValue(
      Number(this.content.SELLING_RATE).toLocaleString('en-US', {
        minimumFractionDigits: this.commonService.allbranchMaster?.BAMTDECIMALS,
        maximumFractionDigits: this.commonService.allbranchMaster?.BAMTDECIMALS
      })
    );

    // Set the cost rate with comma separator and decimals
    // this.metallabourMasterForm.controls.metalcost_rate.setValue(
    //   Number(this.content.COST_RATE).toLocaleString('en-US', {
    //     minimumFractionDigits: this.commonService.allbranchMaster?.BAMTDECIMALS,
    //     maximumFractionDigits: this.commonService.allbranchMaster?.BAMTDECIMALS
    //   })
    // );


    this.metallabourMasterForm.controls.metalSelling.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.SELLING_PER));

    this.metallabourMasterForm.controls.wastage.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.WASTAGE_PER));


    let API = 'LabourChargeMasterDj/GetLabourChargeMasterDetails/' + this.content.MID;
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((result) => {
      if (result.response) {
        this.metallabourMasterForm.controls.purity.setValue(this.commonService.decimalQuantityFormat(result.response.PURITY, "RATE"));

      }
    });

  }

  viewchangeYorN(e: any) {
    // console.log(e);

    if (e == 'Y') {
      return true;
    } else {
      return false;
    }
  }

  private setInitialValues() {
    // this.metallabourMasterForm.controls.wtFromdeci.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    // this.metallabourMasterForm.controls.wtToDeci.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.metallabourMasterForm.controls.metalcost_rate.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.metallabourMasterForm.controls.wtFrom.setValue('.000')
    this.metallabourMasterForm.controls.wtTo.setValue('.000')
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
    //this.stockcodeDisable = false
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
    this.metallabourMasterForm.controls.stock_code.setValue(e.STOCK_CODE);
    this.metallabourMasterForm.controls.karat.setValue(e.KARAT_CODE);
    this.metallabourMasterForm.controls.purity.setValue(e.STD_PURITY);
    this.getKaratcode()
    if (this.metallabourMasterForm.value.stock_code == '') {
      this.metallabourMasterForm.controls.karat.setValue('');
      this.metallabourMasterForm.controls.typecode.setValue('');
      this.metallabourMasterForm.controls.category.setValue('');
      this.metallabourMasterForm.controls.subCategory.setValue('');
      this.metallabourMasterForm.controls.brand.setValue('');
      this.metallabourMasterForm.controls.purity.setValue('');
    }
  }

  codeDisable() {

    if (this.metallabourMasterForm.value.stock_code == '') {
      this.codedisable = false;
      this.metallabourMasterForm.controls.karat.setValue('');
      this.metallabourMasterForm.controls.typecode.setValue('');
      this.metallabourMasterForm.controls.category.setValue('');
      this.metallabourMasterForm.controls.subCategory.setValue('');
      this.metallabourMasterForm.controls.brand.setValue('');
      this.metallabourMasterForm.controls.purity.setValue('');
    } else {
      this.codedisable = true;
    }

  }

  getKaratcode() {
    this.codeDisable()

    let API = 'MetalStockMaster/GetMetalStockMasterHeaderAndDetail/' + this.metallabourMasterForm.value.stock_code + "/" + this.metallabourMasterForm.value.metalDivision;
    if (this.metallabourMasterForm.value.stock_code != '') {
      this.codedisable = true;
      let Sub: Subscription = this.dataService.getDynamicAPI(API)
        .subscribe((result) => {
          if (result.status == "Success") {
            this.metallabourMasterForm.controls['karat'].setValue(result.response.KARAT_CODE);
            this.metallabourMasterForm.controls['purity'].setValue(this.commonService.decimalQuantityFormat(result.response.PURITY, "RATE"));
            this.metallabourMasterForm.controls['brand'].setValue(result.response.BRAND_CODE);
            this.metallabourMasterForm.controls['category'].setValue(result.response.CATEGORY_CODE);
            this.metallabourMasterForm.controls['subCategory'].setValue(result.response.SUB_CATEGORY_CODE);
            this.metallabourMasterForm.controls['typecode'].setValue(result.response.TYPE_CODE);
            this.metallabourMasterForm.controls['color'].setValue(result.response.COLOR_CODE);
          }

        }, err => {
          this.commonService.toastErrorByMsgId('MSG81451')//Server Error occured, please try again
        })
      this.subscriptions.push(Sub)

    }else {
      this.codedisable = false;
    }

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
      this.commonService.toastErrorByMsgId('MSG81517') //Size From should be lesser than Size To
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
    if (this.metallabourMasterForm.value.metallabour_code == '') {
      this.codeEnableDiamond = true;
      return
    }
    this.codeEnableDiamond = false;
    let API = 'LabourChargeMasterDj/GetLabourChargeMasterDjWithCode/' + this.metallabourMasterForm.value.metallabour_code;
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success") {
          this.commonService.toastErrorByMsgId('MSG1121')//Code Already Exists
          this.metallabourMasterForm.controls.metallabour_code.setValue('')
        }
      });
    this.subscriptions.push(Sub)
  }
  /**use: validate all lookups to check data exists in db */
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    this.stockCodeData.WHERECONDITION = `DIVISION_CODE = '${this.metallabourMasterForm.value.metalDivision}' and SUBCODE = '0'`;
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    this.stockcodeDisable = false;
    if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.metallabourMasterForm.controls[FORMNAME].setValue('')
          // this.renderer.selectRootElement(FORMNAME).focus();
          LOOKUPDATA.SEARCH_VALUE = ''
          this.openOverlay(FORMNAME, event);
          return
        }


      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  openOverlay(FORMNAME: string, event: any) {
    switch (FORMNAME) {
      case 'color':
        this.overlaycolorSearch.showOverlayPanel(event);
        break;
      case 'metalDivision':
        this.overlaymetalDivisionSearch.showOverlayPanel(event);
        break;
      case 'metalDivision':
        this.overlaymetalDivisionSearch.showOverlayPanel(event);
        break;
      case 'stock_code':
        this.overlaystockcodeSearch.showOverlayPanel(event);
        break;
      case 'metalcurrency':
        this.overlaymetalcurrencySearch.showOverlayPanel(event);
        break;
      case 'karat':
        this.overlaykaratSearch.showOverlayPanel(event);
        break;
      case 'labourAc':
        this.overlaylabourAcSearch.showOverlayPanel(event);
        break;
      case 'typecode':
        this.overlaytypeSearch.showOverlayPanel(event);
        break;
      case 'category':
        this.overlaycategorySearch.showOverlayPanel(event);
        break;
      case 'subCategory':
        this.overlaysubCategorySearch.showOverlayPanel(event);
        break;
      case 'brand':
        this.overlaybrandSearch.showOverlayPanel(event);
        break;
      default:
        console.warn(`Unknown FORMNAME: ${FORMNAME}`);
        break;
    }
  }


  // validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {

  //   this.stockCodeData.WHERECONDITION = `DIVISION_CODE = '${this.metallabourMasterForm.value.metalDivision}' and SUBCODE = '0'`;
  //   LOOKUPDATA.SEARCH_VALUE = event.target.value

  //   this.stockcodeDisable = false;
  //   if (event.target.value == '' || this.viewMode == true) return
  //   let param = {
  //     LOOKUPID: LOOKUPDATA.LOOKUPID,
  //     WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
  //   }
  //   this.commonService.showSnackBarMsg('MSG81447');
  //   let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
  //   let Sub: Subscription = this.dataService.getDynamicAPI(API)
  //     .subscribe((result) => {
  //       let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
  //       this.isDisableSaveBtn = false;
  //       if (data.length == 0) {
  //         this.commonService.toastErrorByMsgId('MSG1531')
  //         this.metallabourMasterForm.controls[FORMNAME].setValue('')
  //         this.renderer.selectRootElement(FORMNAME).focus();
  //         LOOKUPDATA.SEARCH_VALUE = ''
  //         return
  //       }
  //     }, err => {
  //       this.commonService.toastErrorByMsgId('network issue found')
  //     })
  //   this.subscriptions.push(Sub)
  // }

  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

  close(data?: any) {
    if (data) {
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW') {
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




  // metalDivision: ['', [Validators.required]],
  // metallabour_code: ['', [Validators.required]],
  // metallabour_description: ['', [Validators.required]],
  // metallabourType: ['', [Validators.required]],
  // metalcurrency: ['', [Validators.required]],
  // metalunitList: ['', [Validators.required]],

  submitValidation(form: any) {
    if (this.commonService.nullToString(form.metalDivision) == '') {
      this.commonService.toastErrorByMsgId('MSG1207') //"metalDivision cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.metallabour_code) == '') {
      this.commonService.toastErrorByMsgId('MSG1365')//"labour_code cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.metallabour_description) == '') {
      this.commonService.toastErrorByMsgId('MSG1193')//"labour_description cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.metallabourType) == '') {
      this.commonService.toastErrorByMsgId('MSG7820')//"labourType cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.metalcurrency) == '') {
      this.commonService.toastErrorByMsgId('MSG1173')//"currency cannot be empty"
      return true
    }
    else if (this.metallabourMasterForm.value.labourAc === '') {
      this.commonService.toastErrorByMsgId('MSG1366');//"labour_ac cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.metalunitList) == '') {
      this.commonService.toastErrorByMsgId('MSG1927')//"unitList cannot be empty"
      return true
    }
    // else if (
    //   this.commonService.nullToString(form.metalcost_rate) === '' ||
    //   this.commonService.nullToString(form.metalcost_rate) === '0' ||
    //   this.commonService.nullToString(form.metalcost_rate) === '0.00' ||
    //   /^0{2,}\.00$/.test(this.commonService.nullToString(form.metalcost_rate))
    // ) {
    //   this.commonService.toastErrorByMsgId('Cost Rate cannot be empty'); // "Cost Rate cannot be empty"
    //   return true;
    // }
    if (this.metallabourMasterForm.value.wtFrom > this.metallabourMasterForm.value.wtTo) {
      this.commonService.toastErrorByMsgId('MSG7884')// Weight From should be lesser than Weight To
      return true
    }

    if (this.commonService.nullToString(form.wtFrom) == "0.00" ||
      this.commonService.nullToString(form.wtFrom) === '' ||
      this.commonService.nullToString(form.wtFrom) === '0' ||
      /^0{2,}\.00$/.test(this.commonService.nullToString(form.wtFrom))) {
      this.commonService.toastErrorByMsgId('MSG3565')// 
      return true
    }

    if (this.metallabourMasterForm.value.wtTo == "0.00" ||
      this.commonService.nullToString(form.wtTo) === '' ||
      this.commonService.nullToString(form.wtTo) === '0' ||
      /^0{2,}\.00$/.test(this.commonService.nullToString(form.wtTo))) {
      this.commonService.toastErrorByMsgId('MSG3565')// 
      return true
    }

    if (this.metallabourMasterForm.value.ctWtFrom > this.metallabourMasterForm.value.ctWtTo) {
      this.commonService.toastErrorByMsgId('MSG3765')// carat From should be lesser than Weight To
      return true
    }

    if (this.metallabourMasterForm.value.size_from > this.metallabourMasterForm.value.size_to) {
      this.commonService.toastErrorByMsgId('MSG81517')// size From should be lesser than Weight To
      return true
    }


    // if (this.commonService.nullToString(form.metalselling_rate) == '' || this.commonService.nullToString(form.metalselling_rate) === "0.00"
    //   && this.commonService.nullToString(form.metalSelling) == '' || this.commonService.nullToString(form.metalselling) === '0.00') {
    if (this.metallabourMasterForm.controls.metalselling_rate.value === "0.00" &&
      this.metallabourMasterForm.controls.metalSelling.value === "0.00") {
      this.commonService.toastErrorByMsgId('MSG7728')//"Selling Rate cannot be empty"
      return true
    }
    return false;
  }




  setPostData() {
    let diamondForm = this.diamondlabourMasterForm.value
    let metalForm = this.metallabourMasterForm.value
    return {
      "MID": this.content?.MID || 0,
      "SRNO": this.content?.SRNO,
      "CODE": this.commonService.nullToString(metalForm.metallabour_code),
      "DESCRIPTION": this.commonService.nullToString(metalForm.metallabour_description),
      "LABTYPE": this.commonService.nullToString(metalForm.metallabourType),
      "METHOD": this.commonService.nullToString(diamondForm.method),
      "DIVISION": this.commonService.nullToString(metalForm.metallabourType),
      "SHAPE": this.commonService.nullToString(diamondForm.shape),
      "SIZE_FROM": this.commonService.nullToString(diamondForm.size_from),
      "SIZE_TO": this.commonService.nullToString(diamondForm.size_to),
      "CURRENCYCODE": this.commonService.nullToString(metalForm.metalcurrency),
      "UNITCODE": this.commonService.nullToString(metalForm.metalunitList),
      "COST_RATE": this.commonService.emptyToZero(metalForm.metalcost_rate),
      "SELLING_RATE": this.commonService.emptyToZero(metalForm.metalselling_rate),
      "LAST_COST_RATE": 0,
      "LAST_SELLING_RATE": 0,
      "LAST_UPDATE": this.commonService.formatDateTime(this.commonService.currentDate),
      "CRACCODE": this.commonService.nullToString(metalForm.labourAc),
      "DIVISION_CODE": this.commonService.nullToString(metalForm.metalDivision).toUpperCase(),
      "CURRENCY_CODE": "",
      "SELLING_PER": this.commonService.emptyToZero(metalForm.metalSelling),
      "ACCESSORIES": 0,
      "CARATWT_FROM": this.commonService.emptyToZero(metalForm.wtFrom),
      "CARATWT_TO": this.commonService.emptyToZero(metalForm.wtTo),
      "SIEVE": diamondForm.sieve,
      "WASTAGE_PER": this.commonService.emptyToZero(metalForm.wastage),
      "WASTAGE_AMT": 0,
      "TYPE_CODE": this.commonService.nullToString(metalForm.typecode),
      "CATEGORY_CODE": this.commonService.nullToString(metalForm.category),
      "SUB_CATEGORY_CODE": this.commonService.nullToString(metalForm.subCategory),
      "BRAND_CODE": this.commonService.nullToString(metalForm.brand),
      "PROCESS_TYPE": this.commonService.nullToString(diamondForm.process),
      "KARAT_CODE": this.commonService.nullToString(metalForm.karat),
      "METALSTONE": 'M',
      "STOCK_CODE": this.commonService.nullToString(metalForm.stock_code),
      "PURITY": this.commonService.emptyToZero(this.metallabourMasterForm.value.purity),
      "COLOR": this.commonService.nullToString(metalForm.color),
      "FOR_DESIGN": metalForm.forDesignOnly || false,
      "SIEVEFROM_DESC": diamondForm.sieve_desc,
      "ON_GROSSWT": metalForm.onGrossWt || false,
      "VAR_PER": this.commonService.emptyToZero(metalForm.variance),
    }
  }
  formSubmit() {

    if (this.content && this.content.FLAG == 'VIEW') return
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updatelabourChargeMaster()
      return
    }

    this.metallabourMasterForm.controls['metallabourType'].enable();
    if (this.submitValidation(this.metallabourMasterForm.value)) return

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
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }

  updatelabourChargeMaster() {
    if (this.submitValidation(this.metallabourMasterForm.value)) return
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
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }
  // checkCodeExists(event: any) {
  //   if (this.content && this.content.FLAG == 'EDIT') {
  //     return; // Exit the function if in edit mode
  //   }

  //   if (event.target.value === '' || this.viewMode) {
  //     return; // Exit the function if the input is empty or in view mode
  //   }

  //   const API = 'LabourChargeMasterDj/GetlabourChargeMasterList/' + event.target.value;
  //   const sub = this.dataService.getDynamicAPI(API)
  //     .subscribe((result) => {
  //       if (result.checkifExists) {
  //         Swal.fire({
  //           title: '',
  //           text: result.message || 'Approval Already Exists!',
  //           icon: 'warning',
  //           confirmButtonColor: '#336699',
  //           confirmButtonText: 'Ok'
  //         }).then(() => {
  //           // Clear the input value
  //           this.metallabourMasterForm.controls.metallabour_code.setValue('');

  //           // setTimeout(() => {
  //           //   this.renderer.selectRootElement('#metallabour_code').focus();
  //           // }, 500);

  //         });
  //       }
  //     }, err => {
  //       this.metallabourMasterForm.reset();
  //     });

  //   this.subscriptions.push(sub);
  // }

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
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert('delete ' + err))
        this.subscriptions.push(Sub)
      }
    });
  }

  onforDesignOnlyChange(event: any) {
    const isChecked = event.checked;

    // If the checkbox is checked, set the Labour Type to "GENERAL"
    if (isChecked) {
      this.metallabourMasterForm.get('metallabourType')?.setValue('GENERAL');
    }
    if (event.checked === true) {
      // this.stockcodeDisable = true;
      this.viewDisable1 = true;
      this.metallabourMasterForm.controls['stock_code'].disable();
      this.metallabourMasterForm.controls['stock_code'].setValue('');
      this.metallabourMasterForm.controls['karat'].disable();
      this.metallabourMasterForm.controls['karat'].setValue('');
      this.metallabourMasterForm.controls['color'].disable();
      this.metallabourMasterForm.controls['color'].setValue('');
      this.metallabourMasterForm.controls['metallabourType'].disable();
      //  this.metallabourMasterForm.controls['metallabourType'].setValue('');
      // this.metallabourMasterForm.controls['metalunitList'].disable();
      // this.metallabourMasterForm.controls['metalunitList'].setValue('');
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
      // this.metallabourMasterForm.controls['metalunitList'].enable();
      this.metallabourMasterForm.controls['typecode'].enable();
      this.metallabourMasterForm.controls['karat'].enable();
      this.metallabourMasterForm.controls['subCategory'].enable();
      this.metallabourMasterForm.controls['category'].enable();

    }
  }



  onforongrossOnlyChange(event: any) {
    if (event.checked === true) {
      this.brandDisable = true;
      // this.metallabourMasterForm.controls['brand'].disable();
      // this.metallabourMasterForm.controls['brand'].setValue('');
    }
    else {
      this.brandDisable = false;
      // this.metallabourMasterForm.controls['brand'].enable();
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
  //   console.log(e);
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


  onweightto(event: any, data: String) {

    let wtf = this.metallabourMasterForm.value.wtFrom;
    let wtt = this.metallabourMasterForm.value.wtTo;
    if (data != 'wtFrom') {
      if (wtf > wtt) {
        Swal.fire({
          title: event.message || 'Weight From should be lesser than Weight To',
          text: '',
          icon: 'error',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        })
        this.metallabourMasterForm.controls.wtTo.setValue('');
      }

    }

  }



  onCtweighttto(event: any, data: string) {
    // Retrieve the values of Ct Wt From and Ct Wt To from the form
    const Ctwtf: number = parseFloat(this.metallabourMasterForm.value.ctWtFrom);
    const Ctwtt: number = parseFloat(this.metallabourMasterForm.value.ctWtTo);

    // Check if the data parameter is not 'Ctwtfrom'
    if (data !== 'Ctwtfrom') {
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
        this.metallabourMasterForm.controls.wtTo.setValue('');
      }
    }
  }

  unitSelected() {
    // console.log(' Hi' + this.unitList);
    this.metallabourMasterForm.get('metalunitList')?.valueChanges.subscribe((selectedLabourType) => {
      const settingTypeControl = this.metallabourMasterForm.get('metalunitList');
      const methodControl = this.metallabourMasterForm.get('onGrossWt');
      if (selectedLabourType === 'Grams') {
        this.grossWt = false;

      } else {
        this.grossWt = true;
        this.metallabourMasterForm.controls.onGrossWt.setValue(false);
      }
      console.log(this.unitList);
    });
  }

  WtcodeEnabled() {

    if (this.metallabourMasterForm.value.wtFrom == '') {
      this.codeEnable1 = true;
    }
    else {
      this.codeEnable1 = true;
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

  metalValue(event: any) {
    console.log(this.commonService.nullToString(event.target.value));

  }

  salesChange(data: any, event?: any) {
    if (data == 'metalSelling') {
      this.viewsellingrateMetal = true;
      this.viewsellingMetal = false;
      this.metallabourMasterForm.controls.metalselling_rate.setValue('0.00');
    } else if (data == 'metalselling_rate') {
      this.viewsellingMetal = true;
      this.viewsellingrateMetal = false;
      this.metallabourMasterForm.controls.metalSelling.setValue('0.00');
    } else {
      this.viewsellingMetal = false;
      this.viewsellingrateMetal = false;
    }

  }

  // salesChange(data: any) {
  //   if (data === 'metalSelling') {
  //     this.diamondlabourMasterForm.controls.metalselling_rate.setValue('0.00');
  //     this.diamondlabourMasterForm.controls.metalselling_rate.updateValueAndValidity();
  //   } else if (data === 'metalselling_rate') {
  //     this.diamondlabourMasterForm.controls.metalSelling.setValue('0.00');
  //     this.diamondlabourMasterForm.controls.metalSelling.updateValueAndValidity();
  //   }
  // }

  salesChangesDia(data: any) {
    // console.log(data);

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

  // lookupKeyPress(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //   }
  // }

  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }

  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case 'metalDivision':
        this.overlaymetalDivisionSearch.showOverlayPanel(event);
        break;
      case 'stock_code':
        this.overlaystockcodeSearch.showOverlayPanel(event);
        break;
      case 'metalcurrency':
        this.overlaymetalcurrencySearch.showOverlayPanel(event);
        break;
      case 'karat':
        this.overlaykaratSearch.showOverlayPanel(event);
        break;
      case 'labourAc':
        this.overlaylabourAcSearch.showOverlayPanel(event);
        break;
      case 'color':
        this.overlaycolorSearch.showOverlayPanel(event);
        break;
      case 'typecode':
        this.overlaytypeSearch.showOverlayPanel(event);
        break;
      case 'category':
        this.overlaycategorySearch.showOverlayPanel(event);
        break;
      case 'subCategory':
        this.overlaysubCategorySearch.showOverlayPanel(event);
        break;
      case 'brand':
        this.overlaybrandSearch.showOverlayPanel(event);
        break;
      default:
    }
  }

  // showOverleyPanel(event: any, formControlName: string) {

  //   if (formControlName == 'metalDivision') {
  //     this.overlaymetalDivisionSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'stock_code') {
  //     this.overlaystockcodeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'metalcurrency') {
  //     this.overlaymetalcurrencySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'karat') {
  //     this.overlaykaratSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'labourAc') {
  //     this.overlaylabourAcSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'color') {
  //     this.overlaycolorSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'typecode') {
  //     this.overlaytypeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'category') {
  //     this.overlaycategorySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'subCategory') {
  //     this.overlaysubCategorySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'brand') {
  //     this.overlaybrandSearch.showOverlayPanel(event)
  //   }
  // }
}
