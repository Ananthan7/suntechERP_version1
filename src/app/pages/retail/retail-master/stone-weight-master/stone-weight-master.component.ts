import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stone-weight-master',
  templateUrl: './stone-weight-master.component.html',
  styleUrls: ['./stone-weight-master.component.scss']
})
export class StoneWeightMasterComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  data: any;
  viewMode: boolean = false;
  @Input() content!: any;
  mid: any;
  branchCode?: any = localStorage.getItem("userbranch");
  flag: any;



  enteredCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Sieve Set',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  enteredCodeSelected(e: any) {
    console.log(e);
    this.stoneweightmaster.controls.sieveset.setValue(e.sieveset);

  }

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,

  ) { }

  stoneweightmaster: FormGroup = this.formBuilder.group({
    mid: [""],
    sieveset: [""],
    division: [""],
    sievefrom: [""],
    sievefromdesc: [""],
    sizefrom: [""],
    pcs: [""],
    pointerwt: [""],
    shape: [""],
    sieveto: [""],
    sievetodesc: [""],
    sizeto: [""],
    variance1: [""],
    variance2: [""],

  });

  sieveSetcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve Set Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sieveSetcodeSelected(value: any) {
    console.log(value);
    this.stoneweightmaster.controls.sieveset.setValue(value.CODE);
  }

  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  divisionCodeSelected(e: any) {
    console.log(e);
    this.stoneweightmaster.controls.division.setValue(e.DIVISION_CODE);
  }

  sieveFromCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'types',
    SEARCH_HEADING: 'SIEVE MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "types = 'SIEVE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sievecodeselected(e: any) {
    console.log(e);
    this.stoneweightmaster.controls.sievefrom.setValue(e.CODE);
    this.stoneweightmaster.controls.sievefromdesc.setValue(e.DESCRIPTION);
  }

  sieveToCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'types',
    SEARCH_HEADING: 'Sieve To',
    SEARCH_VALUE: '',
    WHERECONDITION: "types = 'SIEVE MASTER' AND CODE > ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sievetoselected(e: any) {
    console.log(e);
    this.stoneweightmaster.controls.sieveto.setValue(e.CODE);
    this.stoneweightmaster.controls.sievetodesc.setValue(e.DESCRIPTION);
  }

  ShapecodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ShapecodeSelected(value: any) {
    console.log(value);
    this.stoneweightmaster.controls.shape.setValue(value.CODE);
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
  sizefromselected(e: any) {
    console.log(e);
    this.stoneweightmaster.controls.sizefrom.setValue(e.CODE);

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

  sizetoselected(e: any) {
    console.log(e);
    this.stoneweightmaster.controls.sizeto.setValue(e.CODE);
  }

  ngOnInit(): void {
    console.log(this.content);
    if (this.content?.FLAG == "EDIT" || this.content?.FLAG == "VIEW") {
      this.mid = this.content.MID;
      this.stoneweightmaster.controls.division.setValue(this.content.DIVCODE);
      this.stoneweightmaster.controls.shape.setValue(this.content.SHAPE);
      this.stoneweightmaster.controls.sieveto.setValue(this.content.SIEVE_TO);
      this.stoneweightmaster.controls.sievefrom.setValue(this.content.SIEVE);
      this.stoneweightmaster.controls.sieveset.setValue(this.content.SIEVE_SET);
      this.stoneweightmaster.controls.sizefrom.setValue(this.content.SIZE_FROM);
      this.stoneweightmaster.controls.sizeto.setValue(this.content.SIZE_TO);
      this.stoneweightmaster.controls.pcs.setValue(this.content.PCS);
      this.stoneweightmaster.controls.variance1.setValue(this.content.VARIANCE);
      this.stoneweightmaster.controls.pointerwt.setValue(this.content.POINTER_WT);
      this.stoneweightmaster.controls.variance2.setValue(this.content.VARIANCE_POINTERWT);
      this.stoneweightmaster.controls.sievefromdesc.setValue(this.content.SIEVEFROM_DESC);
      this.stoneweightmaster.controls.sievetodesc.setValue(this.content.SIEVETO_DESC);
      this.stoneweightmaster.controls.sieveto.setValue(this.content.SIEVE_TO);
    }
    else if (this.content?.FLAG == "DELETE") {
      this.mid = this.content.MID;
      this.stoneweightmaster.controls.division.setValue(this.content.DIVCODE);
      this.stoneweightmaster.controls.shape.setValue(this.content.SHAPE);
      this.stoneweightmaster.controls.sieveto.setValue(this.content.SIEVE_TO);
      this.stoneweightmaster.controls.sievefrom.setValue(this.content.SIEVE);
      this.stoneweightmaster.controls.sieveset.setValue(this.content.SIEVE_SET);
      this.stoneweightmaster.controls.sizefrom.setValue(this.content.SIZE_FROM);
      this.stoneweightmaster.controls.sizeto.setValue(this.content.SIZE_TO);
      this.stoneweightmaster.controls.pcs.setValue(this.content.PCS);
      this.stoneweightmaster.controls.variance1.setValue(this.content.VARIANCE);
      this.stoneweightmaster.controls.pointerwt.setValue(this.content.POINTER_WT);
      this.stoneweightmaster.controls.variance2.setValue(this.content.VARIANCE_POINTERWT);
      this.stoneweightmaster.controls.sievefromdesc.setValue(this.content.SIEVEFROM_DESC);
      this.stoneweightmaster.controls.sievetodesc.setValue(this.content.SIEVETO_DESC);
      this.stoneweightmaster.controls.sieveto.setValue(this.content.SIEVE_TO);
      this.deleteTableData();
    }
  }

  formSubmit() {

    if (this.content && this.content.FLAG == "EDIT") {
      this.updatestoneweight();
      return;
    }

    if (this.stoneweightmaster.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API = `Manufacturing/Master/DiaSizeWt/InsertDiaSizeWt`;
    let postData = {
      "MID": 0,
      "DIVCODE": this.stoneweightmaster.controls.division.value,
      "SHAPE": this.stoneweightmaster.controls.shape.value,
      "SIEVE": this.stoneweightmaster.controls.sievefrom.value,
      "SIEVE_SET": this.stoneweightmaster.controls.sieveset.value,
      "SIZE_FROM": this.stoneweightmaster.controls.sizefrom.value,
      "SIZE_TO": this.stoneweightmaster.controls.sizeto.value,
      "PCS": this.stoneweightmaster.controls.pcs.value,
      "CARAT": this.stoneweightmaster.controls.pcs.value,
      "VARIANCE": this.stoneweightmaster.controls.variance1.value,
      "POINTER_WT": this.stoneweightmaster.controls.pointerwt.value,
      "VARIANCE_POINTERWT": this.stoneweightmaster.controls.variance2.value,
      "SIEVE_TO": this.stoneweightmaster.controls.sieveto.value,
      "RRR_PRICE_UPDATED": true,
      "NAVSEQNO": 0,
      "SIEVEFROM_DESC": this.stoneweightmaster.controls.sievefromdesc.value,
      "SIEVETO_DESC": this.stoneweightmaster.controls.sievetodesc.value
    };
    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status.trim() == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.stoneweightmaster.reset();
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.toastr.error("Not saved");
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);


  }

  updatestoneweight() {
    let API = `Manufacturing/Master/DiaSizeWt/UpdateDiaSizeWt/${this.mid}`;
    let postData = {
      "MID": 0,
      "DIVCODE": this.stoneweightmaster.controls.division.value,
      "SHAPE": this.stoneweightmaster.controls.shape.value,
      "SIEVE": this.stoneweightmaster.controls.sievefrom.value,
      "SIEVE_SET": this.stoneweightmaster.controls.sieveset.value,
      "SIZE_FROM": this.stoneweightmaster.controls.sizefrom.value,
      "SIZE_TO": this.stoneweightmaster.controls.sizeto.value,
      "PCS": this.stoneweightmaster.controls.pcs.value,
      "CARAT": this.stoneweightmaster.controls.pcs.value,
      "VARIANCE": this.stoneweightmaster.controls.variance1.value,
      "POINTER_WT": this.stoneweightmaster.controls.pointerwt.value,
      "VARIANCE_POINTERWT": this.stoneweightmaster.controls.variance2.value,
      "SIEVE_TO": this.stoneweightmaster.controls.sieveto.value,
      "RRR_PRICE_UPDATED": true,
      "NAVSEQNO": 0,
      "SIEVEFROM_DESC": this.stoneweightmaster.controls.sievefromdesc.value,
      "SIEVETO_DESC": this.stoneweightmaster.controls.sievetodesc.value
    };
    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status.trim() == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.stoneweightmaster.reset();
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.toastr.error("Not saved");
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }


  close(data?: any) {
    this.activeModal.close(data);
  }

  deleteTableData() {
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
        const API = `Manufacturing/Master/DiaSizeWt/DeleteDiaSizeWt/${this.mid}`;
        const Sub: Subscription = this.dataService
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
            error: (err: any) => {
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



  addTableData() {

  }
}
