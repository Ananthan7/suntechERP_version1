import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { WholesaleSalesmanTargetDetailsComponent } from './wholesale-salesman-target-details/wholesale-salesman-target-details.component';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wholesale-salesman-target',
  templateUrl: './wholesale-salesman-target.component.html',
  styleUrls: ['./wholesale-salesman-target.component.scss']
})
export class WholesaleSalesmanTargetComponent implements OnInit {
  @Input() content!: any;
  maindetails :any =[];
  viewMode:boolean = false;
  modalReference!: NgbModalRef;
  wst_id:any;
  flag:any;
  details:any;
  viewOnly:boolean = false;
  private subscriptions: Subscription[] = [];
  dyndatas:any;
  username = localStorage.getItem('username');
  postdata:any;


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private apiService: SuntechAPIService,

  ) { }

  wholesalesmanform: FormGroup = this.formBuilder.group({
    salesman: [""],
    fin_year: [""],
    datefrom: [""],
    code: [""],
    dateto: [""],
   
  });

  enteredCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Username',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  enteredCodeSelected(e: any) {
    console.log(e);
    this.wholesalesmanform.controls.sieveset.setValue(e.sieveset);
  }

  salesmanCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman type',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  selectedsalesman(e:any){
    console.log(e);
    this.wholesalesmanform.controls.salesman.setValue(e.SALESPERSON_CODE);
  }

  ngOnInit(): void {
    console.log(this.content);
    this.wst_id = this.content?.MID;
    console.log(this.wst_id);
    this.flag = this.content?.FLAG;
    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == 'VIEW') {
      this.detailsapi(this.wst_id);
    }
  }

  detailsapi(wst_id: any) {
    this.viewOnly = true;
    let API = `WhlSmanTargetHeader/GetWhlSmanTargetHeaderDetail/${this.wst_id}`;
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
    this.wholesalesmanform.controls.code.setValue(this.content?.TARGET_CODE);
    this.wholesalesmanform.controls.fin_year.setValue(this.content?.FYEARCODE);
    this.wholesalesmanform.controls.salesman.setValue(this.content?.SALESPERSON_CODE);
    this.wholesalesmanform.controls.datefrom.setValue(this.content?.FROM_DATE);
    this.wholesalesmanform.controls.dateto.setValue(this.content?.TO_DATE);
  }


  editController(DATA: any) {
    this.ViewController(DATA);
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSubmit() {

    const postData = {

      "TARGET_CODE": this.wholesalesmanform.controls.code.value,
      "FYEARCODE": this.wholesalesmanform.controls.fin_year.value,
      "CREATED_BY": this.username,//"string",
      "CREATED_ON": new Date(),//"2024-11-15T07:07:04.433Z",
      "SALESPERSON_CODE": this.wholesalesmanform.controls.salesman.value,
      "FROM_DATE": this.wholesalesmanform.controls.datefrom.value,
      "TO_DATE": this.wholesalesmanform.controls.dateto.value,
      "MID": 0,
      "details": [
        this.details
      ]

     
    }

    if (this.flag === "EDIT") {
      let API = `WhlSmanTargetHeader/UpdateWhlSmanTargetHeader/${this.wst_id}`;
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
      let API = `WhlSmanTargetHeader/InsertWhlSmanTargetHeader`;
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
        const API = `WhlSmanTargetHeader/DeleteWhlSmanTargetHeader/${this.wst_id}`;
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


  
  addTableData(){
    this.modalReference = this.modalService.open(WholesaleSalesmanTargetDetailsComponent, {
      size: 'xl',
      backdrop: true,
      keyboard: false,
      windowClass: 'modal-full-width',
  });

  this.modalReference.closed.subscribe((result) => {
    if (result) {
      console.log('Data received from modal:', result);
      this.details = result;
      this.maindetails = result;
    }
  });
  }

  deleteTableData(){
    
  }

}
