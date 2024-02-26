import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-jewellery-altration-details',
  templateUrl: './jewellery-altration-details.component.html',
  styleUrls: ['./jewellery-altration-details.component.scss'],
})
export class JewelleryAltrationDetailsComponent implements OnInit {


  divisionMS: any = 'ID';

  columnheads: any[] = ['Sr', 'Div', 'Components', 'Location', 'Kt', 'Purity', 'Pcs', 'Weight ', 'Rate', 'Amount', 'Sieve', 'Shape'];
  columnheads1: any[] = ['Sr', 'Division', 'Component ID', 'Location', 'Transfer To', 'Kt', 'Purity', 'Pcs', 'Weight ', 'Rate', 'Amount'];
  @Input() content!: any;
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  summaryDetailData:any;
  currentDate = new Date();
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  private subscriptions: Subscription[] = [];
  metalDetailData: any[] = [];
  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  priceSchemeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 177,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Scheme',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  price1CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  price2CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  price3CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  price4CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  price5CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.setAllInitialValues()

  }
  setAllInitialValues() {
    console.log(this.content,'looo')
    let dataFromParent = this.content[0]
    if (!dataFromParent) return
    this.jewelleryaltrationdetailsFrom.controls.stockcode.setValue(this.content.STOCK_CODE)
    this.jewelleryaltrationdetailsFrom.controls.description.setValue(this.content.DESCRIPTION)
    this.jewelleryaltrationdetailsFrom.controls.pcs.setValue(this.content.PCS)
    this.jewelleryaltrationdetailsFrom.controls.refvoc.setValue(this.content.MFGVOC_REF)
    this.jewelleryaltrationdetailsFrom.controls.refvoc.setValue(this.content.MFGVOC_REF)
    this.jewelleryaltrationdetailsFrom.controls.metalWT.setValue(this.content.METALWT)
    this.jewelleryaltrationdetailsFrom.controls.costcode.setValue(this.content.COST_CODE)
    this.jewelleryaltrationdetailsFrom.controls.grossWTNEW.setValue(this.content.GROSSWT)
    this.jewelleryaltrationdetailsFrom.controls.dated.setValue(this.content.MFGVOC_DATE)
    this.jewelleryaltrationdetailsFrom.controls.metalcolor.setValue(this.content.COLOR)
    this.jewelleryaltrationdetailsFrom.controls.gross.setValue(this.content.GROSSWT)
    this.jewelleryaltrationdetailsFrom.controls.costFC.setValue(this.content.COSTFC)
    this.jewelleryaltrationdetailsFrom.controls.costCC.setValue(this.content.COSTCC)
    this.jewelleryaltrationdetailsFrom.controls.costFCNEW.setValue(this.content.COSTFCNEW)
    this.jewelleryaltrationdetailsFrom.controls.costCCNEW.setValue(this.content.COSTCCNEW)
    this.jewelleryaltrationdetailsFrom.controls.remarks.setValue(this.content.REMARKS_DETAIL)

  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  //number validation
  isNumeric(event: any) {
    return this.comService.isNumeric(event);
  }
  onFileChanged(event:any) {
    this.url = event.target.files[0].name
    console.log(this.url)
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.urls = reader.result; 
      };
    }
  }
  codeSelected(data: any): void {
    // this.jewelleryaltrationdetailsFrom.controls.stockcode.setValue(e.STOCK_CODE)
    // this.jewelleryaltrationdetailsFrom.controls.description.setValue(e.DESCRIPTION)
    if (data.STOCK_CODE) {
      this.jewelleryaltrationdetailsFrom.controls.stockcode.setValue(data.STOCK_CODE)
      this.jewelleryaltrationdetailsFrom.controls.description.setValue(data.DESCRIPTION)
      this.stockCodeValidate({ target: { value: data.STOCK_CODE } }, 'STOCKCODE')
    } else {
      this.commonService.toastErrorByMsgId('MSG1531');
    }
  }
  
  stockCodeSelected(e: any) {
    console.log(e);
    this.jewelleryaltrationdetailsFrom.controls.stockcode.setValue(e.STOCK_CODE);
  }

  price1CodeSelected(e: any) {
    console.log(e);
    this.jewelleryaltrationdetailsFrom.controls.price1PER.setValue(e.PRICE_CODE);
  }

  price2CodeSelected(e: any) {
    console.log(e);
    this.jewelleryaltrationdetailsFrom.controls.price2PER.setValue(e.PRICE_CODE);
  }

  price3CodeSelected(e: any) {
    console.log(e);
    this.jewelleryaltrationdetailsFrom.controls.price3PER.setValue(e.PRICE_CODE);
  }

  price4CodeSelected(e: any) {
    console.log(e);
    this.jewelleryaltrationdetailsFrom.controls.price4PER.setValue(e.PRICE_CODE);
  }

  price5CodeSelected(e: any) {
    console.log(e);
    this.jewelleryaltrationdetailsFrom.controls.price5PER.setValue(e.PRICE_CODE);
  }

  addTableData() {




    let srno = length + 1;
    let data = {
      "Div": "",
      "Components": "",
      "Location": "",
      "Kt": "",
      "Purity": "",
      "Pcs": "",
      "Weight": "",
      "Rate": "",
      "Amount": "",
      "Sieve": "",
      "Shape": "",
    };
    this.tableData.push(data);

    // Update SRNO and set isDisabled for each item
    this.tableData.forEach((item, i) => {
      item.SRNO = i + 1;
      item.isDisabled = true;
    });

  }

  deleteTableData() {

  }

  jewelleryaltrationdetailsFrom: FormGroup = this.formBuilder.group({
    stockcode: ['',[Validators.required]],
    description: [''],
    pcs: [''],
    refvoc: ['', [Validators.required]],
    costcode: [''],
    dated: [''],
    karat: [''],
    metalcolor: ['', [Validators.required]],
    metalAMTFC: [''],
    metalWT: [''],
    metalAMTCC: [''],
    metalWTNEW: [''],
    diamonds: [''],
    gross: [''],
    grossWTNEW: [''],
    costFC: [''],
    costCC: [''],
    costFCNEW: [''],
    costCCNEW: [''],
    pricescheme: [''],
    price1: [''],
    price1PER: [''],
    price1FC: [''],
    price1LC: [''],
    price2: [''],
    price2FC: [''],
    price2LC: [''],
    price2PER: [''],
    price3: [''],
    price3FC: [''],
    price3LC: [''],
    price3PER: [''],
    price4: [''],
    price4FC: [''],
    price4LC: [''],
    price4PER: [''],
    price5: [''],
    price5FC: [''],
    price5LC: [''],
    price5PER: [''],
    settings: [''],
    settingsAMTFC: [''],
    settingsAMTCC: [''],
    polishing: [''],
    polishingAMTFC: [''],
    polishingAMTCC: [''],
    rhodium: [''],
    rhodiumAMTFC: [''],
    rhodiumAMTCC: [''],
    making: [''],
    makingAMTFC: [''],
    makingAMTCC: [''],
    platecharges: [''],
    platechargesFC: [''],
    platechargesCC: [''],
    certcharges: [''],
    certchargesFC: [''],
    certchargesCC: [''],
    misccharges: [''],
    miscchargesAMTFC: [''],
    miscchargesAMTCC: [''],
    totalAMTFC: [''],
    totalAMTCC: [''],
    remarks: [''],
  });



  removedata() {
    this.tableData.pop();
  }
  formSubmit() {
    let dataTOparent: any = {

      METAL_DETAIL_GRID: [],
      PROCESS_FORMDETAILS: [],
    }
    dataTOparent.PROCESS_FORMDETAILS = this.jewelleryaltrationdetailsFrom.value;
    dataTOparent.METAL_DETAIL_GRID = this.metalDetailData; //grid data
    dataTOparent.POSTDATA = []
    console.log(this.content,'this.content');
    
    let postData = {
      "UNIQUEID": 0,
      "SRNO": this.content.SRNO,
      "STOCK_CODE": this.jewelleryaltrationdetailsFrom.value.stockcode,
      "DESCRIPTION": this.jewelleryaltrationdetailsFrom.value.description,
      "PCS": this.jewelleryaltrationdetailsFrom.value.pcs,
      "COSTFC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.costFC),
      "COSTCC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.costCC),
      "COSTFCNEW": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.costFCNEW),
      "COSTCCNEW": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.costCCNEW),
      "METALWT": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.metalWT),
      "PUREWT": 0,
      "STONEWT": 0,
      "GROSSWT": this.jewelleryaltrationdetailsFrom.value.gross,
      "METAL_AMTFC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.metalAMTFC),
      "METAL_AMTCC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.metalAMTCC),
      "STONE_AMTFC": 0,
      "STONE_AMTCC": 0,
      "METALWT_NEW":this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.metalWTNEW),
      "PUREWT_NEW": 0,
      "STONEWT_NEW": 0,
      "GROSSWT_NEW": this.jewelleryaltrationdetailsFrom.value.grossWTNEW,
      "METAL_AMTFCNEW": 0,
      "METAL_AMTCCNEW": 0,
      "STONE_AMTFCNEW": 0,
      "STONE_AMTCCNEW": 0,
      "SET_ACCODE": this.jewelleryaltrationdetailsFrom.value.settings,
      "SET_AMTFC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.settingsAMTFC),
      "SET_AMTCC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.settingsAMTCC),
      "SET_AMTFCNEW": 0,
      "SET_AMTCCNEW": 0,
      "POL_ACCODE": this.jewelleryaltrationdetailsFrom.value.polishing,
      "POL_AMTFC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.polishingAMTFC),
      "POL_AMTCC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.polishingAMTCC),
      "POL_AMTFCNEW": 0,
      "POL_AMTCCNEW": 0,
      "RHO_ACCODE": this.jewelleryaltrationdetailsFrom.value.rhodium,
      "RHO_AMTFC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.rhodiumAMTFC),
      "RHO_AMTCC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.rhodiumAMTCC),
      "RHO_AMTFCNEW": 0,
      "RHO_AMTCCNEW": 0,
      "MKG_ACCODE": this.jewelleryaltrationdetailsFrom.value.making,
      "MKG_AMTFC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.makingAMTFC),
      "MKG_AMTCC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.makingAMTCC),
      "MKG_AMTFCNEW": 0,
      "MKG_AMTCCNEW": 0,
      "MIS_ACCODE": this.jewelleryaltrationdetailsFrom.value.misccharges || "",
      "MIS_AMTFC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.miscchargesAMTFC),
      "MIS_AMTCC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.miscchargesAMTCC),
      "MIS_AMTFCNEW": 0,
      "MIS_AMTCCNEW": 0,
      "TOTALLAB_AMTFC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.totalAMTFC),
      "TOTALLAB_AMTCC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.totalAMTCC),
      "TOTALLAB_AMTFCNEW": 0,
      "TOTALLAB_AMTCCNEW": 0,
      "MFGVOC_REF": "",
      "MFGVOC_DATE": "2023-10-25T05:39:49.369Z",
      "LOSS_ACCODE": "",
      "COST_CODE": this.jewelleryaltrationdetailsFrom.value.costcode || "",
      "REMARKS_DETAIL": this.jewelleryaltrationdetailsFrom.value.remarks || "",
      "STOCK_FCCOST": 0,
      "STOCK_LCCOST": 0,
      "PRICE1PER": this.jewelleryaltrationdetailsFrom.value.price1PER || "",
      "PRICE2PER": this.jewelleryaltrationdetailsFrom.value.price2PER || "",
      "PRICE3PER": this.jewelleryaltrationdetailsFrom.value.price3PER || "",
      "PRICE4PER": this.jewelleryaltrationdetailsFrom.value.price4PER || "",
      "PRICE5PER": this.jewelleryaltrationdetailsFrom.value.price5PER || "",
      "PRICE1FC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.price1FC),
      "PRICE1LC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.price1LC),
      "PRICE2FC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.price2FC),
      "PRICE2LC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.price2LC),
      "PRICE3FC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.price3FC),
      "PRICE3LC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.price3LC),
      "PRICE4FC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.price4FC),
      "PRICE4LC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.price4LC),
      "PRICE5FC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.price5FC),
      "PRICE5LC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.price5LC),
      "CURRENCY_CODE": "",
      "CC_RATE": 0,
      "DT_BRANCH_CODE": '',
      "DT_VOCTYPE": "",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "",
      "PLAT_ACCODE": this.jewelleryaltrationdetailsFrom.value.platecharges || "",
      "CERT_ACCODE": this.jewelleryaltrationdetailsFrom.value.certcharges || "",
      "PLAT_CHARGESFC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.platechargesFC),
      "PLAT_CHARGESCC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.platechargesCC),
      "CERT_CHARGESFC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.certchargesFC),
      "CERT_CHARGESCC": this.comService.emptyToZero(this.jewelleryaltrationdetailsFrom.value.certchargesCC),
      "PLAT_CHARGESFCNEW": 0,
      "PLAT_CHARGESCCNEW": 0,
      "CERT_CHARGESFCNEW": 0,
      "CERT_CHARGESCCNEW": 0,
      "COLOR": this.jewelleryaltrationdetailsFrom.value.metalcolor || "",
      "TAG_LINES": "",
      "CLARITY": "",
      "LANDEDCOSTNEW": 0,
      "LANDEDCOSTOLD": 0,
      "SIEVE": "",
      "SIZE": "",
      "STONE_TYPE": ""
    }
    dataTOparent.POSTDATA.push(postData)
    this.close(postData);
  }

  setFormValues() {
    if (!this.content) return


    this.jewelleryaltrationdetailsFrom.controls.stockcode.setValue(this.content.STOCK_CODE)
    this.jewelleryaltrationdetailsFrom.controls.description.setValue(this.content.DESCRIPTION)
    this.jewelleryaltrationdetailsFrom.controls.pcs.setValue(this.content.PCS)
    this.jewelleryaltrationdetailsFrom.controls.refvoc.setValue(this.content.REFMID)
    this.jewelleryaltrationdetailsFrom.controls.costcode.setValue(this.content.costcode)
    this.jewelleryaltrationdetailsFrom.controls.karat.setValue(this.content.KARAT_CODE)
    this.jewelleryaltrationdetailsFrom.controls.metalcolor.setValue(this.content.metalcolor)
    this.jewelleryaltrationdetailsFrom.controls.metalAMTFC.setValue(this.content.METAL_AMTFC)
    this.jewelleryaltrationdetailsFrom.controls.metalWT.setValue(this.content.METALWT)
    this.jewelleryaltrationdetailsFrom.controls.metalAMTCC.setValue(this.content.METAL_AMTCC)
    this.jewelleryaltrationdetailsFrom.controls.metalWTNEW.setValue(this.content.metalWTNEW)
    this.jewelleryaltrationdetailsFrom.controls.gross.setValue(this.content.GROSSWT)
    this.jewelleryaltrationdetailsFrom.controls.grossWTNEW.setValue(this.content.GROSSWT_NEW)
    this.jewelleryaltrationdetailsFrom.controls.costFC.setValue(this.content.COSTFC)
    this.jewelleryaltrationdetailsFrom.controls.costCC.setValue(this.content.COSTCC)
    this.jewelleryaltrationdetailsFrom.controls.costFCNEW.setValue(this.content.COSTFCNEW)
    this.jewelleryaltrationdetailsFrom.controls.costCCNEW.setValue(this.content.COSTCCNEW)

    this.jewelleryaltrationdetailsFrom.controls.price1PER.setValue(this.content.PRICE1PER)
    this.jewelleryaltrationdetailsFrom.controls.price2PER.setValue(this.content.PRICE2PER)
    this.jewelleryaltrationdetailsFrom.controls.price3PER.setValue(this.content.PRICE3PER)
    this.jewelleryaltrationdetailsFrom.controls.price4PER.setValue(this.content.PRICE4PER)
    this.jewelleryaltrationdetailsFrom.controls.price5PER.setValue(this.content.PRICE5PER)

    this.jewelleryaltrationdetailsFrom.controls.price1FC.setValue(this.content.PRICE1FC)
    this.jewelleryaltrationdetailsFrom.controls.price2FC.setValue(this.content.PRICE2FC)
    this.jewelleryaltrationdetailsFrom.controls.price3FC.setValue(this.content.PRICE3FC)
    this.jewelleryaltrationdetailsFrom.controls.price4FC.setValue(this.content.PRICE4FC)
    this.jewelleryaltrationdetailsFrom.controls.price5FC.setValue(this.content.PRICE5FC)

    this.jewelleryaltrationdetailsFrom.controls.price1LC.setValue(this.content.PRICE1LC)
    this.jewelleryaltrationdetailsFrom.controls.price2LC.setValue(this.content.PRICE2LC)
    this.jewelleryaltrationdetailsFrom.controls.price3LC.setValue(this.content.PRICE3LC)
    this.jewelleryaltrationdetailsFrom.controls.price4LC.setValue(this.content.PRICE4LC)
    this.jewelleryaltrationdetailsFrom.controls.price5LC.setValue(this.content.PRICE5LC)

    this.jewelleryaltrationdetailsFrom.controls.settings.setValue(this.content.SET_ACCODE)
    this.jewelleryaltrationdetailsFrom.controls.settingsAMTFC.setValue(this.content.SET_AMTFC)
    this.jewelleryaltrationdetailsFrom.controls.settingsAMTCC.setValue(this.content.SET_AMTCC)
    this.jewelleryaltrationdetailsFrom.controls.polishing.setValue(this.content.POL_ACCODE)
    this.jewelleryaltrationdetailsFrom.controls.polishingAMTFC.setValue(this.content.POL_AMTFC)
    this.jewelleryaltrationdetailsFrom.controls.polishingAMTCC.setValue(this.content.POL_AMTCC)
    this.jewelleryaltrationdetailsFrom.controls.rhodium.setValue(this.content.RHO_ACCODE)
    this.jewelleryaltrationdetailsFrom.controls.rhodiumAMTFC.setValue(this.content.RHO_AMTFC)
    this.jewelleryaltrationdetailsFrom.controls.rhodiumAMTCC.setValue(this.content.RHO_AMTCC)
    this.jewelleryaltrationdetailsFrom.controls.making.setValue(this.content.MKG_ACCODE)
    this.jewelleryaltrationdetailsFrom.controls.makingAMTFC.setValue(this.content.MKG_AMTFC)
    this.jewelleryaltrationdetailsFrom.controls.makingAMTCC.setValue(this.content.MKG_AMTCC)
    this.jewelleryaltrationdetailsFrom.controls.platecharges.setValue(this.content.PLAT_ACCODE)
    this.jewelleryaltrationdetailsFrom.controls.platechargesFC.setValue(this.content.PLAT_CHARGESFC)
    this.jewelleryaltrationdetailsFrom.controls.platechargesCC.setValue(this.content.PLAT_CHARGESCC)
    this.jewelleryaltrationdetailsFrom.controls.certcharges.setValue(this.content.CERT_ACCODE)
    this.jewelleryaltrationdetailsFrom.controls.certchargesFC.setValue(this.content.CERT_CHARGESFC)
    this.jewelleryaltrationdetailsFrom.controls.certchargesCC.setValue(this.content.CERT_CHARGESCC)
    this.jewelleryaltrationdetailsFrom.controls.misccharges.setValue(this.content.MIS_ACCODE)
    this.jewelleryaltrationdetailsFrom.controls.miscchargesAMTFC.setValue(this.content.MIS_AMTFC)
    this.jewelleryaltrationdetailsFrom.controls.miscchargesAMTCC.setValue(this.content.MIS_AMTCC)
    this.jewelleryaltrationdetailsFrom.controls.totalAMTFC.setValue(this.content.TOTALLAB_AMTFC)
    this.jewelleryaltrationdetailsFrom.controls.totalAMTCC.setValue(this.content.TOTALLAB_AMTCC)
    this.jewelleryaltrationdetailsFrom.controls.remarks.setValue(this.content.REMARKS)
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  checkStockCode(): boolean {
    console.log('false')
    if (this.jewelleryaltrationdetailsFrom.value.stockcode == '') {
      this.commonService.toastErrorByMsgId('please enter stockcode')
      return true
    }
    return false
  }
  priceSchemeValidate(e: any) {
    console.log('yap')
    if (this.checkStockCode()) return
    this.jewelleryaltrationdetailsFrom.controls.pricescheme.setValue(e.PRICE_CODE)
    let API = 'PriceSchemeMaster/GetPriceSchemeMasterList/' + this.jewelleryaltrationdetailsFrom.value.pricescheme
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.response) {

          let data = result.response;
          this.jewelleryaltrationdetailsFrom.controls.price1PER.setValue(data.PRICE1)
          this.jewelleryaltrationdetailsFrom.controls.price2PER.setValue(data.PRICE2)
          this.jewelleryaltrationdetailsFrom.controls.price3PER.setValue(data.PRICE3)
          this.jewelleryaltrationdetailsFrom.controls.price4PER.setValue(data.PRICE4)
          this.jewelleryaltrationdetailsFrom.controls.price5PER.setValue(data.PRICE5)
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  stockCodeValidate(event: any, flag?: string): void {
    console.log('tpp')
    // 'GetDesignStnmtlDetailNet'
    if (event.target.value == 'stockcode') return
    //this.snackBar.open('Loading...')
   
    let postData = {
      "SPID": "003",
      "parameter": {
        "FLAG": 'VIEW',
        "DESIGNCODE": this.jewelleryaltrationdetailsFrom.value.stockcode|| '',
        "STRDESIGN_STOCK": 'Y',
        "METAL_COLOR": '',
        "MRG_PERC": '',
        "ACCODE": this.content.PartyCode || ''
        
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.dynamicData || result.status == 'Success') {
         
          let data: any = []
          // 1st result set Summary details data
          if (result.dynamicData[0] && result.dynamicData[0].length > 0) {
            data = result.dynamicData[0]
            data = this.commonService.arrayEmptyObjectToString(data)
            this.summaryDetailData = data[0]
          } else {
            this.commonService.toastErrorByMsgId('MSG1531');
          }
          // 2nd and 3rd result Parts / Components details data
          if ((result.dynamicData[1]?.length > 0) ||
            (result.dynamicData[2]?.length > 0)) {
            // this.gridComponents = result.dynamicData[1]
            // this.gridParts = result.dynamicData[2]
          } 
          //4th result is BOM Details data
          
          
          // this.BOMDetailsArrayHead = Object.keys(this.BOMDetailsArray[0]);

          

          this.jewelleryaltrationdetailsFrom.controls.stockcode.setValue(this.summaryDetailData.STOCK_CODE)
          this.jewelleryaltrationdetailsFrom.controls.description.setValue(this.summaryDetailData.DESCRIPTION)

          this.jewelleryaltrationdetailsFrom.controls.karat.setValue(data.KARAT_CODE)
          this.jewelleryaltrationdetailsFrom.controls.costcode.setValue(this.summaryDetailData.METALWT)
          this.jewelleryaltrationdetailsFrom.controls.metalcolor.setValue(this.summaryDetailData.STOCK_CODE)
          this.jewelleryaltrationdetailsFrom.controls.Remarks.setValue(this.summaryDetailData.KARAT_CODE + ':' + this.summaryDetailData.COLOR + ':' + this.summaryDetailData.DESIGN_DESCRIPTION)

          this.jewelleryaltrationdetailsFrom.controls.metalAMTFC.setValue(this.summaryDetailData.CATEGORY_CODE)
          this.jewelleryaltrationdetailsFrom.controls.metalWT.setValue(this.summaryDetailData.SUBCATEGORY_CODE)
          this.jewelleryaltrationdetailsFrom.controls.metalAMTCC.setValue(this.summaryDetailData.COLOR)
          this.jewelleryaltrationdetailsFrom.controls.metalWTNEW.setValue(this.summaryDetailData.KARAT_CODE)
          this.jewelleryaltrationdetailsFrom.controls.diamonds.setValue(this.commonService.decimalQuantityFormat(this.summaryDetailData.PURITY, 'PURITY'))
          this.jewelleryaltrationdetailsFrom.controls.gross.setValue(this.summaryDetailData.SUPPLIER_CODE)
          this.jewelleryaltrationdetailsFrom.controls.grossWTNEW.setValue(this.summaryDetailData.SEQ_CODE)
          this.jewelleryaltrationdetailsFrom.controls.costFC.setValue(this.summaryDetailData.BRAND_CODE)
          this.jewelleryaltrationdetailsFrom.controls.costCC.setValue(this.summaryDetailData.TYPE_CODE)
          this.jewelleryaltrationdetailsFrom.controls.costFCNEW.setValue(this.summaryDetailData.SIZE)
          this.jewelleryaltrationdetailsFrom.controls.costCCNEW.setValue(this.summaryDetailData.SURFACEPROPERTY)
          this.jewelleryaltrationdetailsFrom.controls.pricescheme.setValue(this.summaryDetailData.WIDTH)
          this.jewelleryaltrationdetailsFrom.controls.price1.setValue(this.summaryDetailData.THICKNESS)
          this.jewelleryaltrationdetailsFrom.controls.price1PER.setValue(this.summaryDetailData.ENGRAVING_TEXT)
          this.jewelleryaltrationdetailsFrom.controls.price1FC .setValue(this.summaryDetailData.ENGRAVING_FONT)

          
        } else {
          this.commonService.toastErrorByMsgId('MSG1531');
        }
      }, err => {
        
        this.commonService.toastErrorByMsgId('MSG1531');
      })
    this.subscriptions.push(Sub)
  }
}
