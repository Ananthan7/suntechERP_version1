import { Input, OnInit, Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import themes from 'devextreme/ui/themes';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
@Component({
  selector: "app-holiday-master",
  templateUrl: "./holiday-master.component.html",
  styleUrls: ["./holiday-master.component.scss"],
})
export class HolidayMasterComponent implements OnInit {
  tableData: any[] = [];
  viewMode: boolean = false;
  editMode: boolean = false;
  currentDate = new Date();
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  flag: any;

  @ViewChild('countrycodeSearch') countrycodeSearch!: MasterSearchComponent;
  @ViewChild("codeField") codeField!: ElementRef;




  columns = [
    { dataField: "SRNO", caption: "Sr No " },
    { dataField: "COUNTRY_CODE", caption: "Country Code" },
    { dataField: "DATE", caption: "Date" },
    { dataField: "REMARKS", caption: "Remarks" },
    { dataField: "REMOVE", caption: "Remove" },
  ];


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) { }

  holidaymasterMainForm: FormGroup = this.formBuilder.group({
    code: [''],
    description: [''],
    countrycode: [''],
    countrycodeDesc: [''],
    holidaydate: [''],
    remarks: [''],
    userdefined1: [''],
    userdefined2: [''],
    userdefined3: [''],
    userdefined4: [''],
    userdefined5: [''],
    userdefined6: [''],
    userdefined7: [''],
    userdefined8: [''],
    userdefined9: [''],
    userdefined10: [''],
    userdefined11: [''],
    userdefined12: [''],
    userdefined13: [''],
    userdefined14: [''],
    userdefined15: [''],
  });

  ngOnInit(): void {
   
    this.flag = this.content
    ? this.content.FLAG
    : (this.content = { FLAG: "ADD" }).FLAG;


    if (this.content?.FLAG) {
      if (this.content?.FLAG == 'VIEW') {
        this.viewMode = true;
        this.setFormValues()

      } else if (this.content?.FLAG == 'EDIT') {
        this.viewMode = false;
        this.editMode = true;
        this.setFormValues()

      } else if (this.content?.FLAG == 'DELETE') {
        this.viewMode = true;

        this.deleteMaster()
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.flag === "ADD") {
      this.codeField.nativeElement.focus();
    }
  }

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

  setFormValues() {
    if (!this.content) return
    console.log(this.content)
    let API = 'HolidayMaster/GetHolidayMasterDetail/' + this.content.MID;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        console.log(result.response)

        this.holidaymasterMainForm.controls.code.setValue(this.content.CODE)
        this.holidaymasterMainForm.controls.description.setValue(this.content.DESCRIPTION)
        this.holidaymasterMainForm.controls.remarks.setValue(result.response.Detail[0].REMARKS)
        this.holidaymasterMainForm.controls.countrycode.setValue(result.response.Detail[0].COUNTRYCODE)
        this.holidaymasterMainForm.controls.holidaydate.setValue(result.response.Detail[0].HOLIDAY_DATE)
        this.holidaymasterMainForm.controls.userdefined1.setValue(this.content.UDF1)
        this.holidaymasterMainForm.controls.userdefined2.setValue(this.content.UDF2)
        this.holidaymasterMainForm.controls.userdefined3.setValue(this.content.UDF3)
        this.holidaymasterMainForm.controls.userdefined4.setValue(this.content.UDF4)
        this.holidaymasterMainForm.controls.userdefined5.setValue(this.content.UDF5)
        this.holidaymasterMainForm.controls.userdefined6.setValue(this.content.UDF6)
        this.holidaymasterMainForm.controls.userdefined7.setValue(this.content.UDF7)
        this.holidaymasterMainForm.controls.userdefined8.setValue(this.content.UDF8)
        this.holidaymasterMainForm.controls.userdefined9.setValue(this.content.UDF9)
        this.holidaymasterMainForm.controls.userdefined10.setValue(this.content.UDF10)
        this.holidaymasterMainForm.controls.userdefined11.setValue(this.content.UDF11)
        this.holidaymasterMainForm.controls.userdefined12.setValue(this.content.UDF12)
        this.holidaymasterMainForm.controls.userdefined13.setValue(this.content.UDF13)
        this.holidaymasterMainForm.controls.userdefined14.setValue(this.content.UDF14)
        this.holidaymasterMainForm.controls.userdefined15.setValue(this.content.UDF15)

        if (result.response.Detail && Array.isArray(result.response.Detail)) {
          result.response.Detail.forEach((detail:any, index:any) => {
            this.tableData.push({
              SRNO: this.tableData.length + 1,
              COUNTRYCODE: detail.COUNTRYCODE,
              HOLIDAY_DATE: detail.HOLIDAY_DATE,
              REMARKS: detail.REMARKS,
              Remove: 'Remove', // Placeholder for actions
            });
          });

          // Trigger change detection
          this.tableData = [...this.tableData];
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }


// removeRow(rowIndex: number): void {
//   Swal.fire({
//     title: 'Are you sure?',
//     text: "You won't be able to revert this!",
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Yes, delete!',
//     cancelButtonText: 'No, cancel!'
//   }).then((result) => {
//     if (result.isConfirmed) {
//       this.tableData.splice(rowIndex, 1);
//       this.tableData = [...this.tableData]; 
//       Swal.fire('Deleted!', 'The row has been removed.', 'success');
//     }
//   });
// }

removeRow(rowData: any): void {

  if(this.content?.FLAG == 'VIEW')return;
 
  const row = rowData.data;

  console.log('Row data received:', row);
  console.log('Table data:', this.tableData);

  if (!row || !row.SRNO) {
    console.error("Row data is invalid or SRNO is missing.");
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete!',
    cancelButtonText: 'No, cancel!'
  }).then((result) => {
    if (result.isConfirmed) {
      const index = this.tableData.findIndex(item => item.SRNO === row.SRNO);
      if (index !== -1) {
        this.tableData.splice(index, 1); 
        this.tableData = [...this.tableData];
        Swal.fire('Deleted!', 'The row has been removed.', 'success');
      }
    }
  });
}




  setPostData() {
    return {
      "MID": this.content?.MID || 0,
      "CODE": this.commonService.nullToString(this.holidaymasterMainForm.value.code),
      "DESCRIPTION": this.commonService.nullToString(this.holidaymasterMainForm.value.description),
      "UDF1": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined1),
      "UDF2": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined2),
      "UDF3": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined3),
      "UDF4": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined4),
      "UDF5": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined5),
      "UDF6": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined6),
      "UDF7": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined7),
      "UDF8": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined8),
      "UDF9": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined9),
      "UDF10": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined10),
      "UDF11": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined11),
      "UDF12": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined12),
      "UDF13": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined13),
      "UDF14": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined14),
      "UDF15": this.commonService.nullToString(this.holidaymasterMainForm.value.userdefined15),
      "Detail": this.tableData
    }
  }

  saveRow() {
    if(this.content?.FLAG == 'VIEW')return;
    const { countrycode, holidaydate, remarks } = this.holidaymasterMainForm.value;

    if (!countrycode || !holidaydate || !remarks) {
      alert('All fields are required!');
      return;
    }

    const newRow = {
      SRNO: this.tableData.length + 1, 
      YEAR:"",
      COUNTRYCODE: countrycode,
      HOLIDAY_DATE: holidaydate,
      REMARKS: remarks,
      Remove: 'Remove' 
    };

    this.tableData.push(newRow); 
    this.tableData = [...this.tableData]; 

     this.holidaymasterMainForm.patchValue({
      countrycode: '',
      holidaydate: '',
      remarks: ''
    });
  }



  onRowSelection(selectedRow: any): void {
    console.log('Selected Row:', selectedRow);
    this.populateForm(selectedRow);
  }

  populateForm(rowData: any): void {
    this.holidaymasterMainForm.patchValue({
      countrycode: rowData.COUNTRYCODE,
      holidaydate: rowData.HOLIDAY_DATE,
      remarks: rowData.REMARKS
    });
  }
  formSave() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.holidaymasterMainForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'HolidayMaster/InsertHolidayMaster'
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
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
              this.holidaymasterMainForm.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  update() {
    if (this.holidaymasterMainForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'HolidayMaster/UpdateHolidayMaster/' + this.content.MID;
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
              this.holidaymasterMainForm.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  deleteMaster() { 
   Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton:  true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'HolidayMaster/DeleteHolidayMaster/' + this.content.MID
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
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
                  this.holidaymasterMainForm.reset()
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
                  this.holidaymasterMainForm.reset()
                  this.tableData = []
                  this.close()
                }
              });
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
      else{
        this.close('reloadMainGrid')
      }
    });
  }



  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
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
          this.holidaymasterMainForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          this.openOverlay(FORMNAME, event);
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
  }


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
      case 'countrycode':
        this.countrycodeSearch.showOverlayPanel(event);
        break;

      default:
    }
  }


  openOverlay(FORMNAME: string, event: any) {
    switch (FORMNAME) {
      case 'countrycode':
        this.countrycodeSearch.showOverlayPanel(event);
        break;

      default:
        console.warn(`Unknown FORMNAME: ${FORMNAME}`);
        break;
    }
  }

  codeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 103,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Country Code",
    SEARCH_VALUE: "",
    WHERECONDITION:  " FYEARCODE <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  codeSelected(value: any) {
    console.log(value);
    this.holidaymasterMainForm.controls.code.setValue(value.FYEARCODE);
    this.holidaymasterMainForm.controls.description.setValue(value.FYEARCODE);
  }

  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 26,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Country Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES ='country MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  countrySelected(value: any) {
    console.log(value);
    this.holidaymasterMainForm.controls.countrycode.setValue(value.DESCRIPTION);
  }


  UDF1Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF1',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field1'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF1CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined1.setValue(e.CODE);
  }

  UDF2Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF1',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field2'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF2CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined2.setValue(e.CODE);
  }

  UDF3Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF3',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field3'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF3CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined3.setValue(e.CODE);
  }


  UDF4Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF4',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field4'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF4CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined4.setValue(e.CODE);
  }

  UDF5Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF5',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field5'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF5CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined5.setValue(e.CODE);
  }

  UDF6Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF6',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field6'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF6CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined6.setValue(e.CODE);
  }

  UDF7Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF6',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field7'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF7CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined7.setValue(e.CODE);
  }

  UDF8Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF8',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field8'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF8CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined8.setValue(e.CODE);
  }

  UDF9Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF9',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field9'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF9CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined9.setValue(e.CODE);
  }


  UDF10Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF10',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field10'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF10CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined10.setValue(e.CODE);
  }

  UDF11Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF11',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field11'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF11CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined11.setValue(e.CODE);
  }

  UDF12Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF12',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field12'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF12CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined12.setValue(e.CODE);
  }

  UDF13Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF13',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field13'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF13CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined13.setValue(e.CODE);
  }

  UDF14Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF14',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field14'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF14CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined14.setValue(e.CODE);
  }

  UDF15Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF15',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field15'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF15CodeSelected(e: any) {
    console.log(e);
    this.holidaymasterMainForm.controls.userdefined15.setValue(e.CODE);
  }
}
