import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';
import { MetalReturnDetailsComponent } from './metal-return-details/metal-return-details.component';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { CommonServiceService } from 'src/app/services/common-service.service';
import themes from 'devextreme/ui/themes';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { MatDialog } from '@angular/material/dialog';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-metal-return',
  templateUrl: './metal-return.component.html',
  styleUrls: ['./metal-return.component.scss']
})
export class MetalReturnComponent implements OnInit {
  @ViewChild('dataGrid', { static: false }) dataGrid!: DxDataGridComponent;
  @ViewChild('metalReturnDetailScreen') public MetalReturnDetailScreen!: NgbModal;
  @ViewChild('overlayenteredBy') overlayenteredBy!: MasterSearchComponent;
  @ViewChild('overlayprocess') overlayprocess!: MasterSearchComponent;
  @ViewChild('overlayworker') overlayworker!: MasterSearchComponent;
  @ViewChild('overlaylocation') overlaylocation!: MasterSearchComponent;
  selectedRowData: any[] = [];
  selectedRowData1: any;
  @Input() content!: any;
  modalReference!: NgbModalRef;
  dataToDetailScreen: any;
  editMode: boolean = false;
  tableData: any = [];
  tableDataHead: any[] = ['PROCESS', 'WORKER', 'JOB_NUMBER', 'UNQ_JOB_ID', 'DESIGN_CODE', 'STOCK_CODE', 'METAL', 'NETWT', 'PURITY', 'PUREWT'];
  metalReturnDetailsData: any[] = [];
  columnhead: any[] = [
    { title: 'SRNO', field: 'SRNO', format: '', alignment: 'center' },
    { title: 'Stock Code', field: 'STOCK_CODE', format: '', alignment: 'left' },
    { title: 'Description', field: 'STOCK_DESCRIPTION', format: '', alignment: 'left' },
    { title: 'Job Description', field: 'JOB_DESCRIPTION', format: '', alignment: 'left' },
    { title: 'Pcs', field: 'PCS', format: '', alignment: 'left' },
    { title: 'Design', field: 'DESIGN_CODE', format: '', alignment: 'left' },
    { title: 'Division', field: 'DIVCODE', format: '', alignment: 'left' },
    { title: 'Gross Wt', field: 'GROSS_WT', format: '', alignment: 'right' },
    { title: 'Pure Wt', field: 'PURE_WT', format: '', alignment: 'right' },
    { title: 'Job Number', field: 'JOB_NUMBER', format: '', alignment: 'left' },
    { title: 'Uniq job Id', field: 'UNQ_JOB_ID', format: '', alignment: 'left' },
    { title: 'Purity', field: 'PURITY', format: '', alignment: 'right' },
    { title: 'Stone Wt', field: 'STONE_WT', format: '', alignment: 'right' },
    { title: 'Net Wt', field: 'NET_WT', format: '', alignment: 'right' },
    { title: 'Process Code', field: 'PROCESS_CODE', format: '', alignment: 'left' },
    { title: 'Process Desc', field: 'PROCESS_NAME', format: '', alignment: 'left' },
    { title: 'Worker', field: 'WORKER_CODE', format: '', alignment: 'left' },
    { title: 'Worker Desc', field: 'WORKER_NAME', format: '', alignment: 'left' },
   ];
  branchCode?: String;
  currentDate: any = this.commonService.currentDate;
  selectRowIndex: any;
  viewMode: boolean = false;
  isSaved: boolean = false;
  isloading: boolean = false;
  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];
  gridAmountDecimalFormat: any = {
    type: 'fixedPoint',
    precision: this.commonService.allbranchMaster?.BAMTDECIMALS,
    currency: this.commonService.compCurrency
  };
  gridMetalDecimalFormat: any;
  private subscriptions: Subscription[] = [];

  SALESPERSON_CODEData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Entered by',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACTIVE=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  metalReturnForm: FormGroup = this.formBuilder.group({
    VOCTYPE: ['', [Validators.required]],
    VOCNO: [''],
    vocDate: [''],
    vocTime:  [new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()],
    enteredBy: [''],
    process: [''],
    worker: [''],
    location: [''],
    REMARKS: [''],
    FLAG: [null],
    YEARMONTH: [''],
    BRANCH_CODE: [''],
    CURRENCY_CODE: [''],
    CURRENCY_RATE: [''],
    MAIN_VOCTYPE: [''],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) {
    // this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  ngOnInit(): void {
    this.gridMetalDecimalFormat = {
      type: 'fixedPoint',
      precision: this.commonService.allbranchMaster?.BMQTYDECIMALS,
      currency: this.commonService.compCurrency
    };
    this.renderer.selectRootElement('#code')?.focus();
    if (this.content?.FLAG) {
      this.setAllInitialValues()
      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.LOCKVOUCHERNO = true;
        this.editMode = true;
      }
      if (this.content.FLAG == 'EDIT') {
        this.LOCKVOUCHERNO = true;
        this.editMode = true;
      }
      this.isSaved = true;
      if (this.content.FLAG == 'DELETE') {
        this.isSaved = false;
        this.deleteMeltingType()
      }
      this.metalReturnForm.controls.FLAG.setValue(this.content.FLAG)
    
    } else {
      this.generateVocNo()
      this.setNewFormValue()
      this.setvoucherTypeMaster()
      this.setOnLoadDetails()
    }
  }
  minDate: any;
  maxDate: any;
  LOCKVOUCHERNO: boolean = true;
  setvoucherTypeMaster() {
    let frm = this.metalReturnForm.value
    const vocTypeMaster = this.commonService.getVoctypeMasterByVocTypeMain(frm.BRANCH_CODE, frm.VOCTYPE, frm.MAIN_VOCTYPE)
    this.LOCKVOUCHERNO = vocTypeMaster.LOCKVOUCHERNO
    this.minDate = vocTypeMaster.BLOCKBACKDATEDENTRIES ? new Date() : null;
    this.maxDate = vocTypeMaster.BLOCKFUTUREDATE ? new Date() : null;
  }
  setNewFormValue() {
    this.branchCode = this.commonService.branchCode;
    this.metalReturnForm.controls.YEARMONTH.setValue(this.commonService.yearSelected)
    this.metalReturnForm.controls.vocDate.setValue(this.currentDate)
    this.metalReturnForm.controls.VOCTYPE.setValue(this.commonService.getqueryParamVocType())
    this.metalReturnForm.controls.BRANCH_CODE.setValue(this.commonService.branchCode)
    this.metalReturnForm.controls.CURRENCY_CODE.setValue(this.commonService.compCurrency)
    let currRate = this.commonService.getCurrencyRate(this.commonService.compCurrency)
    this.metalReturnForm.controls.CURRENCY_RATE.setValue(currRate)
    this.metalReturnForm.controls.MAIN_VOCTYPE.setValue(
      this.commonService.getqueryParamMainVocType()
    )
    this.setvoucherTypeMaster()
  }
  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.metalReturnForm.controls.vocdate.setValue(new Date(date))
    }
  }
  setAllInitialValues() {
    console.log(this.content)
    if (!this.content) return
    let API = `JobMetalReturnMasterDJ/GetJobMetalReturnMasterDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.metalReturnDetailsData = data.Details
          this.formatMainGrid()
          console.log(this.metalReturnDetailsData,'ddddd')
          // data.Details.forEach((element: any) => {
          //   this.tableData.push({
          //     SRNO: element.SRNO,
          //     Job_id: element.JOB_NUMBER,
          //     Unq_job_id: element.UNQ_JOB_ID,
          //     Process: element.PROCESS_CODE,
          //     Design: element.DESIGN_CODE,
          //     Stock_Code: element.STOCK_CODE,
          //     Worker: element.WORKER_CODE,
          //     Description: element.JOB_DESCRIPTION,
          //     Carat: element.KARAT_CODE,
          //     Rate: element.RATE_TYPE,
          //     Division: element.DIVCODE,
          //     Amount: element.NET_WT,
          //   })
          // });
          this.metalReturnForm.controls.VOCTYPE.setValue(data.VOCTYPE)
          this.metalReturnForm.controls.VOCNO.setValue(data.VOCNO)
          this.metalReturnForm.controls.vocDate.setValue(data.VOCDATE)
          this.metalReturnForm.controls.REMARKS.setValue(data.REMARKS)
          this.metalReturnForm.controls.enteredBy.setValue(data.SMAN)
          this.metalReturnForm.controls.YEARMONTH.setValue(data.YEARMONTH)
          this.metalReturnForm.controls.process.setValue(data.Details[0].PROCESS_CODE)
          this.metalReturnForm.controls.worker.setValue(data.Details[0].WORKER_CODE)
          this.metalReturnForm.controls.location.setValue(data.Details[0].LOCTYPE_CODE)
          this.metalReturnForm.controls.BRANCH_CODE.setValue(data.Details[0].BRANCH_CODE)

        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

  }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
  }
  setOnLoadDetails() {
    let branchParam = this.commonService.allbranchMaster;
    // Set LOCTYPE_CODE only if it's not already set
    if (!this.metalReturnForm.controls.location.value) {
      this.metalReturnForm.controls.location.setValue(branchParam.DMFGMLOC);
    }
  }

  close(data?: any) {
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

  userDataSelected(value: any) {
    this.metalReturnForm.controls.enteredBy.setValue(value.SALESPERSON_CODE);
  }

  ProcessCodeSelected(e: any) {
    this.metalReturnForm.controls.process.setValue(e.Process_Code);
    this.processWorkerValidate()
  }

  WorkerCodeSelected(e: any) {
    this.metalReturnForm.controls.worker.setValue(e.WORKER_CODE);
    this.processWorkerValidate()
  }

  locationCodeSelected(e: any) {
    this.metalReturnForm.controls.location.setValue(e.LOCATION_CODE);
  }
  /**use: open detail screen */
  openAddMetalReturnDetail(dataToChild?: any) {
    if (dataToChild) {
      dataToChild.FLAG = this.content?.FLAG || ''
      dataToChild.HEADERDETAILS = this.metalReturnForm.value;
    } else {
      dataToChild = { HEADERDETAILS: this.metalReturnForm.value }
    }
    this.dataToDetailScreen = dataToChild //input variable to pass data to child
    this.modalReference = this.modalService.open(this.MetalReturnDetailScreen, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    // this.modalReference.componentInstance.content = dataToChild
    // this.modalReference.result.then((dataToParent) => {
    //   if (dataToParent) {
    //     this.setValuesToHeaderGrid(dataToParent);
    //   }
    // });
  }

  // openAddMetalReturnDetail(dataToChild?: any) {
  //   // Extract the Stock Code from the dataToChild object (you may need to adjust this depending on your data structure)
  //   const newStockCode = dataToChild?.STOCK_CODE;

  //   if (newStockCode) {
  //     // Check if the Stock Code already exists in the grid data
  //     const duplicateRow = this.metalReturnDetailsData.find((row: any) => row.STOCK_CODE === newStockCode);

  //     if (duplicateRow) {
  //       // Show a confirmation dialog if a duplicate Stock Code is found
  //       Swal.fire({
  //         title: 'Duplicate Stock Code',
  //         text: 'This Stock Code entry is already available in detail. Do you wish to continue?',
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //         confirmButtonText: 'Yes, continue!',
  //         cancelButtonText: 'No, cancel'
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           // Proceed with opening the modal if the user confirms
  //           this.proceedWithModalOpening(dataToChild);
  //         } else {
  //           // Handle cancellation if needed (optional)
  //           Swal.fire(
  //             'Cancelled',
  //             'The operation was cancelled.',
  //             'info'
  //           );
  //         }
  //       });
  //     } else {
  //       // No duplicate found, proceed with opening the modal
  //       this.proceedWithModalOpening(dataToChild);
  //     }
  //   } else {
  //     // If no Stock Code is present in the dataToChild, proceed with opening the modal
  //     this.proceedWithModalOpening(dataToChild);
  //   }
  // }

  // async addItemWithCheck(existingArray: any[], newItem: any): Promise<boolean> {
  //   const duplicate = existingArray.find((item: any) => item.STOCK_CODE === newItem.STOCK_CODE);

  //   if (duplicate) {
  //     // Show a confirmation dialog for duplicate entries
  //     const result = await Swal.fire({
  //       title: 'Duplicate Stock Code',
  //       text: 'This Stock Code entry is already available in detail. Do you wish to continue?',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes, continue!',
  //       cancelButtonText: 'No, cancel'
  //     });

  //     if (result.isConfirmed) {
  //       // User confirmed to continue
  //       return false;
  //     } else {
  //       // User canceled
  //       this.commonService.toastErrorByMsgId('MSG2052');
  //       return true;
  //     }
  //   }

  //   // No duplicate found
  //   return false;
  // }

  // async addItemWithCheck(existingArray: any[], newItem: any) {
  //   const duplicate = existingArray.find((item: any) => item.STOCK_CODE === newItem.STOCK_CODE);
  //      if (duplicate) {
  //     // Show a confirmation dialog for duplicate entries
  //     const result = await Swal.fire({
  //       title: 'Duplicate Stock Code',
  //       text: 'This Stock Code entry is already available in detail. Do you wish to continue?',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes, continue!',
  //       cancelButtonText: 'No, cancel'
  //     });

  //     if (result.isConfirmed) {
  //       // User confirmed to continue
  //       return false;
  //     } else {
  //       // User canceled
  //       this.commonService.toastErrorByMsgId('MSG2052');
  //       return true;
  //     }
  //   }

  //   // No duplicate found
  //   return false;
  // }

  proceedWithModalOpening(dataToChild: any) {
    if (dataToChild) {
      dataToChild.FLAG = this.content?.FLAG || '';
      dataToChild.HEADERDETAILS = this.metalReturnForm.value;
    } else {
      dataToChild = { HEADERDETAILS: this.metalReturnForm.value };
    }

    this.dataToDetailScreen = dataToChild; // Input variable to pass data to child
    this.modalReference = this.modalService.open(this.MetalReturnDetailScreen, {
      size: 'xl',
      backdrop: true,
      keyboard: false,
      windowClass: 'modal-full-width',
    });

    // Uncomment if you want to handle modal result
    this.modalReference.result.then((dataToParent) => {
      if (dataToParent) {
        this.setValuesToHeaderGrid(dataToParent);
      }
    });
  }

  // async setValuesToHeaderGrid(DATA: any) {
  //   console.log(DATA, 'detailDataToParent');
  //   this.formatMainGrid()
  //   let detailDataToParent = DATA.POSTDATA;

  //   // Check if SRNO is not zero (update existing entry)
  //   if (detailDataToParent.SRNO !== 0) {
  //     // Update existing entry in metalReturnDetailsData
  //     this.metalReturnDetailsData[detailDataToParent.SRNO - 1] = detailDataToParent;
  //   } else {
  //     // Check for duplicates before adding a new entry
  //     // if (await this.addItemWithCheck(this.metalReturnDetailsData, detailDataToParent)) return;

  //     // Add new entry to metalReturnDetailsData
  //     this.metalReturnDetailsData.push(detailDataToParent);
  //     this.recalculateSRNO(); // Recalculate SRNO for new entries
  //   }

  //   // Handle flags for further actions
  //   if (DATA.FLAG === 'SAVE') {
  //     this.closeDetailScreen();
  //   } else if (DATA.FLAG === 'CONTINUE') {
  //     this.commonService.showSnackBarMsg('Details added successfully');
  //   }
  // }
  setValuesToHeaderGrid(DATA: any) {
    console.log(DATA, 'detailDataToParent');
    let detailDataToParent = DATA.POSTDATA
    if (detailDataToParent.SRNO != 0) {
      this.metalReturnDetailsData[detailDataToParent.SRNO - 1] = detailDataToParent
    } else {
      detailDataToParent.SRNO = this.metalReturnDetailsData.length + 1
      this.metalReturnDetailsData.push(detailDataToParent);
    }
    this.formatMainGrid()
    this.columnhead.push(detailDataToParent)
    if (DATA.FLAG == 'SAVE') this.closeDetailScreen();
    if (DATA.FLAG == 'CONTINUE' || DATA.FLAG == 'CHANGEJOB') {
      this.commonService.showSnackBarMsg('Details added successfully')
    };
  }


  // setValuesToHeaderGrid(DATA: any) {
  //   console.log(DATA, 'detailDataToParent');
  //   let detailDataToParent = DATA.POSTDATA
  //   if (detailDataToParent.SRNO != 0) {
  //     this.metalReturnDetailsData[detailDataToParent.SRNO - 1] = detailDataToParent
  //   } else {
  //     this.metalReturnDetailsData.push(detailDataToParent);
  //     this.recalculateSRNO()
  //   }
  //   if(DATA.FLAG == 'SAVE') this.closeDetailScreen();
  //   if(DATA.FLAG == 'CONTINUE'){
  //     this.commonService.showSnackBarMsg('Details added successfully')
  //   };
  // }
  closeDetailScreen() {
    this.modalReference.close()
  }

  // onRowClickHandler(event: any) {
  //   this.selectRowIndex = event.data
  // }
  onRowDoubleClickHandler(event: any) {
    this.selectRowIndex = event.data.SRNO
    let selectedData = event.data
    this.openAddMetalReturnDetail(selectedData)
  }

  // deleteTableData(): void {

  //   this.metalReturnDetailsData = this.metalReturnDetailsData.filter((element: any) => element.SRNO != this.selectRowIndex)
  //   this.recalculateSRNO()
  // }

  //   onSelectRow() {
  //     if (this.selectedRowData) {
  //         // Check if the selected row already exists in the metalReturnDetailsData
  //         const exists = this.metalReturnDetailsData.some(item => item.UNQ_JOB_ID === this.selectedRowData.UNQ_JOB_ID);

  //         if (exists) {
  //             Swal.fire({
  //                 title: 'Duplicate Entry',
  //                 text: 'This Stock Code entry is already available in detail. Do you wish to continue?',
  //                 icon: 'warning',
  //                 showCancelButton: true,
  //                 confirmButtonText: 'Yes, continue!',
  //                 cancelButtonText: 'No, cancel'
  //             }).then((result) => {
  //                 if (result.isConfirmed) {
  //                     this.metalReturnDetailsData.push(this.selectedRowData);
  //                 }
  //             });
  //         } else {
  //             this.metalReturnDetailsData.push(this.selectedRowData);
  //         }
  //     } else {
  //         this.commonService.toastErrorByMsgId('MSG_NO_ROW_SELECTED'); // Show an error if no row is selected
  //     }
  // }

  onRowClickHandlerr(event: any) {
    console.log('Full Event Object:', event);
    console.log('Row Data:', event.data); // Check if event.data contains the correct row data
    this.selectedRowData1 = event.data;
  }

  // onRowClickHandlers(e: any) {
  //   const selectedRowData = e.data;

  //   // Optional: Check for duplicates before adding
  //   const isDuplicate = this.metalReturnDetailsData.some(item => item.STOCK_CODE === selectedRowData.STOCK_CODE);

  //   if (isDuplicate) {
  //       Swal.fire({
  //           title: 'Duplicate Entry',
  //           text: 'This Stock Code entry is already available in detail. Do you wish to continue?',
  //           icon: 'warning',
  //           showCancelButton: true,
  //           confirmButtonText: 'Yes, continue!',
  //           cancelButtonText: 'No, cancel'
  //       }).then((result) => {
  //           if (result.isConfirmed) {
  //               this.addRowToBottomGrid(selectedRowData);
  //           }
  //       });
  //   } else {
  //       this.addRowToBottomGrid(selectedRowData);
  //   }
  // }
  getGrossWtField(): string {
    // Assuming `dataSource` is your data array or object
    if (this.metalReturnDetailsData && this.metalReturnDetailsData.length > 0) {
      const sampleRecord = this.metalReturnDetailsData[0]; // Check the first record

      // Return the correct field based on what's present in the data
      if (sampleRecord.hasOwnProperty('PURE_WT')) {
        return 'PURE_WT';
      } else if (sampleRecord.hasOwnProperty('PUREWT')) {
        return 'PUREWT';
      }
    }

    // Default to one of the fields if both are missing or dataSource is empty
    return 'PURE_WT';
  }


  addRowToBottomGrid(rowData: any) {
    this.metalReturnDetailsData = [...this.metalReturnDetailsData, rowData];
  }

  onRowClickHandlers(e: any) {
    console.log(e);
    this.selectedRowData.push(e.data); // Capture the selected row's data
    console.log('Row Clicked:', this.selectedRowData);
  }

  // onSelectRow() {
  //   console.log('Attempting to Select Row');

  //   // Clear previously selected rows
  //   this.selectedRowData = [];

  //   // Get the selected rows data from the grid
  //   const selectedRows = this.dataGrid.instance.getSelectedRowsData();

  //   if (selectedRows.length > 0) {
  //       // Push all selected rows into selectedRowData array
  //       this.selectedRowData = [...selectedRows];

  //       console.log('Pushing to metalReturnDetailsData:', this.selectedRowData);

  //       this.selectedRowData.forEach((e: any) => {
  //           // Check if the item already exists in metalReturnDetailsData
  //           const exists = this.metalReturnDetailsData.some((item: any) =>
  //               item.VOCNO === e.VOCNO &&
  //               item.JOB_NUMBER === e.JOB_NUMBER &&
  //               item.STOCK_CODE === e.STOCK_CODE
  //           );

  //           if (!exists) {
  //               this.metalReturnDetailsData.push({
  //                   "VOCNO": this.commonService.emptyToZero(e.VOCNO),
  //                   "VOCTYPE": this.commonService.nullToString(e.VOCTYPE),
  //                   "JOB_NUMBER": this.commonService.nullToString(e.JOB_NUMBER),
  //                   "JOB_SO_NUMBER": this.commonService.emptyToZero(e.subJobNo),
  //                   "UNQ_JOB_ID": this.commonService.nullToString(e.UNQ_JOB_ID),
  //                   "JOB_DESCRIPTION": this.commonService.nullToString(e.JOB_DESCRIPTION),
  //                   "BRANCH_CODE": this.commonService.nullToString(e.BRANCH_CODE),
  //                   "DESIGN_CODE": this.commonService.nullToString(e.DESIGN_CODE),
  //                   "DIVCODE": this.commonService.nullToString(e.DIVCODE),
  //                   "STOCK_CODE": this.commonService.nullToString(e.STOCK_CODE),
  //                   "STOCK_DESCRIPTION": this.commonService.nullToString(e.STOCK_DESCRIPTION),
  //                   "SUB_STOCK_CODE": "0",
  //                   "KARAT_CODE": this.commonService.nullToString(e.KARAT_CODE),
  //                   "PCS": this.commonService.emptyToZero(e.PCS),
  //                   "GROSSWT": this.commonService.emptyToZero(e.GROSS_WT),
  //                   "PURITY": this.commonService.emptyToZero(e.PURITY),
  //                   "PUREWT": this.commonService.emptyToZero(e.PUREWT),
  //                   "RATE_TYPE": "",
  //                   "METAL_RATE": 0,
  //                   "CURRENCY_CODE": "",
  //                   "CURRENCY_RATE": 0,
  //                   "METAL_GRM_RATEFC": this.commonService.emptyToZero(e.metalGramRateFc),
  //                   "METAL_GRM_RATELC": this.commonService.emptyToZero(e.metalGramRateLc),
  //                   "METAL_AMOUNTFC": this.commonService.emptyToZero(e.metalAmountFc),
  //                   "METAL_AMOUNTLC": this.commonService.emptyToZero(e.metalAmountLc),
  //                   "MAKING_RATEFC": this.commonService.emptyToZero(e.makingRateFc),
  //                   "MAKING_RATELC": this.commonService.emptyToZero(e.makingRateLc),
  //                   "MAKING_AMOUNTFC": this.commonService.emptyToZero(e.makingAmountFC),
  //                   "MAKING_AMOUNTLC": this.commonService.emptyToZero(e.makingAmountFC),
  //                   "TOTAL_RATEFC": this.commonService.emptyToZero(e.totalRateFc),
  //                   "TOTAL_RATELC": this.commonService.emptyToZero(e.totalRateLc),
  //                   "TOTAL_AMOUNTFC": 0,
  //                   "TOTAL_AMOUNTLC": 0,
  //                   "PROCESS_CODE": this.commonService.nullToString(e.PROCESS),
  //                   "PROCESS_NAME": this.commonService.nullToString(e.PROCESSDESC),
  //                   "WORKER_CODE": this.commonService.nullToString(e.WORKER),
  //                   "WORKER_NAME": this.commonService.nullToString(e.WORKERDESC),
  //                   "UNQ_DESIGN_ID": "",
  //                   "WIP_ACCODE": "",
  //                   "UNIQUEID": 0,
  //                   "LOCTYPE_CODE": this.commonService.nullToString(e.location),
  //                   "RETURN_STOCK": "",
  //                   "SUB_RETURN_STOCK": "",
  //                   "STONE_WT": this.commonService.emptyToZero(e.STONEWT),
  //                   "NET_WT": this.commonService.emptyToZero(e.NETWT),
  //                   "PART_CODE": this.commonService.nullToString(e.PART_CODE),
  //                   "DT_BRANCH_CODE": this.commonService.nullToString(this.commonService.branchCode),
  //                   "DT_VOCTYPE": this.commonService.nullToString(this.metalReturnForm.value.VOCTYPE),
  //                   "DT_VOCNO": this.commonService.emptyToZero(e.VOCNO),
  //                   "DT_YEARMONTH": this.commonService.nullToString(this.commonService.yearSelected),
  //                   "PUDIFF": 0,
  //                   "JOB_PURITY": 0
  //               });
  //           } else {
  //               console.log(`Row with VOCNO: ${e.VOCNO}, JOB_NUMBER: ${e.JOB_NUMBER}, STOCK_CODE: ${e.STOCK_CODE} is already in metalReturnDetailsData.`);
  //           }
  //       });

  //       this.recalculateSRNO();
  //   } else {
  //       console.log('No Row Selected');
  //       this.commonService.toastErrorByMsgId('MSG_NO_ROW_SELECTED');
  //   }

  //   // Clear selection in the grid after pushing the rows
  //   this.dataGrid.instance.clearSelection();
  // }

  onSelectRow() {
    console.log('Attempting to Select/Unselect Rows');

    // Get the currently selected rows from the grid
    const selectedRows = this.dataGrid.instance.getSelectedRowsData();

    // Iterate through the current `metalReturnDetailsData`
    this.metalReturnDetailsData = this.metalReturnDetailsData.filter((existingItem: any) => {
      // Check if the existing item is still in the selected rows
      const isStillSelected = selectedRows.some((selectedItem: any) =>
        selectedItem.VOCNO === existingItem.VOCNO &&
        selectedItem.JOB_NUMBER === existingItem.JOB_NUMBER &&
        selectedItem.STOCK_CODE === existingItem.STOCK_CODE
      );

      // If it's still selected, keep it; if not, remove it
      return isStillSelected;
    });

    // Add any newly selected rows to `metalReturnDetailsData`
    selectedRows.forEach((selectedItem: any) => {
      const exists = this.metalReturnDetailsData.some((existingItem: any) =>
        existingItem.VOCNO === selectedItem.VOCNO &&
        existingItem.JOB_NUMBER === selectedItem.JOB_NUMBER &&
        existingItem.STOCK_CODE === selectedItem.STOCK_CODE
      );

      if (!exists) {
        this.metalReturnDetailsData.push({
          "VOCNO": this.commonService.emptyToZero(selectedItem.VOCNO),
          "VOCTYPE": this.commonService.nullToString(selectedItem.VOCTYPE),
          "JOB_NUMBER": this.commonService.nullToString(selectedItem.JOB_NUMBER),
          "JOB_SO_NUMBER": this.commonService.emptyToZero(selectedItem.subJobNo),
          "UNQ_JOB_ID": this.commonService.nullToString(selectedItem.UNQ_JOB_ID),
          "JOB_DESCRIPTION": this.commonService.nullToString(selectedItem.JOB_DESCRIPTION),
          "BRANCH_CODE": this.commonService.nullToString(selectedItem.BRANCH_CODE),
          "DESIGN_CODE": this.commonService.nullToString(selectedItem.DESIGN_CODE),
          "DIVCODE": this.commonService.nullToString(selectedItem.DIVCODE),
          "STOCK_CODE": this.commonService.nullToString(selectedItem.STOCK_CODE),
          "STOCK_DESCRIPTION": this.commonService.nullToString(selectedItem.STOCK_DESCRIPTION),
          "SUB_STOCK_CODE": "0",
          "KARAT_CODE": this.commonService.nullToString(selectedItem.KARAT_CODE),
          "PCS": this.commonService.emptyToZero(selectedItem.PCS),
          "GROSSWT": this.commonService.emptyToZero(selectedItem.GROSS_WT),
          "PURITY": this.commonService.emptyToZero(selectedItem.PURITY),
          "PUREWT": this.commonService.emptyToZero(selectedItem.PUREWT),
          "RATE_TYPE": "",
          "METAL_RATE": 0,
          "CURRENCY_CODE": "",
          "CURRENCY_RATE": 0,
          "METAL_GRM_RATEFC": this.commonService.emptyToZero(selectedItem.metalGramRateFc),
          "METAL_GRM_RATELC": this.commonService.emptyToZero(selectedItem.metalGramRateLc),
          "METAL_AMOUNTFC": this.commonService.emptyToZero(selectedItem.metalAmountFc),
          "METAL_AMOUNTLC": this.commonService.emptyToZero(selectedItem.metalAmountLc),
          "MAKING_RATEFC": this.commonService.emptyToZero(selectedItem.makingRateFc),
          "MAKING_RATELC": this.commonService.emptyToZero(selectedItem.makingRateLc),
          "MAKING_AMOUNTFC": this.commonService.emptyToZero(selectedItem.makingAmountFC),
          "MAKING_AMOUNTLC": this.commonService.emptyToZero(selectedItem.makingAmountFC),
          "TOTAL_RATEFC": this.commonService.emptyToZero(selectedItem.totalRateFc),
          "TOTAL_RATELC": this.commonService.emptyToZero(selectedItem.totalRateLc),
          "TOTAL_AMOUNTFC": 0,
          "TOTAL_AMOUNTLC": 0,
          "PROCESS_CODE": this.commonService.nullToString(selectedItem.PROCESS),
          "PROCESS_NAME": this.commonService.nullToString(selectedItem.PROCESSDESC),
          "WORKER_CODE": this.commonService.nullToString(selectedItem.WORKER),
          "WORKER_NAME": this.commonService.nullToString(selectedItem.WORKERDESC),
          "UNQ_DESIGN_ID": "",
          "WIP_ACCODE": "",
          "UNIQUEID": 0,
          "LOCTYPE_CODE": this.commonService.nullToString(selectedItem.location),
          "RETURN_STOCK": "",
          "SUB_RETURN_STOCK": "",
          "STONE_WT": this.commonService.emptyToZero(selectedItem.STONEWT),
          "NET_WT": this.commonService.emptyToZero(selectedItem.NETWT),
          "PART_CODE": this.commonService.nullToString(selectedItem.PART_CODE),
          "DT_BRANCH_CODE": this.commonService.nullToString(this.commonService.branchCode),
          "DT_VOCTYPE": this.commonService.nullToString(this.metalReturnForm.value.VOCTYPE),
          "DT_VOCNO": this.commonService.emptyToZero(selectedItem.VOCNO),
          "DT_YEARMONTH": this.commonService.nullToString(this.commonService.yearSelected),
          "PUDIFF": 0,
          "JOB_PURITY": 0,
          "VOCDATE": this.commonService.currentDate,
          "JOB_DATE": this.commonService.currentDate,
        });
      }
    });

    this.recalculateSRNO(); // Recalculate serial numbers after updates
  }




  // onSelectRow() {
  //   if (this.selectedRowData) {
  //       // Directly push the selected row data to the metalReturnDetailsData array
  //       this.metalReturnDetailsData.push(this.selectedRowData);

  //       // Optionally, clear the selection after adding to avoid duplicates if needed
  //       this.selectedRowData = null;
  //   } else {
  //       // Show an error if no row is selected
  //       this.commonService.toastErrorByMsgId('MSG_NO_ROW_SELECTED');
  //   }
  // }



  deleteTableData(): void {
    // Check if there is data in the grid
    if (this.metalReturnDetailsData.length === 0) {
      Swal.fire(
        'No Data!',
        'There is no data to delete.',
        'warning'
      );
      return; // Exit the function if there's no data
    }

    if (this.selectedRowData1 !== null) {
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
          // Debug log to ensure correct SRNO is selected
          console.log('Selected SRNO:', this.selectedRowData1);

          // Perform deletion
          const originalLength = this.metalReturnDetailsData.length;
          this.metalReturnDetailsData = this.metalReturnDetailsData.filter((element: any) => element.SRNO !== this.selectedRowData1.SRNO);

          // Check if data was actually removed
          console.log('Original length:', originalLength, 'New length:', this.metalReturnDetailsData.length);

          if (originalLength !== this.metalReturnDetailsData.length) {
            this.recalculateSRNO(); // Update SRNOs after deletion

            Swal.fire(
              'Deleted!',
              'Your data has been deleted.',
              'success'
            );
          } else {
            console.error('Data was not deleted. Check SRNO value and filter condition.');
          }
        }
      });
    } else {
      Swal.fire(
        'No selection!',
        'Please select a record to delete.',
        'warning'
      );
    }
  }


  // deleteTableData(): void {
  //   if (this.selectRowIndex !== null) {
  //     Swal.fire({
  //       title: 'Are you sure?',
  //       text: "You won't be able to revert this!",
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes, delete!'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         // Debug log to ensure correct SRNO is selected
  //         console.log('Selected SRNO:', this.selectRowIndex);

  //         // Perform deletion
  //         const originalLength = this.metalReturnDetailsData.length;
  //         this.metalReturnDetailsData = this.metalReturnDetailsData.filter((element: any) => element.SRNO !== this.selectRowIndex);

  //         // Check if data was actually removed
  //         console.log('Original length:', originalLength, 'New length:', this.metalReturnDetailsData.length);

  //         if (originalLength !== this.metalReturnDetailsData.length) {
  //           this.recalculateSRNO(); // Update SRNOs after deletion

  //           Swal.fire(
  //             'Deleted!',
  //             'Your data has been deleted.',
  //             'success'
  //           );
  //         } else {
  //           console.error('Data was not deleted. Check SRNO value and filter condition.');
  //         }
  //       }
  //     });
  //   } else {
  //     Swal.fire(
  //       'No selection!',
  //       'Please select a record to delete.',
  //       'warning'
  //     );
  //   }
  // }



  recalculateSRNO(): void {
    this.metalReturnDetailsData.forEach((element: any, index: any) => {
      element.SRNO = index + 1
      element.GROSS_WT = this.commonService.setCommaSerperatedNumber(element.GROSS_WT, 'METAL')
    })
  }
  ValidatingVocNo() {
    if (this.content?.FLAG == 'VIEW') return
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.commonService.getqueryParamMainVocType()}/${this.metalReturnForm.value.VOCNO}`
    API += `/${this.commonService.branchCode}/${this.commonService.getqueryParamVocType()}`
    API += `/${this.commonService.yearSelected}`
    this.isloading = true;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.isloading = false;
        this.commonService.closeSnackBarMsg()
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data && data[0]?.RESULT == 0) {
          this.commonService.toastErrorByMsgId('MSG2284')//Voucher Number Already Exists
          this.generateVocNo()
          return
        }
      }, err => {
        this.isloading = false;
        this.generateVocNo()
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.commonService.getqueryParamVocType()}/${this.commonService.branchCode}/${this.commonService.yearSelected}/${this.commonService.formatYYMMDD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.metalReturnForm.controls.VOCNO.setValue(resp.newvocno);
        }
      });
  }
  formatMainGrid() {
    this.metalReturnDetailsData.forEach((item: any, index: any) => {
      item.SRNO = index + 1
      item.GROSS_WT = this.commonService.setCommaSerperatedNumber(item.GROSS_WT, 'METAL')
      item.NET_WT = this.commonService.setCommaSerperatedNumber(item.NET_WT, 'METAL')
      item.PURITY = this.commonService.setCommaSerperatedNumber(item.PURITY, 'PURITY')
      item.PURE_WT = this.commonService.setCommaSerperatedNumber(item.PURE_WT, 'METAL')
      item.STONE_WT = this.commonService.setCommaSerperatedNumber(item.STONE_WT, 'METAL')
      item.TOTAL_AMOUNTFC = this.commonService.setCommaSerperatedNumber(item.TOTAL_AMOUNTFC, 'AMOUNT')
    })
  }

  setPostData(form: any) {
    console.log(form, 'form');

    return {
      "MID": this.commonService.emptyToZero(this.content?.MID),
      "VOCTYPE": this.commonService.nullToString(form.VOCTYPE),
      "BRANCH_CODE": form.BRANCH_CODE,
      "VOCNO": this.commonService.emptyToZero(form.VOCNO),
      "VOCDATE": this.commonService.formatDateTime(form.vocDate),
      //"JOB_DATE":this.commonService.currentDate,
      "YEARMONTH": form.YEARMONTH,
      "DOCTIME": this.commonService.formatDateTime(form.vocDate),
      "CURRENCY_CODE": this.commonService.nullToString(form.CURRENCY_CODE),
      "CURRENCY_RATE": this.commonService.emptyToZero(form.CURRENCY_RATE),
      "METAL_RATE_TYPE": "",
      "METAL_RATE": 0,
      "TOTAL_AMOUNTFC_METAL": 0,
      "TOTAL_AMOUNTLC_METAL": 0,
      "TOTAL_AMOUNTFC_MAKING": 0,
      "TOTAL_AMOUNTLC_MAKING": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_PURE_WT": 0,
      "SMAN": this.commonService.nullToString(form.enteredBy),
      "REMARKS": this.commonService.nullToString(form.REMARKS),
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "AUTOPOSTING": true,
      "POSTDATE": this.commonService.currentDate,
      "SYSTEM_DATE": this.commonService.formatDateTime(form.vocDate),
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": this.metalReturnDetailsData,
    }
  }
  submitValidations(form: any) {
    if (this.commonService.nullToString(form.VOCTYPE) === '') {
      this.commonService.toastErrorByMsgId('MSG1939'); // VOCTYPE CANNOT BE EMPTY
      return true;
    }

    if (this.metalReturnDetailsData.length <= 0) {
      this.commonService.toastErrorByMsgId('MSG1262'); // Minimum one row should be entered in grid
      return true;
    }

    return false;
  }

  formSubmit() {
    // if (this.metalReturnForm.invalid || this.metalReturnDetailsData.length == 0) {
    //   this.toastr.error('select all required fields')
    //   return
    // }
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateMeltingType()
      return
    }

    if (this.submitValidations(this.metalReturnForm.value)) return;

    let API = 'JobMetalReturnMasterDJ/InsertJobMetalReturnMasterDJ'
    let postData = this.setPostData(this.metalReturnForm.value)
    console.log(postData);
    this.isloading = true;
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result && result.status.trim() == "Success") {
          Swal.fire({
            title: this.commonService.getMsgByID('MSG2443') || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.metalReturnForm.reset()
              this.isSaved = true;
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.isloading = false;
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  updateMeltingType() {

    if (this.submitValidations(this.metalReturnForm.value)) return;


    let form = this.metalReturnForm.value
    let API = `JobMetalReturnMasterDJ/UpdateJobMetalReturnMasterDJ/${form.BRANCH_CODE}/${form.VOCTYPE}/${form.VOCNO}/${form.YEARMONTH}`
    let postData = this.setPostData(this.metalReturnForm.value)
    this.isloading = true;
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result && result.status == "Success") {
          Swal.fire({
            title: this.commonService.getMsgByID('MSG2443') || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.metalReturnForm.reset()
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.isloading = false;
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again

      })
    this.subscriptions.push(Sub)
  }
  /**USE: delete Melting Type From Row */
  deleteMeltingType() {
    if (!this.content.VOCNO) {
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
        let API = 'JobMetalReturnMasterDJ/DeleteJobMetalReturnMasterDJ/' +
          this.content.BRANCH_CODE + '/' + this.content.VOCTYPE + '/' +
          this.content.VOCNO + '/' + this.content.YEARMONTH;
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
                    this.metalReturnForm.reset()
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
                    this.metalReturnForm.reset()
                    this.close()
                  }
                });
              }
            } else {
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
  onRowClickHandler(event: any) {
    console.log('Row Clicked:', event.data);
    this.selectedRowData = event.data;
  }


  processWorkerValidate() {
    let form = this.metalReturnForm.value
    let postData = {
      // "SPID": "201",
      "SPID": "063",
      "parameter": {
        strBranch_Code: this.commonService.nullToString(form.BRANCH_CODE),
        strProcess_Code: this.commonService.nullToString(form.process),
        strWorker_Code: this.commonService.nullToString(form.worker),
        strUserName: this.commonService.nullToString(this.commonService.userName),
      }
    }

    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data) {
            this.tableData = data
            console.log(this.tableData,'processtabledata')
          } else {
            this.commonService.toastErrorByMsgId('MSG1531')
            return
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  /**use: validate all lookups to check data exists in db */
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    const inputValue = event.target.value.toUpperCase();
    if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        // this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.metalReturnForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'enteredBy'|| FORMNAME === 'process' || FORMNAME === 'worker' || FORMNAME === 'location') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

        

        // const matchedItem = data.find((item: any) => item.CODE.toUpperCase() === inputValue);
        // if (matchedItem) {
        //   this.diamondlabourMasterForm.controls[FORMNAME].setValue(matchedItem.CODE);
        if (FORMNAME === 'process' || FORMNAME === 'worker') {
          this.processWorkerValidate()
        }
        
        // } else {
        //   this.handleLookupError(FORMNAME, LOOKUPDATA);
        // }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  showOverleyPanel(event: any, formControlName: string) {
    if (this.metalReturnForm.value[formControlName] != '') return;

    switch (formControlName) {
      case 'enteredBy':
        this.overlayenteredBy.showOverlayPanel(event);
        break;
      case 'process':
        this.overlayprocess.showOverlayPanel(event);
        break;
      case 'worker':
        this.overlayworker.showOverlayPanel(event);
        break;
      case 'location':
        this.overlaylocation.showOverlayPanel(event);
        break;
      default:
    }
  }
  // validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
  //   LOOKUPDATA.SEARCH_VALUE = event.target.value;

  //   if (event.target.value == '' || this.viewMode) return;

  //   let param = {
  //     LOOKUPID: LOOKUPDATA.LOOKUPID,
  //     WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
  //   };

  //   this.commonService.showSnackBarMsg('MSG81447');

  //   let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`;
  //   let Sub: Subscription = this.dataService.getDynamicAPI(API)
  //     .subscribe((result) => {
  //       this.commonService.closeSnackBarMsg();
  //       let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0]);

  //       if (data.length == 0) {
  //         this.commonService.toastErrorByMsgId('MSG1531');
  //         this.metalReturnForm.controls[FORMNAME].setValue('');
  //         LOOKUPDATA.SEARCH_VALUE = '';

  //         // Conditionally call showOverleyPanel based on FORMNAME
  //         if (FORMNAME === 'enteredBy' ||  FORMNAME === 'process' || FORMNAME === 'worker'  || FORMNAME === 'location') {
  //           this.showOverleyPanel(event, FORMNAME);
  //         }

  //         return;
  //       }
  //     }, err => {
  //       this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
  //     });

  //   this.subscriptions.push(Sub);
  // }




}
