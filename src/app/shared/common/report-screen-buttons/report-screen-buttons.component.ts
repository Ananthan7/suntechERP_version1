import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Component({
  selector: 'app-report-screen-buttons',
  templateUrl: './report-screen-buttons.component.html',
  styleUrls: ['./report-screen-buttons.component.scss']
})
export class ReportScreenButtonsComponent implements OnInit {
  @Output() saveTemplateClick = new EventEmitter();
  @Output() previewClicked = new EventEmitter();
  @Output() printClicked = new EventEmitter();
  printBtnBoolean: boolean = false;
  excelBtnBoolean: boolean = false;
  pdfBtnBoolean: boolean = false;
  maiBtnBoolean: boolean = false;
  whatsappBtnBoolean: boolean = false;
  @Output() excelClicked = new EventEmitter();
  
  constructor(private CommonService: CommonServiceService) { }

  ngOnInit(): void {
    this.screenButtonEnabler()
  }

  saveTemplate(){
    this.saveTemplateClick.emit();
  }

  previewClick(){
    this.previewClicked.emit();
  }

  printClick(){
    this.printClicked.emit();
  }

  excelExport(){
    this.excelClicked.emit();
  }

  screenButtonEnabler(){
    let screenData = this.CommonService.screenSpecificPermissions
    screenData.filter((item: any)=>{
      if(item.MENU_CAPTION_ENG === this.CommonService.getModuleName()){
        console.log(item.PERMISSION)
      }
    })
  }

  
}
