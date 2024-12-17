import { DatePipe } from "@angular/common";
import { Component, Input, OnInit, Renderer2 } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import Swal from "sweetalert2";

// interface RowData {
//   SRNO: number;
//   YEAR: string;
//   FROM_DATE: Date;
//   TO_DATE: Date;
//   TARGET: string;
// }

@Component({
  selector: "app-festival-master",
  templateUrl: "./festival-master.component.html",
  styleUrls: ["./festival-master.component.scss"],
})
export class FestivalMasterComponent implements OnInit {
  @Input() content!: any;
  maindetails: any = [];
  viewMode: boolean = false;
  currentYear: number = new Date().getFullYear();
  minYear: Date = new Date(this.currentYear - 100, 0, 1);
  maxYear: Date = new Date(this.currentYear + 10, 11, 31);
  private subscriptions: Subscription[] = [];
  fm_id: any;
  flag: any;
  curr_year = localStorage.getItem("YEAR");
  // maindetails: RowData[] = [];
  dyndatas: any = [];
  viewOnly: boolean = false;
  gridForm: any;
  data: any = [];
  disable_code: boolean = false;
  editMode: boolean = false;
  minToDate: any;

  festivalmasterform: FormGroup = this.formBuilder.group({
    mid: [""],
    code: ["", [Validators.required]],
    description: ["", [Validators.required]],
    target: [""],
    year: this.formBuilder.array([]),
    fromDate: [""],
    todate: [""],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private datePipe: DatePipe,
    private commonService: CommonServiceService,
    private renderer: Renderer2
  ) {}

  checkcode() {
    const code_data = this.festivalmasterform.controls.code;

    if (!code_data.value || code_data.value.trim() === "") {
      this.commonService.toastErrorByMsgId("MSG1124");
      this.renderer.selectRootElement("#fes_code")?.focus();
    }
  }

  checkdesc() {
    const code_data = this.festivalmasterform.controls.description;
    if (!code_data.value || code_data.value.trim() === "") {
      this.commonService.toastErrorByMsgId("MSG1193");
      this.renderer.selectRootElement("#fes_desc")?.focus();
    }
  }

  ngOnInit(): void {
    console.log(this.content);
    // this.initializeMaindetails();
    // this.fm_id = this.content?.MID;
    this.fm_id = this.content?.CODE;
    console.log(this.fm_id);
    this.flag = this.content?.FLAG;
    if (this.flag == undefined) {
      this.renderer.selectRootElement("#fes_code")?.focus();
    }
    this.initialController(this.flag, this.content);
    if (this.flag == "EDIT") {
      this.disable_code = true;
      this.editMode = true;
    }
    if (this?.flag == "EDIT" || this?.flag == "VIEW" || this.flag == "DELETE") {
      this.editMode = false;
      this.detailsapi(this.fm_id);
    }
    this.gridForm = this.formBuilder.group({
      rows: this.formBuilder.array([]),
    });

    if (this.flag != "VIEW" && this.flag != "EDIT") {
      this.loadYears();
    }
  }

  loadYears() {
    const currentYear = new Date().getFullYear();
    const yearsList = Array.from(
      { length: 10 },
      (_, index) => currentYear - (9 - index)
    );
    const reversedYearsList = yearsList.reverse();
    this.data.year = reversedYearsList;

    this.data.year.forEach((e: any, i: any) => {
      this.maindetails.push({
        SRNO: i + 1,
        YEAR: e,
        FROMDATE: null,
        TODATE: null,
      });
    });
    console.log(this.maindetails);
  }

  year(data: any, event: any) {
    console.log("New Value:", event.target.value);
    console.log(data);

    const updatedSRNO = data.data.SRNO - 1;
    this.maindetails[updatedSRNO].year = event.target.value;

    console.log("Updated DOC_TYPE:", this.maindetails[updatedSRNO].year);
  }

  docTypeDes(data: any, event: any) {
    const updatedSRNO = data.data.SRNO - 1;
    this.maindetails[updatedSRNO].KYC_DOCDESC = event.target.value;

    console.log("Updated DOC_TYPE:", this.maindetails[updatedSRNO].KYC_DOCDESC);
  }

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "VIEW") {
      this.viewOnly = true;
      this.viewMode = true;
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
    this.festivalmasterform.controls.code.setValue(this.content?.CODE);
    this.festivalmasterform.controls.description.setValue(
      this.content?.DESCRIPTION
    );
  }

  editController(DATA: any) {
    this.ViewController(DATA);
  }

  DeleteController(DATA?: any) {
    this.viewOnly = true;
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
        const API = `FestivalMaster/DeleteFestivalMaster/${this.fm_id}`;
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
        this.flag = "VIEW";
        this.activeModal.close();
      }
    });
  }

  // close(data?: any) {
  //   // this.activeModal.close(data);
  //   console.log(this.flag)
  //   if(this.flag == undefined || this.flag == 'EDIT'){
  //     Swal.fire({
  //       title: "Confirm",
  //       text: "Are you sure you want to close this window?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: 'Yes',
  //       cancelButtonText: 'No'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         this.activeModal.close(data);
  //       }
  //     });
  //   }else{
  //     this.activeModal.close(data);
  //   }
  // }

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

  detailsapi(fm_id: any) {
    let API = `FestivalMaster/GetFestivalMasterDetail/${this.fm_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
      (result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);
        let count = 1;
        this.dyndatas.Details.forEach((ele: any) => {
          ele.SRNO = count++;
          ele.TODATE = new Date(ele.TODATE).toISOString().split("T")[0];
          ele.FROMDATE = new Date(ele.FROMDATE).toISOString().split("T")[0];
        });

        this.maindetails = [...this.maindetails, ...this.dyndatas?.Details];
        // this.flag = "EDIT";
      },
      (err: any) => {}
    );
    this.subscriptions.push(Sub);
    console.log(this.dyndatas.FA_CATEGORY);
    console.log(this.maindetails);
  }

  formSubmit() {
    let count = 1;
    this.maindetails = this.maindetails.filter((ele: any) => {
      return ele.FROMDATE && ele.TODATE && ele.YEAR && ele.FEST_TARGET;
    });
    this.maindetails.forEach((ele: any) => {
      ele.UNIQUEID = count++;
      ele.SRNO = count++;
      ele.FEST_TARGET = Number(ele.FEST_TARGET);
      ele.CODE = "";
      ele.YEAR = ele.YEAR.toString();
      if (ele.FROMDATE) {
        ele.FROMDATE = new Date(ele.FROMDATE).toISOString();
      }
      if (ele.TODATE) {
        ele.TODATE = new Date(ele.TODATE).toISOString();
      }
    });
    const postData = {
      MID: 0,
      CODE: this.festivalmasterform.controls.code.value,
      DESCRIPTION: this.festivalmasterform.controls.description.value,
      Details: this.maindetails,
    };

    if (this.flag === "EDIT") {
      let API = `FestivalMaster/UpdateFestivalMaster/${this.fm_id}`;
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
      let API = `FestivalMaster/InsertFestivalMaster`;
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

  // addTableData() {
  //   if (this.festivalmasterform.controls.code.value == "") {
  //     Swal.fire({
  //       title: 'Error',
  //       text: 'Code Cannot be Empty',
  //     });
  //   } else if (this.festivalmasterform.controls.description.value == "") {
  //     Swal.fire({
  //       title: 'Error',
  //       text: 'Description Cannot be Empty',
  //     });
  //   } else {
  //     // const fromDateFormatted = this.datePipe.transform(this.festivalmasterform.controls.fromDate.value, 'yyyy-MM-dd');
  //     // const toDateFormatted = this.datePipe.transform(this.festivalmasterform.controls.todate.value, 'yyyy-MM-dd');
  //     // const newRow = {
  //     //   UNIQUEID: this.maindetails.length + 1,
  //     //   SRNO: this.maindetails.length + 1,
  //     //   CODE: "",
  //     //   YEAR: "",
  //     //   FROMDATE: "",
  //     //   TODATE: "",
  //     //   FEST_TARGET: ""
  //     //   // UNIQUEID: this.maindetails.length + 1,
  //     //   // SRNO: this.maindetails.length + 1,
  //     //   // CODE: this.festivalmasterform.controls.code.value,
  //     //   // YEAR: this.festivalmasterform.controls.year.value,
  //     //   // FROMDATE: this.festivalmasterform.controls.fromDate.value,
  //     //   // TODATE:this.festivalmasterform.controls.todate.value,
  //     //   // FEST_TARGET: this.festivalmasterform.controls.target.value
  //     const newRow = {
  //       UNIQUEID: this.maindetails.length + 1,
  //       SRNO: this.maindetails.length + 1,
  //       CODE: "",
  //       YEAR: "",
  //       FROMDATE: "",
  //       TODATE: "",
  //       FEST_TARGET: ""
  //     }
  //     console.log(newRow);
  //     this.maindetails.push(newRow);
  //     };

  //   }

  addTableData() {
    if (this.festivalmasterform.controls.code.value == "") {
      this.commonService.toastErrorByMsgId("MSG1193");
      this.renderer.selectRootElement("#fes_code")?.focus();
      return;
    } else if (this.festivalmasterform.controls.description.value == "") {
      this.commonService.toastErrorByMsgId("MSG1193");
      this.renderer.selectRootElement("#fes_desc")?.focus();
      return;
    } else {
      let srno = this.maindetails.length;
      srno += 1;

      let data = {
        // "UNIQUEID": srno ,
        // "KYC_DETCODE": "",
        // "KYC_SRNO": srno,
        // "KYC_DOCTYPE": "",
        // "KYC_DOCDESC": ""
        UNIQUEID: srno,
        SRNO: srno,
        CODE: "",
        YEAR: "",
        FROMDATE: "",
        TODATE: "",
        FEST_TARGET: "",
      };
      this.maindetails.push(data);
    }
  }

  deleteTableData() {
    if (this.maindetails.length > 0) {
      this.maindetails.pop();
    }
  }

  checkadd() {}

  onDateChanged(event: any, cellData: any) {
    console.log("New date selected:", event.value);
    cellData.setValue(event.value);
  }

  // datechange(event: any, value: any) {
  //   // console.log(data, value);
  //   // this.maindetails[value.data.SRNO - 1].FROMDATE = data.target.value;
  //   const updatedSRNO = data.data.SRNO - 1;
  //   this.maindetails[updatedSRNO].FROMDATE = event.target.value;

  //   console.log('Updated DOC_TYPE:', this.maindetails[updatedSRNO].KYC_DOCTYPE);
  // }

  datechange(event: any, data: any) {
    console.log(event); // Logs the event
    console.log(data); // Logs the data passed
    const updatedSRNO = data.data.SRNO - 1;
    console.log(updatedSRNO);
    this.maindetails[updatedSRNO].FROMDATE = event.target.value;
    console.log("Updated DOC_TYPE:", this.maindetails[updatedSRNO].FROMDATE);
  }

  changeyear(event: any, data: any) {
    const updatedSRNO = data.data.SRNO - 1;
    this.maindetails[updatedSRNO].YEAR = event.target.value;
  }

  // changefromdate(event: any, data: any) {
  //   const updatedSRNO = data.data.SRNO - 1;
  //   this.maindetails[updatedSRNO].FROMDATE = event.target.value;
  // }

  // changetodate(event: any, data: any) {
  //   // const updatedSRNO = data.data.SRNO - 1;
  //   // if(this.maindetails[updatedSRNO].FROMDATE < event.target.value){
  //   //   this.maindetails[updatedSRNO].TODATE = event.target.value;
  //   // }else{
  //   //   console.log("errr");
  //   // }
  //   const updatedSRNO = data.data.SRNO - 1;

  //   if (updatedSRNO >= 0 && updatedSRNO < this.maindetails.length) {
  //     const fromDate = this.maindetails[updatedSRNO].FROMDATE;
  //     const toDate = event.target.value;

  //     const fromDateObj = new Date(fromDate);
  //     const toDateObj = new Date(toDate);

  //     if (fromDateObj < toDateObj) {
  //       this.maindetails[updatedSRNO].TODATE = toDate;
  //     } else {
  //       console.log(fromDateObj);
  //       console.log(toDateObj);
  //       this.maindetails[updatedSRNO].TODATE = "";
  //       this.commonService.toastErrorByMsgId('MSG1904');
  //       console.log( this.maindetails[updatedSRNO].TODATE )
  //     }
  //     } else {
  //       console.log("Error: Invalid SRNO or index out of bounds.");
  //     }

  // }

  // fromdatecheck(event: any, data: any){
  //   console.log("in");
  //   const updatedSRNO = data.data.SRNO - 1;

  //   if (updatedSRNO >= 0 && updatedSRNO < this.maindetails.length) {
  //     const fromDate = this.maindetails[updatedSRNO].FROMDATE;
  //     const toDate = event.target.value;

  //     const fromDateObj = new Date(fromDate);
  //     const toDateObj = new Date(toDate);

  //     if (fromDateObj < toDateObj) {
  //       this.maindetails[updatedSRNO].TODATE = toDate;
  //     } else {
  //       console.log(fromDateObj);
  //       console.log(toDateObj);
  //       this.maindetails[updatedSRNO].TODATE = "";
  //       this.commonService.toastErrorByMsgId('MSG1904');
  //       console.log( this.maindetails[updatedSRNO].TODATE )
  //     }
  //     } else {
  //       console.log("Error: Invalid SRNO or index out of bounds.");
  //     }
  // }

  targetchange(event: any, data: any) {
    const updatedSRNO = data.data.SRNO - 1;
    if (event.target.value.length < 6) {
      this.maindetails[updatedSRNO].FEST_TARGET =
        this.commonService.decimalQuantityFormat(event.target.value, "AMOUNT");
    } else {
      this.maindetails[updatedSRNO].FEST_TARGET =
        this.commonService.decimalQuantityFormat(0, "AMOUNT");
    }
  }

  changeFromDate(event: MatDatepickerInputEvent<Date>, rowData: any) {
    this.minToDate = event.value;

    const rowIndex = this.maindetails.findIndex(
      (item: { SRNO: any }) => item.SRNO === rowData.SRNO
    );

    if (rowIndex !== -1) {
      this.maindetails[rowIndex] = {
        ...this.maindetails[rowIndex],
        FROMDATE: this.minToDate,
      };
    }

    this.maindetails = [...this.maindetails];
  }

  changeToDate(event: MatDatepickerInputEvent<Date>, rowData: any) {
    console.log(this.minToDate);

    const selectedToDate = event.value;

    if (selectedToDate) {
      rowData.TODATE = selectedToDate;
    }

    console.log("Row updated with To Date:", rowData);
  }
}
