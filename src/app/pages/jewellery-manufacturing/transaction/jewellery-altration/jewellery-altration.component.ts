import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JewelleryAltrationDetailsComponent } from './jewellery-altration-details/jewellery-altration-details.component';


@Component({
  selector: 'app-jewellery-altration',
  templateUrl: './jewellery-altration.component.html',
  styleUrls: ['./jewellery-altration.component.scss']
})
export class JewelleryAltrationComponent implements OnInit {
  @ViewChild('jewelleryaltrationDetailScreen') public jewelleryaltrationDetailScreen!: NgbModal;
  modalReference!: NgbModalRef;
  @Input() content!: any;
  tableData: any[] = [];
  tableDataHead: any[] = ['SRNO', 'STOCK_CODE', 'DESCRIPTION', 'PCS', 'METALWT', 'STONEWT ', 'GROSSWT', 'COSTCC', 'COSTCCNEW', 'REMARKS_DETAIL'];
  dataToDetailScreen: any;
  jewelleryaltrationdetail: any[] = [];
  detailData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  selectRowIndex: any;
  tableRowCount: number = 0;
  currentDate = new Date();
  viewMode: boolean = false;
  isSaved: boolean = false;
  isloading: boolean = false;
  selectedKey: number[] = []

  private subscriptions: Subscription[] = [];
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

  costCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  itemCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Item Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  itemCodeSelected(e: any) {
    console.log(e);
    this.jewelleryaltrationFrom.controls.itemcurrency.setValue(e.CURRENCY_CODE);
    this.jewelleryaltrationFrom.controls.itemcurrencycc.setValue(e.CONV_RATE);
  }
  rateTypeMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 22,
    SEARCH_FIELD: 'RATE_TYPE',
    SEARCH_HEADING: 'RATE TYPE MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "RATE_TYPE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  rateTypeSelected(event: any) {
    this.jewelleryaltrationFrom.controls.metalrate.setValue(event.RATE_TYPE)
    let data = this.commonService.RateTypeMasterData.filter((item: any) => item.RATE_TYPE == event.RATE_TYPE)

    data.forEach((element: any) => {
      if (element.RATE_TYPE == event.RATE_TYPE) {
        let WHOLESALE_RATE = this.commonService.decimalQuantityFormat(data[0].WHOLESALE_RATE, 'RATE')
        this.jewelleryaltrationFrom.controls.metalratetype.setValue(WHOLESALE_RATE)
      }
    });
  }

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.setNewFormValues()
    if (this.content && this.content.FLAG == 'EDIT') {
      this.setNewFormValues()
      this.setAllInitialValues()
    }
    if (this.content && this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      this.isSaved = true;
      this.isSaved = true;
      if(this.content.FLAG == 'DELETE'){
        this.deleteRecord()
      }
      this.setNewFormValues()
      this.setAllInitialValues()
    }
  }
  

  costCodeSelected(e: any) {
    console.log(e);
    this.jewelleryaltrationFrom.controls.costcode.setValue(e.COST_CODE);
  }

  userDataSelected(value: any) {
    console.log(value);
    this.jewelleryaltrationFrom.controls.enteredby.setValue(value.UsersName);
  }
  deleteClicked(): void {
    console.log(this.selectedKey, 'data')
    this.selectedKey.forEach((element: any) => {
      this.jewelleryaltrationdetail.splice(element.SRNO - 1, 1)
    })

  }

  checkAndAllowEditing(data: any) {
    if (data == 'SRNO') return false
    return true
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  setAllInitialValues() {
    console.log(this.content)
    if (!this.content) return
    let API = `DiamondJewelAlteration/GetDiamondJewelAlterationWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          console.log(data,'data')
          this.jewelleryaltrationdetail = data.Details

          // this.jewelleryaltrationFrom.controls.MID.setValue(data.MID)
          // this.jewelleryaltrationFrom.controls.vocdate.setValue(new Date(data.VOCDATE))
          this.jewelleryaltrationFrom.controls.enteredby.setValue(data.HTUSERNAME)
          this.jewelleryaltrationFrom.controls.itemcurrency.setValue(data.CURRENCY_CODE)
          this.jewelleryaltrationFrom.controls.itemcurrencycc.setValue(data.CC_RATE)
          this.jewelleryaltrationFrom.controls.metalrate.setValue(data.METAL_RATE)
          this.jewelleryaltrationFrom.controls.metalratetype.setValue(data.MET_RATE_TYPE)
          this.jewelleryaltrationFrom.controls.costcode.setValue(data.REMARKS)
          this.jewelleryaltrationFrom.controls.lossaccount.setValue(data.LOSS_ACCODE)
          this.jewelleryaltrationFrom.controls.costcode.setValue(data.COUNT)

          
          this.reCalculateSRNO() //set to main grid

          // this.jewelleryaltrationdetail.forEach((element: any) => {
          //   this.tableData.push({
          //     jobNumber: element.JOB_NUMBER,
          //     jobNumDes: element.JOB_DESCRIPTION,
          //     processCode: element.PROCESS_CODE,
          //     processCodeDesc: element.PROCESS_NAME,
          //     workerCode: element.WORKER_CODE,
          //     workerCodeDes: element.WORKER_NAME,
          //     pcs: element.PCS,
          //     purity: element.PURITY,
          //     grossWeight: element.GROSS_WT,
          //     netWeight: element.NET_WT,
          //   })
          // });

        } else {
          this.comService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  //


  jewelleryaltrationFrom: FormGroup = this.formBuilder.group({
    voctype: [''],
    vocno: [''],
    vocdate: [''],
    metalrate: [''],
    metalratetype: [''],
    costcode: [''],
    lossaccount: [''],
    enteredby: [''],
    itemcurrency: [''],
    itemcurrencycc: [''],
    narration: [''],
    FLAG: [null],
  });

  setNewFormValues() {
    this.jewelleryaltrationFrom.controls.voctype.setValue(this.comService.getqueryParamVocType())
    this.jewelleryaltrationFrom.controls.vocdate.setValue(this.comService.currentDate)
    // this.jewelleryaltrationFrom.controls.YEARMONTH.setValue(this.comService.yearSelected)
    // this.jewelleryaltrationFrom.controls.BRANCH_CODE.setValue(this.comService.branchCode)
    // this.jewelleryaltrationFrom.controls.metalratetype.setValue(this.comService.decimalQuantityFormat(0, 'METAL'))
    this.jewelleryaltrationFrom.controls.itemcurrency.setValue(this.comService.compCurrency)
    this.jewelleryaltrationFrom.controls.itemcurrencycc.setValue('1.000000')

  }


  onRowDblClickHandler(event: any) {
    this.selectRowIndex = (event.dataIndex)
    let selectedData = event.data
    this.openjewelleryaltrationdetails(selectedData)
  }

//data to pass to child
  openjewelleryaltrationdetails(dataToChild?: any) {
    if (dataToChild) {
      dataToChild.FLAG = this.content?.FLAG || ''
      dataToChild.HEADERDETAILS = this.jewelleryaltrationFrom.value;
    } else {
      dataToChild = { HEADERDETAILS: this.jewelleryaltrationFrom.value }
    }
    console.log(dataToChild,'data')
    this.dataToDetailScreen = dataToChild //input variable to pass data to child
    this.modalReference = this.modalService.open(this.jewelleryaltrationDetailScreen, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    // modalRef.componentInstance.content = dataToChild
    // modalRef.result.then((postData) => {
    //   if (postData) {
    //     this.setValuesToHeaderGrid(postData);
    //   }
    // });
  }
  // openjewelleryaltrationdetails(data?: any) {
  //   console.log(data)
  //   if (data) {
  //     data[0] = this.jewelleryaltrationFrom.value;
  //   } else {
  //     data = [{ HEADERDETAILS: this.jewelleryaltrationFrom.value }]
  //   }
  //   const modalRef: NgbModalRef = this.modalService.open(JewelleryAltrationDetailsComponent, {
  //     size: 'xl',
  //     backdrop: true,//'static'
  //     keyboard: false,
  //     windowClass: 'modal-full-width',
  //   });
  //   modalRef.componentInstance.content = data;
  //   modalRef.result.then((postData) => {
  //     if (postData) {
  //       console.log('Data from modal:', postData);
  //       this.jewelleryaltrationdetail.push(postData);
  //       console.log(this.jewelleryaltrationdetail);
  //       this.setValuesToHeaderGrid(postData);

  //     }

  //   });
  // }
  // onRowClickHandler(event: any) {

  //   this.selectRowIndex = (event.dataIndex)
  //   let selectedData = event.data
  //   let detailRow = this.detailData.filter((item: any) => item.ID == selectedData.SRNO)
  //   this.openjewelleryaltrationdetails(selectedData)


  // }

  // setValuesToHeaderGrid(detailDataToParent: any) {
  //   console.log(detailDataToParent, 'detailDataToParent');

  //   if (detailDataToParent.SRNO) {
  //     console.log(this.jewelleryaltrationdetail);

  //     this.swapObjects(this.jewelleryaltrationdetail, [detailDataToParent], (detailDataToParent.SRNO - 1))
  //   } else {
  //     this.tableRowCount += 1
  //     detailDataToParent.SRNO = this.tableRowCount
  //     // this.tableRowCount += 1
  //     // this.content.SRNO = this.tableRowCount
  //   }
  //   if (detailDataToParent) {
  //     this.detailData.push({ ID: this.tableRowCount, DATA: detailDataToParent })
  //   }
  // }
  // swapObjects(array1: any, array2: any, index: number) {
  //   // Check if the index is valid
  //   if (index >= 0 && index < array1.length) {
  //     array1[index] = array2[0];
  //   } else {
  //     console.error('Invalid index');
  //   }
  // }
  deleteRowClicked(): void {
    if (!this.selectRowIndex) {
      Swal.fire({
        title: '',
        text: 'Please select row to remove from grid!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
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
        this.jewelleryaltrationdetail = this.jewelleryaltrationdetail.filter((item: any, index: any) => item.SRNO != this.selectRowIndex)
        this.reCalculateSRNO()
      }
    }
    )
  }

  setValuesToHeaderGrid(DATA: any) {
    console.log(DATA, 'detailDataToParent');
    let detailDataToParent = DATA.POSTDATA
    if (detailDataToParent.SRNO != 0) {
      this.jewelleryaltrationdetail[detailDataToParent.SRNO - 1] = detailDataToParent
    } else {
      detailDataToParent.SRNO = this.jewelleryaltrationdetail.length + 1
      this.jewelleryaltrationdetail.push(detailDataToParent);
    }
    this.tableData.push(detailDataToParent)
    if (DATA.FLAG == 'SAVE') this.closeDetailScreen();
    if (DATA.FLAG == 'CONTINUE') {
      this.comService.showSnackBarMsg('Details added successfully')
    };
  }

  closeDetailScreen() {
    this.modalReference.close()
  }
  onRowClickHandler(event: any) {
    this.selectRowIndex = event.data.SRNO
  }
  onRowDoubleClickHandler(event: any) {
    console.log(this.selectRowIndex, 'passing')
    this.selectRowIndex = event.data.SRNO
    let selectedData = event.data
    this.openjewelleryaltrationdetails(selectedData)
  }
  reCalculateSRNO(): void {
    this.jewelleryaltrationdetail.forEach((element: any, index: any) => {
      element.SRNO = index + 1
      element.GROSS_WT = this.commonService.setCommaSerperatedNumber(element.GROSS_WT, 'METAL')
    })
  }
  deleteTableData(): void {
    this.jewelleryaltrationdetail = this.jewelleryaltrationdetail.filter((element: any) => element.SRNO != this.selectRowIndex)
    this.reCalculateSRNO()
  }

  removedata() {
    this.tableData.pop();
  }
  setPostData() {
    let form = this.jewelleryaltrationFrom.value
    console.log(form, 'form');
    return {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.comService.nullToString(this.jewelleryaltrationFrom.value.voctype),
      "VOCNO": this.jewelleryaltrationFrom.value.VOCNO,
      "VOCDATE": this.comService.formatDateTime(form.vocdate),
      "YEARMONTH": this.yearMonth,
      "SMAN": this.comService.nullToString(this.jewelleryaltrationFrom.value.SMAN),
      "LOSS_ACCODE": this.jewelleryaltrationFrom.value.lossaccount,
      "CURRENCY_CODE": this.jewelleryaltrationFrom.value.itemcurrency,
      "CC_RATE": this.jewelleryaltrationFrom.value.itemcurrencycc,
      "MET_RATE_TYPE": this.comService.nullToString(this.jewelleryaltrationFrom.value.metalrate),
      "METAL_RATE": this.comService.emptyToZero(this.jewelleryaltrationFrom.value.metalratetype),
      "NAVSEQNO": 0,
      "TOTALPCS": 0,
      "TOTAL_LAB_CHARGECC": 0,
      "TOTAL_LAB_CHARGEFC": 0,
      "TOTAL_COST_OLDCC": 0,
      "TOTAL_COST_OLDFC": 0,
      "TOTAL_COST_NEWCC": 0,
      "TOTAL_COST_NEWFC": 0,
      "REMARKS": this.jewelleryaltrationFrom.value.narration,
      "PRINT_COUNT": 0,
      "POSTDATE": "",
      "AUTOPOSTING": true,
      "HTUSERNAME": this.jewelleryaltrationFrom.value.enteredby,
      "REMARKS_DETAIL": "",
      "GENSEQNO": 0,
      "Details": this.jewelleryaltrationdetail,

      "DetailComponents": [
        {
          "REFMID": 0,
          "MAINCODE": "string",
          "SLNO": 0,
          "METALSTONE": "s",
          "DIVISION": "s",
          "DET_STOCK_CODE": "",
          "RET_STOCK_CODE": "",
          "KARAT_CODE": "",
          "PURITY": 0,
          "PCS": 0,
          "WEIGHT": 0,
          "PUREWT": 0,
          "RATEFC": 0,
          "RATECC": 0,
          "AMOUNTFC": 0,
          "AMOUNTCC": 0,
          "REMOVED": 0,
          "NEWENTRY": 0,
          "LOC_TYPE": "",
          "COLOR": "",
          "SHAPE": "",
          "SIEVE": "",
          "STONE_TYPE": "",
          "CLARITY": "",
          "SIZE": "",
          "SIEVE_SET": ""
        }
      ]
    }
  }
  submitValidations(form: any) {
    if (form.VOCTYPE == '') {
      this.comService.toastErrorByMsgId('VOCTYPE is required')
      return true
    }
    if (form.vocdate == '') {
      this.comService.toastErrorByMsgId('vocdate is required')
      return true
    }
    return false
  }
  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.jewelleryaltrationFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'DiamondJewelAlteration/InsertDiamondJewelAlteration'
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result.response) {
          if (result.status.trim() == "Success") {
            Swal.fire({
              title: this.commonService.getMsgByID('MSG2443') || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.jewelleryaltrationFrom.reset()
                this.isSaved = true;
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => {
        this.isloading = false;
        this.toastr.error('Not saved')
      })
    this.subscriptions.push(Sub)
  }


  update() {
    let form = this.jewelleryaltrationFrom.value
    console.log(this.jewelleryaltrationdetail)
    let API = `DiamondJewelAlteration/UpdateDiamondJewelAlteration/${this.branchCode}/${this.jewelleryaltrationFrom.value.voctype}/${this.jewelleryaltrationFrom.value.vocno}/${this.comService.yearSelected}`
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result.response) {
          if (result.status == "Success") {
            this.isSaved = true;
            Swal.fire({
              title: this.comService.getMsgByID('MSG2443') || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.jewelleryaltrationFrom.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.comService.toastErrorByMsgId('Not saved')
        }
      }, err => {
        this.isloading = false;
        this.comService.toastErrorByMsgId('Not saved')
      })
    this.subscriptions.push(Sub)
  }

  deleteRecord() {
    if (!this.content) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
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
        let form = this.jewelleryaltrationFrom.value
        let API = 'DiamondJewelAlteration/DeleteDiamondJewelAlteration/' + 
        this.content.BRANCH_CODE +'/'+ this.content.VOCTYPE+'/'+ 
        this.content.VOCNO+ '/' + this.content.YEARMONTH
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
                    this.jewelleryaltrationFrom.reset()
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
                    this.jewelleryaltrationFrom.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

}
