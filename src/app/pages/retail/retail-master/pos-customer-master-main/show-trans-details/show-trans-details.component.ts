import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-show-trans-details",
  templateUrl: "./show-trans-details.component.html",
  styleUrls: ["./show-trans-details.component.scss"],
})
export class ShowTransDetailsComponent implements OnInit {
  fetchedPicture: any;
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {}

  showTarnsDetailsForm: FormGroup = this.formBuilder.group({
    customer: [""],
    customerCode: [""],
    mobile: [""],
    teleRes: [""],
    teleOff: [""],
    faxNo: [""],
    emailId: [""],
    poBox: [""],
    city: [""],
    countryCode: [""],
    country: [""],
  });

  ngOnInit(): void {}

  close() {
    this.activeModal.close();
  }
}
