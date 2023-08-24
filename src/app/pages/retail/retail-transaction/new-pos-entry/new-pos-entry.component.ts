import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { DialogboxComponent } from 'src/app/shared/common/dialogbox/dialogbox.component';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MatDialog } from '@angular/material/dialog';
// import { MatDialog } from '@angular/material/dialog';
interface SALESPERSON_DATA {
  SALESPERSON_CODE: string
  DESCRIPTION: string
  COMMISSION: number
  MID: number
  SALESMAN_IMAGE_PATH: string
  SALESMAN_IMAGE: string
  SYSTEM_DATE: string
  SP_SHORTNAME: string
  SP_BRANCHCODE: string
  EMPMST_CODE: string
  ACTIVE: string
  SPACCODE: string
  COMMISSIONDIA: number
}
@Component({
  selector: 'app-new-pos-entry',
  templateUrl: './new-pos-entry.component.html',
  styleUrls: ['./new-pos-entry.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewPosEntryComponent implements OnInit {
  @ViewChild('more_customer_detail_modal') more_customer_detail_modal: any;
  @ViewChild('mymodal') mymodal: any;
  @ViewChild('adjust_sale_return_modal') adjust_sale_return_modal: any;
  @ViewChild('exchange_modal') exchange_modal: any;
  @ViewChild('sales_payment_modal') sales_payment_modal: any;
  selectedModal: NgbModalRef | undefined;

  currentDate = new Date(new Date());
  //sales person option data
  salesPersonOptions: any[] = [];
  salesPersonFilteredOptions!: Observable<SALESPERSON_DATA[]>;
  salespersonName: any[] = [];
  strUser: any = localStorage.getItem('username');

  viewOnly: boolean = false;
  isSaved: boolean = false;
  //product detail table source
  ordered_items: any = [];
  sales_returns_items: any = []
  exchange_items: any = []
  //receipt table source
  receiptDetailsList: any = [];
  //selling amount details
  order_items_total_tax: any; //TODO: comment use case
  prnt_inv_total_gross_amt: any;
  order_items_total_gross_amount: any;
  invReturnSalesTotalNetTotal: any = 0;
  order_total_exchange: any;
  order_items_total_discount_amount: any;
  order_items_total_net_amount: any;
  receiptTotalNetAmt: any;

  dialogBox: any;
  //customer details
  idTypeFilteredOptions: any
  customerDetails: any = { MOBILE: null }

  karatRateDetails: any = []; //karat Selling price table source
  //formgroups
  vocDataForm: FormGroup;
  customerDataForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private dataService: SuntechAPIService,
    private modalService: NgbModal,
    private commonService: CommonServiceService,
    public dialog: MatDialog,
    // private ChangeDetector: ChangeDetectorRef //to detect changes in dom
    // public dialog: MatDialog,
  ) {
    //voucher data form
    this.vocDataForm = this.formBuilder.group({
      fcn_voc_no: [''],
      sales_person: ['', Validators.required],
      vocdate: [this.currentDate, Validators.required],
    });
    //customer data form
    this.customerDataForm = this.formBuilder.group({
      fcn_customer_mobile: ['', Validators.required],
      fcn_customer_name: ['', Validators.required],
      fcn_customer_id_number: ['', Validators.required],
      fcn_customer_id_type: ['', Validators.required],
    });

    this.getSalesPersonMaster()
    this.getKaratDetails()
  }


  ngOnInit(): void {
  }

  /**USE: to open modal */
  open(content: any) {
    let modalContent: any = undefined;
    if (content == 'more_customer_detail_modal') {
      modalContent = this.more_customer_detail_modal
    } else if (content == 'mymodal') {
      modalContent = this.mymodal
    } else if (content == 'adjust_sale_return_modal') {
      modalContent = this.adjust_sale_return_modal
    } else if (content == 'exchange_modal') {
      modalContent = this.exchange_modal
    } else if (content == 'sales_payment_modal') {
      modalContent = this.sales_payment_modal
    }

    this.selectedModal = this.modalService.open(modalContent, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: false,
    });
  }
  // close selected modal
  closeModal() {
    this.selectedModal?.dismiss()
  }


  /**VOUCHER DETAILS FUNCTIONS SECTION STARTS */
  /**USE: to get salesman list from API */
  getSalesPersonMaster() {
    let API = 'SalesPersonMaster/GetSalespersonMasterList'
    this.dataService.getDynamicAPI(API).subscribe((resp: any) => {
      var data = resp.response;
      this.salesPersonOptions = data;

      const salesPerson: any = this.salesPersonOptions.filter(data => data['SALESPERSON_CODE']
        .toString().toLowerCase() == this.strUser.toString().toLowerCase());

      if (salesPerson.length > 0)
        this.vocDataForm.controls.sales_person.setValue(salesPerson['SALESPERSON_CODE']);

      this.salesPersonFilteredOptions =
        this.vocDataForm.controls.sales_person.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterSalesPerson(value))
        );
    })
  }

  private _filterSalesPerson(value: string): any[] {
    const filterValue = value.toLowerCase() || '';
    return this.salesPersonOptions.filter(
      (option: SALESPERSON_DATA) =>
        option.SALESPERSON_CODE.toLowerCase().includes(filterValue) ||
        option.DESCRIPTION.toLowerCase().includes(filterValue)
    );
  }
  changeSalesPerson(value: any) {
    this.salespersonName = this.salesPersonOptions.filter(
      (data) => data.SALESPERSON_CODE == value
    )[0]?.SP_SHORTNAME;
  }
  /**VOUCHER DETAILS FUNCTIONS SECTION ENDS */


  /**CUSTOMER DETAILS FUNCTIONS SECTION STARTS */
  onCustomerNameFocus(value = null) {
    let _cust_mobile_no = value == null ? this.customerDataForm.value.fcn_customer_mobile : value;

    if (_cust_mobile_no != '' && _cust_mobile_no != null) {
      let custMobile = `${this.customerDataForm.value.fcn_customer_mobile}`;
      // if (value == null) {
      this.customerDetails = {};

      let API = 'PosCustomerMaster/GetCustomerMaster/Mobile=' + custMobile
      this.customerDetails.loader = true;
      this.dataService.getDynamicAPI(API).subscribe((resp) => {
        console.log(resp, 'resp');
        if (resp.status == 'Success') {
          this.customerDetails.loader = false;
          const result = resp.response;
          this.customerDataForm.controls['fcn_customer_name'].setValue(result.NAME);
          this.customerDataForm.controls['fcn_customer_id_type'].setValue(result.IDCATEGORY);
          this.customerDataForm.controls['fcn_customer_id_number'].setValue(result.POSCUSTIDNO);
          this.customerDetails.MOBILE = result.MOBILE
          // this.inv_customer_name = result.NAME;
          // this.inv_cust_mobile_no = _cust_mobile_no;

          // this.customerDetailForm.controls['fcn_cust_detail_phone'].setValue(
          //   result.MOBILE
          // );
          // this.customerDetailForm.controls['fcn_cust_detail_idType'].setValue(
          //   result.IDCATEGORY
          // );
          // this.customerDetailForm.controls['fcn_cust_detail_email'].setValue(
          //   result.EMAIL
          // );
          // this.customerDetailForm.controls['fcn_cust_detail_address'].setValue(
          //   result.ADDRESS
          // );
          // this.customerDetailForm.controls['fcn_cust_detail_country'].setValue(
          //   result.COUNTRY_CODE
          // );
          // this.customerDetailForm.controls['fcn_cust_detail_city'].setValue(
          //   result.CITY
          // );
          // this.customerDetailForm.controls['fcn_cust_detail_idcard'].setValue(
          //   result.NATIONAL_IDENTIFICATION_NO
          // );
          // this.customerDetailForm.controls.fcn_customer_detail_name.setValue(
          //   result.NAME
          // );
          // this.customerDetailForm.controls.fcn_customer_detail_fname.setValue(
          //   result.FIRSTNAME
          // );
          // this.customerDetailForm.controls.fcn_customer_detail_mname.setValue(
          //   result.MIDDLENAME
          // );
          // this.customerDetailForm.controls.fcn_customer_detail_lname.setValue(
          //   result.LASTNAME
          // );
          // this.customerDetailForm.controls.fcn_cust_detail_phone2.setValue(
          //   result.TEL2
          // );
          // this.customerDetailForm.controls.fcn_cust_detail_gender.setValue(
          //   result.GENDER
          // );
          // this.customerDetailForm.controls.fcn_cust_detail_marital_status.setValue(
          //   result.MARITAL_ST
          // );
          // this.customerDetailForm.controls.fcn_cust_detail_marital_status.setValue(
          //   result.MARITAL_ST
          // );
          // this.customerDetailForm.controls.fcn_cust_detail_dob.setValue(
          //   this.dummyDateCheck(result.DATE_OF_BIRTH)
          // );
          // this.customerDetailForm.controls.fcn_cust_detail_occupation.setValue(
          //   result.OCCUPATION
          // );
          // this.customerDetailForm.controls.fcn_cust_detail_company.setValue(
          //   result.COMPANY
          // );
          // this.customerDetailForm.controls.fcn_cust_detail_nationality.setValue(
          //   result.NATIONALITY
          // );
          // this.customerDetails = result;

          // if (this.amlNameValidation)
          //   if (!result.AMLNAMEVALIDATION && result.DIGISCREENED) {
          //     this.amlNameValidationData = false;
          //   } else {
          //     this.amlNameValidationData = true;
          //     this.openDialog('Warning', 'Pending for approval', true);
          //   }
        } else {
          this.openDialog('Warning', 'Need To Create Customer', true);
          this.dialogBox.afterClosed().subscribe((data:string) => {
            if (data == 'OK') {
              this.open('more_customer_detail_modal');
            }
          });


          // this.amlNameValidationData = true;
          this.customerDetails.loader = false;
          this.customerDataForm.reset();
          this.customerDetails = {};
          // this.customerDetailForm.reset();
          // let custMobile = `${this.customerDataForm.value.fcn_customer_mobile}`;
          // this.customerDataForm.reset({
          //   fcn_customer_mobile: custMobile,
          // });

        }
      });
    } else {
      // this.amlNameValidationData = true;
      // this.customerDetailForm.reset();
      // this.customerDataForm.reset();
      this.customerDetails.loader = false;
      this.customerDetails = {};
      // this.inv_customer_name = '';
      this.customerDataForm.controls['fcn_customer_name'].setValue('');
      //alert('Enter valid mobile number');
    }

    // this.inv_customer_name = this.customerDataForm.value.fcn_customer_name;
    // this.inv_cust_mobile_no = this.customerDataForm.value.fcn_customer_mobile;
    // this.inv_sales_man = this.vocDataForm.value.sales_person;
    // this.inv_bill_date = this.convertDate(this.vocDataForm.value.vocdate);
    // this.inv_number = this.vocDataForm.value.fcn_voc_no;
  }

  nameChange(data: any) {

  }
  changeIdtype(data: any) {

  }

  /**CUSTOMER DETAILS FUNCTIONS SECTION ENDS */

  /**PRODUCT ITEM DETAILS TAB SECTION STARTS */
  //line item
  removeLineItemsGrid(event: any) {
  }
  editTable(event: any) {
  }
  //sales return
  removeSalesReturnGrid(event: any) {
  }
  editTableSalesReturn(event: any) {
  }
  //exchange
  removeExchangeItemGrid(event: any) {
  }
  editTableExchangeItem(event: any) {
  }

  customizeWeight(data: any) {
    return 'Wt: ' + data['value'];
  }
  customizeQty(data: any) {
  }
  customizeDate(data: any) {
    // return "First: " + new DatePipe("en-US").transform(data.value, 'MMM dd, yyyy');
  }

  /**PRODUCT ITEM DETAILS TAB SECTION ENDS */

  /**RECEIPT TABLE SECTION STARTS*/
  editReceiptItem(index: any, data: any) {

  }
  removePayments(index: any) {
  }
  /**RECEIPT TABLE SECTION ENDS*/

  /**SELLING PRICE AND AMOUNT DETAILS SECTION STARTS */
  changeKaratRate(value: any, index: any) {
    this.karatRateDetails[index].KARAT_RATE = parseFloat(value);
  }
  backToList() {
    // this.router.navigateByUrl('/pos');
  }
  saveOrder() {
  }

  printInvoice() {
  }
  /**SELLING PRICE AND AMOUNT DETAILS SECTION ENDS */

  // GET KARAT DETAILS 
  getKaratDetails() {
    if (!this.viewOnly) {
      let API = 'BranchKaratRate/' + this.commonService.branchCode
      this.dataService.getDynamicAPI(API)
        .subscribe((resp) => {
          if (resp.status == 'Success') {

            let temp_karatrate = resp.response;
            for (var i = 0; i < temp_karatrate.length; i++) {
              if (temp_karatrate[i]['KARAT_RATE'].toString() != '0') {
                this.karatRateDetails.push(temp_karatrate[i]);
              }
            }
            this.karatRateDetails.sort((a: any, b: any) =>
              a.KARAT_CODE > b.KARAT_CODE ? 1 : -1
            );

            if (this.commonService.posKARATRATECHANGE.toString() == '0') {
              this.commonService.formControlSetReadOnlyByClass('karat_code', true);
            }
            if (this.ordered_items.length >= 0)
              this.commonService.formControlSetReadOnlyByClass('karat_code', true);
          } else {
            this.karatRateDetails = [];
          }

        });
    }
  }

  //add new 
  addNew() {
  }
  /**USE: close modal window */
  close() {
    this.activeModal.close();
  }
  /** dailog box call */
  openDialog(title: string, msg: string, okBtn: any, swapColor = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: '40%',
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }
}
