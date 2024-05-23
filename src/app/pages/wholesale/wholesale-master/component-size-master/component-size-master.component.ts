import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-component-size-master',
  templateUrl: './component-size-master.component.html',
  styleUrls: ['./component-size-master.component.scss']
})
export class ComponentSizeMasterComponent implements OnInit {
  // subscriptions: any;
  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  tableData: any[] = [];
  radius!: number;
  viewMode: boolean = false;
  editableMode: boolean = false;
  codeEnable: boolean = true;
  componentsizemasterForm: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]],
    desc: ['', [Validators.required]],
    height: ['', [Validators.required]],
    width: ['', [Validators.required]],
    length: [''],
    radius: ['']
  });
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,

  ) { }

  ngOnInit(): void {
    this.renderer.selectRootElement('#code')?.focus();
    this.codeEnable = true;

 
    this.subscribeToFormChanges();

    this.setInitialValues();
    if(this.content?.FLAG){
      this.setFormValues()
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
      } else if (this.content.FLAG == 'EDIT') {
        this.editableMode = true;
        this.codeEnable = false;
      } else if (this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteRecord()
      }
    }
  }

  private subscribeToFormChanges() {
    this.componentsizemasterForm.valueChanges.subscribe(() => {
      //this.calculateRadius();
      this.getValues()
    });


  }

  private setInitialValues() {
    this.componentsizemasterForm.controls.height.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.componentsizemasterForm.controls.width.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.componentsizemasterForm.controls.length.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.componentsizemasterForm.controls.radius.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))

  }

  checkCode(): boolean {
    if (this.componentsizemasterForm.value.code == '') {
      this.commonService.toastErrorByMsgId('Please enter the Code')
      return true
    }
    return false
  }

  codeEnabled() {
    if (this.componentsizemasterForm.value.code == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }

  }


  setFormValues() {
    console.log(this.content);
    if (!this.content) return
    this.componentsizemasterForm.controls.code.setValue(this.content.COMPSIZE_CODE)
    this.componentsizemasterForm.controls.desc.setValue(this.content.DESCRIPTION)
    this.componentsizemasterForm.controls.height.setValue(this.setDecimalPoint(this.content.HEIGHT))
    this.componentsizemasterForm.controls.width.setValue(this.setDecimalPoint(this.content.WIDTH))
    this.componentsizemasterForm.controls.length.setValue(this.setDecimalPoint(this.content.LENGTH))
    this.componentsizemasterForm.controls.radius.setValue(this.setDecimalPoint(this.content.RADIUS))
  }
  setDecimalPoint(data: any) {
    let number = this.commonService.decimalQuantityFormat(data, 'THREE')
    return this.commonService.commaSeperation(number)
  }

  calculateRadius() {
    let form = this.componentsizemasterForm.value
    const height = this.commonService.emptyToZero(form.height)
    const width = this.commonService.emptyToZero(form.width)

    if (height !== null && width !== null) {
      // Calculate the radius based on the provided formula
      const radiusValue = Math.pow(((width * width) / (8 * height) + (height / 2)), 3 / 3);
      return radiusValue.toFixed(3);
    } else {
      return '0';
    }
  }

  // getValues() {
  //   const height = this.componentsizemasterForm.value.height || 0;
  //   const width = this.componentsizemasterForm.value.width || 0;
  //   const length = this.componentsizemasterForm.value.length || 0;
  //   let radius = this.calculateRadius();
  //   radius = this.setDecimalPoint(radius)


  //   const formattedDesc = `H ${height}#, W ${width}#, L ${length}#, R ${radius}#`;

  //   // Update the form control with the calculated result and description
  //   this.componentsizemasterForm.patchValue({
  //     radius: radius,
  //     desc: formattedDesc
  //   }, { emitEvent: false });
  // }


  getValues() {
    const height = this.componentsizemasterForm.value.height || 0;
    const width = this.componentsizemasterForm.value.width || 0;
    const length = this.componentsizemasterForm.value.length || 0;

    // Ensure radius is a number
    let radius: number = parseFloat(this.calculateRadius()); // Convert to number

    // Check if radius is a valid number, if not, set it to 0
    if (isNaN(radius)) {
      radius = 0;
    }

    else {
      radius = this.setDecimalPoints(radius);
    }

    // Format radius to have at least three decimal places
    const formattedRadius = radius.toFixed(3);
    

    const formattedDesc = `H ${Number(height)}#, W ${Number(width)}#, L ${Number(length)}#, R ${Number(formattedRadius)}#`;

    // Update the form control with the calculated result and description
    this.componentsizemasterForm.patchValue({
      radius: radius,
      desc: formattedDesc
    }, { emitEvent: false });
  }


  setDecimalPoints(value: number): number {
    // Logic to set decimal point
    return parseFloat(value.toFixed(3)); // Return the value with exactly three decimal places
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  formSubmit() {
    console.log(this.componentsizemasterForm.value);

    if (this.content?.FLAG == 'VIEW') return
    if (this.content?.FLAG == 'EDIT') {

      this.update()
      return
    }

    if (this.componentsizemasterForm.value.height > this.componentsizemasterForm.value.width / 2) {
      this.toastr.error('The Height must be Less than the Half of the Width')
      return;
    }


    if (this.componentsizemasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'ComponentSizeMaster/InsertComponentSizeMaster'
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
                this.componentsizemasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub);
  }
  setPostData() {
    let form = this.componentsizemasterForm.value
    return {
      "MID": this.content ? this.content.MID : 0,
      "COMPSIZE_CODE": this.commonService.nullToString(form.code),
      "DESCRIPTION": this.commonService.nullToString(form.desc),
      "RADIUS": this.commonService.nullToString(form.radius),
      "LENGTH": this.commonService.nullToString(form.length),
      "WIDTH": this.commonService.nullToString(form.width),
      "HEIGHT": this.commonService.nullToString(form.height),
    }

  }
  update() {
    if (this.componentsizemasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    if (this.componentsizemasterForm.value.height > this.componentsizemasterForm.value.width / 2) {
      this.toastr.error('The Height must be Less than the Half of the Width')
      return;
    }


    let API = 'ComponentSizeMaster/UpdateComponentSizeMaster/' + this.content.COMPSIZE_CODE
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
                this.componentsizemasterForm.reset()
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
  deleteRecord() {
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
        let API = 'ComponentSizeMaster/DeleteComponentSizeMaster/' + this.content.COMPSIZE_CODE
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
                    this.componentsizemasterForm.reset()
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
                    this.componentsizemasterForm.reset()
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

  onInputChange(event: any, controlName: string, maxLength: number) {
    const inputValue = event.target.value;

    if (inputValue.length > maxLength) {
      this.componentsizemasterForm.get(controlName)!.setValue(inputValue.slice(0, maxLength));
    }
  }
}
