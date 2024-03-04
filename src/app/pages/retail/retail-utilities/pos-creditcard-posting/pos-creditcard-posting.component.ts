import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pos-creditcard-posting',
  templateUrl: './pos-creditcard-posting.component.html',
  styleUrls: ['./pos-creditcard-posting.component.scss']
})
export class PosCreditcardPostingComponent implements OnInit {
  @Input() content!: any;
  viewMode: boolean = false;
  tableData: any[] = [];
  branchList: any[] = []
  toastr: any;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }
  ngOnInit(): void {

    this.viewMode = true;
  }



  creditCardPostingFrom: FormGroup = this.formBuilder.group({
    branch: [''],
    fromdate: [''],
    todate: [''],
    orderedby: [''],
    trans: [''],
    filter: [''],
    Narration:[''],
    Range:[''],
    Selection:['']
  });

  dateChange(event: any, flag?: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue);
    let yr = date.getFullYear();
    let dt = date.getDate();
    let dy = date.getMonth();
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.creditCardPostingFrom.controls.VocDate.setValue(new Date(date));
    }
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  deleteRecord() {
    
    Swal.fire({
      title: 'Confirmation',
      text: "After posting You are not able to edit POS! Are you sure?",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
      
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "Yes"
        Swal.fire({
          html: `
          <div class="row">
          <label for="inputPassword" class="col-sm-4 col-form-label">Voucher Type:</label>
          <div class="col-md-3">
            <div class="position-relative d-flex">
              <mat-form-field style="width: 70%;">
                <input type="text" matInput formControlName="voctype" />
              </mat-form-field>
            </div>
          </div>
          </div>
        </div>
        <div class="row">
        <label for="inputPassword" class="col-sm-4 col-form-label">Voucher Date:</label>
        <div class="col-md-3">
          <div class="position-relative d-flex">
            <mat-form-field style="width: 70%;">
              <input type="text" matInput formControlName="vocdate" />
            </mat-form-field>
          </div>
        </div>
      </div>
      <div class="row">
      <label for="inputPassword" class="col-sm-4 col-form-label">Voucher No:</label>
      <div class="col-md-3">
        <div class="position-relative d-flex">
          <mat-form-field style="width: 70%;">
            <input type="text" matInput formControlName="vocno" />
          </mat-form-field>
        </div>
      </div>
    </div>
    <div class="row">
    <label for="inputPassword" class="col-sm-4 col-form-label">Comm Amount:</label>
    <div class="col-md-3">
      <div class="position-relative d-flex">
        <mat-form-field style="width: 70%;">
          <input type="text" matInput formControlName="commamount" />
        </mat-form-field>
      </div>
    </div>
  </div>
  <div class="row">
  <label for="inputPassword" class="col-sm-4 col-form-label">VAT Amount:</label>
  <div class="col-md-3">
    <div class="position-relative d-flex">
      <mat-form-field style="width: 70%;">
        <input type="text" matInput formControlName="vatamount" />
      </mat-form-field>
    </div>
  </div>
</div>
<div class="row">
<label for="inputPassword" class="col-sm-4 col-form-label">Amount Posted:</label>
<div class="col-md-3">
  <div class="position-relative d-flex">
    <mat-form-field style="width: 70%;">
      <input type="text" matInput formControlName="amountposted" />
    </mat-form-field>
  </div>
</div>
</div>
<div class="row">
<label for="inputPassword" class="col-sm-4 col-form-label">No Item:</label>
<div class="col-md-3">
  <div class="position-relative d-flex">
    <mat-form-field style="width: 70%;">
      <input type="text" matInput formControlName="noitem" />
    </mat-form-field>
  </div>
</div>
</div>
<div class="row">
<label for="inputPassword" class="col-sm-4 col-form-label">Narration:</label>
<div class="col-md-3">
  <div class="position-relative d-flex">
    <mat-form-field style="width: 70%;">
      <input type="text" matInput formControlName="narration" />
    </mat-form-field>
  </div>
</div>
</div>
</div>   
          `,
          showCancelButton: true,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          preConfirm: () => {
            return {
              voctype: (<HTMLInputElement>document.getElementById('invoctype')).value,
              vocdate: (<HTMLInputElement>document.getElementById('vocdate')).value,
              vocno: (<HTMLInputElement>document.getElementById('vocno')).value,
              commamount: (<HTMLInputElement>document.getElementById('commAmount')).value,
              vatAmount: (<HTMLInputElement>document.getElementById('vatAmount')).value,
              amountposted: (<HTMLInputElement>document.getElementById('noItem')).value,
              noitem: (<HTMLInputElement>document.getElementById('noItem')).value,
              narration: (<HTMLTextAreaElement>document.getElementById('narration')).value
            };
          }
        }).then((formResult) => {
          // Handle form submission result
          if (formResult.isConfirmed) {
            // Do something with the form values
            console.log('Form values:', formResult.value);
          } else {
            // User clicked "Cancel" or closed the dialog, do nothing or handle as needed
          }
        });
      } else {
        // User clicked "No" or closed the dialog, do nothing or handle as needed
      }
    });
  }
}