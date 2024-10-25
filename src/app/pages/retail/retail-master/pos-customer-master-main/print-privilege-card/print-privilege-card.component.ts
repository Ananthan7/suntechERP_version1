import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-print-privilege-card",
  templateUrl: "./print-privilege-card.component.html",
  styleUrls: ["./print-privilege-card.component.scss"],
})
export class PrintPrivilegeCardComponent implements OnInit {
  @Input() htmlContentForPrivilege!: any;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    console.log(this.htmlContentForPrivilege);
  }

  close() {
    this.activeModal.close();
  }
}
