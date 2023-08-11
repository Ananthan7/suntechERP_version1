import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from 'src/app/core/services/event.service';
import { SignumCRMApiService } from 'src/app/services/signum-crmapi.service';

@Component({
  selector: 'header-panel',
  templateUrl: './header-panel.component.html',
  styleUrls: ['./header-panel.component.scss']
})
export class HeaderPanelComponent implements OnInit {
  @Input() viewPanel: boolean = true;
  @Input() selectedTemplate: any = 'default';
  @Input() templateDataSet: any = [];
  @ViewChild('content') contentTemplate: any;
  currentUser: any;
  branches: any;
  model: any = {}
  templateList: any[] = []
  languageList: any = localStorage.getItem('USER_LANGUAGE')?.split(',')
  currencyList: any = localStorage.getItem('USER_CURRENCY')?.split(',')
  TIME_PERIOD_ACCESS:any = localStorage.getItem('TIME_PERIOD_ACCESS')?.split(',').sort().join(', ')
  constructor(
    private dataService: SignumCRMApiService,
    private EventService: EventService,
    private modalService: NgbModal
  ) {
    this.currentUser = localStorage.getItem('username')
    this.model.tempClickFlag = localStorage.getItem('tempClickFlag')
    
    if (this.model.tempClickFlag && this.model.tempClickFlag == '1') {
      this.selectedTemplate = localStorage.getItem('TEMPLATE_NAME')
    }
    
    this.branches = this.dataService.branchCode.split(',')
    this.branches = this.branches.join(', ')
  }

  ngOnInit(): void {
    // if (!this.selectedTemplate) {
    //   this.selectedTemplate = 'default';
    // }
    
    this.getTemplateSaved()
  }
 
  getTemplateSaved() {
    let link = 'AdminUserTemplateSaving/getUserTemplateSavingList'
    this.dataService.getDynamicAPI(link).then((response: any) => {
      if (response.userTemplateSaving) {
        let userId = localStorage.getItem('USER_ID')
        this.templateList = response.userTemplateSaving
        this.templateList = this.templateList.filter((item: any) => item.USER_ID == userId)
        this.templateList.push({TEMPLATE_NAME: 'Default'})
        if (this.model.tempClickFlag == '0' && this.templateList.length != 0) {
          this.open(this.contentTemplate)
        }
        if(this.selectedTemplate != 'default'){
          this.templateClick({'TEMPLATE_NAME': this.selectedTemplate})
        }
      } else {
        this.templateList = []
      }
    })
  }
  templateClick(item: any) {
    localStorage.setItem('TEMPLATE_NAME',item.TEMPLATE_NAME == 'Default' ? 'default' : item.TEMPLATE_NAME)
    this.selectedTemplate = item.TEMPLATE_NAME
    let tempArr = this.templateList.filter((element: any) => this.selectedTemplate == element.TEMPLATE_NAME)
    if (tempArr) {
      this.EventService.behaviorBroadcast('templateChange', tempArr[0])
    }
  }
  open(content: any) {
    localStorage.setItem('tempClickFlag', '1')
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.EventService.behaviorBroadcast('ApplyFilter', 1)
      },
      (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }
  closeModal() {
    this.modalService.dismissAll()
  }
}
