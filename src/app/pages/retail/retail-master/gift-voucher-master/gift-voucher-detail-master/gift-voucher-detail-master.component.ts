import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { Flag } from 'angular-feather/icons';



@Component({
  selector: 'app-gift-voucher-detail-master',
  templateUrl: './gift-voucher-detail-master.component.html',
  styleUrls: ['./gift-voucher-detail-master.component.scss']
})
export class GiftVoucherDetailMasterComponent implements OnInit {
  vocMaxDate = new Date();
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  diamond_drop:any[]=[];
  tableDataProcess: any[] = [];
  @Input() content!: any;
  @Input() viewMode: any;
  @Input() editMode: any;

  tableData: any[] = [];
  columnhead: any[] = ['SRNO', 'PROCESS_CODE', 'POINTS', 'STD_LOSS', 'MAX_LOSS', 'STD_TIME', 'LOSS_ACCODE', 'WIP_ACCODE', 'TIMEON_PROCESS']
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }
  

  ngOnInit(): void {
  
    // if (this.content?.FLAG) {
     
    // //  this.setFormValues();
    //   console.log(this.content)
    //   //this.setFormValues();
    //   if (this.content.FLAG == 'VIEW') {
    //     this.viewMode = true;
    //   } else if (this.content.FLAG == 'EDIT') {
    //     this.viewMode = false;
    //     this.editMode = true;
    //   } else if (this.content?.FLAG == 'DELETE') {
    //     this.viewMode = true;
    //     this.delete()
    //   }
    // }
  }


  giftVoucherMasterdetailForm: FormGroup = this.formBuilder.group({

    quantity:[''],
    amount:['']

  })


  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
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

  
  sequenceSearch() {

    let secCode = this.giftVoucherMasterdetailForm.value.processCode;

    this.commonService.toastSuccessByMsgId('MSG81447');
    let API = 'SequenceMasterDJ/GetSequenceMasterDJDetail/' + secCode;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe(
        (result) => {
          if (result.status === 'Success' && result.response.sequenceDetails) {
            this.tableDataProcess = result.response.sequenceDetails.map((item: any, index: number) => {
              return { ...item, SELECT1: false, SRNO: index + 1 };
            });
            console.log(this.tableDataProcess);
          } else {
            this.commonService.toastErrorByMsgId('MSG1531');
          }
        },
        err => {
          console.error('Error fetching data:', err);
          this.commonService.toastErrorByMsgId('MSG1531');
        }
      );

  }

  setPostData(){
    return{}
  }




  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    // if (this.giftVoucherMasterdetailForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = 'PrefixMaster/InsertPrefixMaster'
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
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
                this.giftVoucherMasterdetailForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
        //  this.showErrorDialog('Code Already Exists')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
 
  update() {
    if (this.giftVoucherMasterdetailForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'PrefixMaster/UpdatePrefixMaster/' + this.giftVoucherMasterdetailForm.value.prefixcode
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
                this.giftVoucherMasterdetailForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  delete() {
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
        let API = 'PrefixMaster/DeletePrefixMaster/' + this.giftVoucherMasterdetailForm.value.prefixcode
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
                    this.giftVoucherMasterdetailForm.reset()
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
                    this.giftVoucherMasterdetailForm.reset()
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
}