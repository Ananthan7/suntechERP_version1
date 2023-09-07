import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stone-pricing-master',
  templateUrl: './stone-pricing-master.component.html',
  styleUrls: ['./stone-pricing-master.component.scss']
})
export class StonePricingMasterComponent implements OnInit {

  @Input() content!: any; 
  
  stonePrizeMasterForm: FormGroup = this.formBuilder.group({
    price_code: ['', [Validators.required]],
    sleve_set: ['', [Validators.required]],
    shape: ['', [Validators.required]],
    sleve_form: ['', [Validators.required]],
    sleve_to: ['', [Validators.required]],
    color: [''],
    clarity: [''],
    size_from: [''],
    size_to: [''],
    currency: [''],
    carat_wt: [''],
    size_from_desc: [''],
    size_to_desc: [''],
    wt_from: [''],
    wt_to: [''],
    issue_rate: [''],
    selling: [''],
    selling_rate: [''],
  })
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    // if(this.content){
    //   this.setFormValues()
    // }
  }
  setFormValues() {
    if(!this.content) return
    this.stonePrizeMasterForm.controls.price_code.setValue(this.content.price_code)
    this.stonePrizeMasterForm.controls.sleve_set.setValue(this.content.sleve_set)
    this.stonePrizeMasterForm.controls.shape.setValue(this.content.shape)
    this.stonePrizeMasterForm.controls.sleve_form.setValue(this.content.sleve_form)
    this.stonePrizeMasterForm.controls.sleve_to.setValue(this.content.sleve_to)
    this.stonePrizeMasterForm.controls.color.setValue(this.content.color)
    this.stonePrizeMasterForm.controls.clarity.setValue(this.content.clarity)
    this.stonePrizeMasterForm.controls.size_from.setValue(this.content.size_from)
    this.stonePrizeMasterForm.controls.size_to.setValue(this.content.size_to)
    this.stonePrizeMasterForm.controls.currency.setValue(this.content.currency)
    this.stonePrizeMasterForm.controls.carat_wt.setValue(this.content.carat_wt)
    this.stonePrizeMasterForm.controls.size_from_desc.setValue(this.content.size_from_desc)
    this.stonePrizeMasterForm.controls.size_to_desc.setValue(this.content.size_to_desc)
    this.stonePrizeMasterForm.controls.wt_from.setValue(this.content.wt_from)
    this.stonePrizeMasterForm.controls.wt_to.setValue(this.content.wt_to)
    this.stonePrizeMasterForm.controls.issue_rate.setValue(this.content.issue_rate)
    this.stonePrizeMasterForm.controls.selling.setValue(this.content.selling)
    this.stonePrizeMasterForm.controls.selling_rate.setValue(this.content.selling_rate)
  }
  formSubmit(){
  }
  close() {
    //TODO reset forms and data before closing
    this.activeModal.close();
  }

}