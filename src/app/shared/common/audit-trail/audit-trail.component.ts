import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent implements OnInit {
  @Input() display: boolean = false;
  @Input() dataToEditrow: any;
  @Input() gridData: any[] = [];
  @ViewChild('content') public content!: NgbModal;

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  showDialog() {
    const modalRef: NgbModalRef = this.modalService.open(this.content, {
      size: "lg",
      backdrop: true, //'static'
      backdropClass: 'backdrop',
      keyboard: false,
      windowClass: "modal-full-width",
    });
    modalRef.componentInstance.content = this.dataToEditrow;
    modalRef.result.then(
      (result) => {
        if (result) {
        }
      },
      (reason) => {
        // Handle modal dismissal (if needed)
      }
    );
  }
}
