import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

  componentsizemasterForm!: FormGroup;
  // subscriptions: any;
  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  tableData: any[] = [];
  radius!: number;
  viewMode: boolean = false;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    
  ) { }
  @ViewChild('codeInput1') codeInput1!: ElementRef;


  ngAfterViewInit() {
    // Focus on the first input
    if (this.codeInput1) {
      this.codeInput1.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    this.componentsizemasterForm = this.formBuilder.group({
      code: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      height: ['',[Validators.required]],
      width: ['',[Validators.required]],
      length: [''],
      radius: ['']
    });
    this.subscribeToFormChanges();
  }

  private subscribeToFormChanges() {
    this.componentsizemasterForm.valueChanges.subscribe(() => {
      this.calculateRadius();
      this.getValues()
    });

    if (this.content.FLAG == 'VIEW') {
      this.setFormValues()
      this.viewMode = true;
     
    } else if (this.content.FLAG == 'EDIT') {
      this.setFormValues()
    }
  }

  setFormValues() {
    console.log(this.content);
    if (!this.content) return
    this.componentsizemasterForm.controls.code.setValue(this.content.COMPSIZE_CODE)
    this.componentsizemasterForm.controls.desc.setValue(this.content.DESCRIPTION)
    this.componentsizemasterForm.controls.height.setValue(this.content.HEIGHT)
    this.componentsizemasterForm.controls.width.setValue(this.content.WIDTH)
    this.componentsizemasterForm.controls.length.setValue(this.content.LENGTH)
    this.componentsizemasterForm.controls.radius.setValue(this.content.RADIUS)
  }


  calculateRadius() {
    const height = this.componentsizemasterForm.get('height')?.value;
    const width = this.componentsizemasterForm.get('width')?.value;
  
    if (height !== null && width !== null) {
      // Calculate the radius based on the provided formula
      const radiusValue = Math.pow(((width * width) / (8 * height) + (height / 2)),3/3);
      return radiusValue.toFixed(2); 
    } else {
      return '0'; 
    }
  }
  
  getValues() {
    const height = this.componentsizemasterForm.value.height || 0;
      const width = this.componentsizemasterForm.value.width || 0;
      const length = this.componentsizemasterForm.value.length || 0;
      const radius = this.calculateRadius();
    
      const formattedDesc = `H ${height}#, W ${width}#, L ${length}#, R ${radius}#`;
    
      // Update the form control with the calculated result and description
      this.componentsizemasterForm.patchValue({
        radius: radius,
        desc: formattedDesc
      }, { emitEvent: false });
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
    if (this.componentsizemasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'ComponentSizeMaster/InsertComponentSizeMaster'
    let postData = {
      "MID": 0,
      "COMPSIZE_CODE": this.componentsizemasterForm.value.code || "",
      "DESCRIPTION": this.componentsizemasterForm.value.desc || "",
      "RADIUS": this.componentsizemasterForm.value.radius || 0,
      "LENGTH": this.componentsizemasterForm.value.length || 0,
      "WIDTH": this.componentsizemasterForm.value.width || 0,
      "HEIGHT": this.componentsizemasterForm.value.height || 0
    }

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

  update() {
    if (this.componentsizemasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'ComponentSizeMaster/UpdateComponentSizeMaster/' + this.content.COMPSIZE_CODE
    let postData =
    {
      "MID": 0,
      "COMPSIZE_CODE": this.componentsizemasterForm.value.code || "",
      "DESCRIPTION": this.componentsizemasterForm.value.desc || "",
      "RADIUS": this.componentsizemasterForm.value.radius || "",
      "LENGTH": this.componentsizemasterForm.value.length || "",
      "WIDTH": this.componentsizemasterForm.value.width || "",
      "HEIGHT": this.componentsizemasterForm.value.height || ""
    }


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
