import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

// interface RowData {
//   SRNO: number;
//   YEAR: string;
//   FROM_DATE: Date;
//   TO_DATE: Date;
//   TARGET: string;
// }


@Component({
  selector: 'app-festival-master',
  templateUrl: './festival-master.component.html',
  styleUrls: ['./festival-master.component.scss']
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
  curr_year = localStorage.getItem('YEAR');
  // maindetails: RowData[] = []; 
  dyndatas: any = [];
  viewOnly: boolean = false;
  gridForm: any;


  festivalmasterform: FormGroup = this.formBuilder.group({
    mid: [""],
    code: [""],
    description: [""],
    target: [""],
    year: [""],
    fromDate: [""],
    todate: [""],

  });

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private datePipe: DatePipe



  ) { }

  // initializeMaindetails() {
  //   const startYear = 2009;

  //   let curr_year = localStorage.getItem('YEAR');
  //   if (!curr_year) {
  //     curr_year = new Date().getFullYear().toString(); 
  //   }

  //   const currentYear = Number(curr_year);

  //   const numRows = currentYear - startYear + 1; 
  //   this.maindetails = [];  

  //   for (let i = 0; i < numRows; i++) {
  //     const year = startYear + i;
  //     const newRow: RowData = {
  //       SRNO: i + 1,             
  //       YEAR: year.toString(),    
  //       FROM_DATE: new Date(),   
  //       TO_DATE: new Date(),      
  //       TARGET: '',               
  //     };
  //     this.maindetails.push(newRow);
  //   }

  //   console.log(this.maindetails);
  // }



  ngOnInit(): void {
    console.log(this.content);
    // this.initializeMaindetails();
    this.fm_id = this.content?.MID;
    console.log(this.fm_id);
    this.flag = this.content?.FLAG;
    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == 'VIEW') {
      this.detailsapi(this.fm_id);
    }
    this.gridForm = this.formBuilder.group({
      rows: this.formBuilder.array([])  // Dynamic rows will go here
    });


  }

  initialController(FLAG: any, DATA: any) {
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
    this.festivalmasterform.controls.code.setValue(this.content?.CODE);
    this.festivalmasterform.controls.description.setValue(this.content?.DESCRIPTION);
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
      }
    });
  }



  close(data?: any) {
    this.activeModal.close(data);
  }

  detailsapi(fm_id: any) {
    this.viewOnly = true;

    let API = `FestivalMaster/GetFestivalMasterDetail/${this.fm_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);

        this.flag = "EDIT";

      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
    console.log(this.dyndatas.FA_CATEGORY);
  }

  formSubmit() {

    const postData = {
      "MID": 0,
      "CODE": this.festivalmasterform.controls.code.value,
      "DESCRIPTION": this.festivalmasterform.controls.description.value,
      "Details": [
        {
        UNIQUEID: this.maindetails.length + 1,
        SRNO: this.maindetails.length + 1,
        CODE: this.festivalmasterform.controls.code.value,
        YEAR: this.festivalmasterform.controls.year.value,
        FROMDATE: this.festivalmasterform.controls.fromDate.value,
        TODATE:this.festivalmasterform.controls.todate.value,
        FEST_TARGET: this.festivalmasterform.controls.target.value
        }
       
      ]
    }

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

  addTableData() {
    if (this.festivalmasterform.controls.code.value == "") {
      Swal.fire({
        title: 'Error',
        text: 'Code Cannot be Empty',
      });
    } else if (this.festivalmasterform.controls.description.value == "") {
      Swal.fire({
        title: 'Error',
        text: 'Description Cannot be Empty',
      });
    } else {
      const fromDateFormatted = this.datePipe.transform(this.festivalmasterform.controls.fromDate.value, 'yyyy-MM-dd');
      const toDateFormatted = this.datePipe.transform(this.festivalmasterform.controls.todate.value, 'yyyy-MM-dd');
      const newRow = {
        UNIQUEID: this.maindetails.length + 1,
        SRNO: this.maindetails.length + 1,
        CODE: "",
        YEAR: "",
        FROMDATE: "",
        TODATE:"",
        FEST_TARGET: ""
        // UNIQUEID: this.maindetails.length + 1,
        // SRNO: this.maindetails.length + 1,
        // CODE: this.festivalmasterform.controls.code.value,
        // YEAR: this.festivalmasterform.controls.year.value,
        // FROMDATE: this.festivalmasterform.controls.fromDate.value,
        // TODATE:this.festivalmasterform.controls.todate.value,
        // FEST_TARGET: this.festivalmasterform.controls.target.value
      };
      console.log(newRow);
      this.maindetails.push(newRow);
    }
  }

  deleteTableData() {
    if (this.maindetails.length > 0) {
      this.maindetails.pop();
    }
  }

  checkadd() {

  }

  onDateChanged(event: any, cellData: any) {
    console.log('New date selected:', event.value);
    cellData.setValue(event.value);
  }

}
