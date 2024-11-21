import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import themes from 'devextreme/ui/themes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';

@Component({
  selector: 'app-picture-type-master',
  templateUrl: './picture-type-master.component.html',
  styleUrls: ['./picture-type-master.component.scss']
})
export class PictureTypeMasterComponent implements OnInit {

  columnheader:any[] = ['SN','Code','Description'];
  allMode: string;
  checkBoxesMode: string;
  viewMode=false;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

subscriptions: any;
  @Input() content!: any; 
  tableData: any[] = [];
  selectedIndexes: any = [];
  
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
  ) { 
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }


 
  ngOnInit(): void {
   
  }

  setFormValues() {
  
   
  }

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {

    this.Attachedfile = file
    console.log(this.Attachedfile);

  }

  picturetypemasterForm: FormGroup = this.formBuilder.group({
    code:['',[Validators.required]],
    description  : ['',[Validators.required]],
  
   });

   addTableData(){
    let length = this.tableData.length;
    let sn = length + 1;
    let data =  {
      "SN": sn,
      "master": "String",
      "mandatory": "String",
    };
    this.tableData.push(data);
    this.tableData.filter((data, index) => data.SN = index+1);
  }

  mastertemp(data:any,value: any){
    console.log(data);
    this.tableData[value.data.SN - 1].master = data.target.value;
  }

  mandatorytemp(data:any,value: any){
    this.tableData[value.data.SN - 1].mandatory = data.target.value;
  }

  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

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

  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    console.log(values);
    let indexes: Number[] = [];
    this.tableData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SN))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    console.log(this.selectedIndexes);
    
  }

  deleteTableData(){
    console.log(this.selectedIndexes);
  
    if (this.selectedIndexes.length > 0) {
      this.tableData = this.tableData.filter((data, index) => !this.selectedIndexes.includes(index));
    } else {
      this.snackBar.open('Please select record', 'OK', { duration: 2000 }); // need proper err msg.
    }   
  }
  
  formSubmit(){
    if (this.content && this.content.FLAG == 'VIEW') return
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    // if (this.picturetypemasterForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }
  
    let API = ''
    let postData = {
     
    }
    
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.picturetypemasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }
  update(){
    // if (this.picturetypemasterForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }
  
    let API = 'ComponentSizeSetMaster/UpdateComponentSizeSetMaster/'+this.content.COMPSET_CODE
    let postData = 
    {
      
    }
    
  
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.picturetypemasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        }  else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }

  deleteRecord() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content.MID) {
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
        let API = 'ComponentSizeSetMaster/DeleteComponentSizeSetMaster/' + this.content.COMPSET_CODE
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
                    this.picturetypemasterForm.reset()
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
                    this.picturetypemasterForm.reset()
                    this.tableData = []
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


}
