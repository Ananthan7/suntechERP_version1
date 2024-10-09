import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sales-order-register',
  templateUrl: './sales-order-register.component.html',
  styleUrls: ['./sales-order-register.component.scss']
})
export class SalesOrderRegisterComponent implements OnInit {
  private cssFilePath = '/assets/scss/scheme_register_pdf.scss';
  salesOrderRegisterForm: FormGroup = this.formBuilder.group({
    branch : [''],
    fromDate : [new Date()],
    toDate : [new Date()],
    templateName: ['']
  })
  formattedBranchDivisionData: any;
  fetchedBranchDataParam: any[]= [];
  branchDivisionControlsTooltip: any;
  fetchedBranchData: any[] =[];

  
  constructor( private activeModal: NgbActiveModal,  private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
  }

  selectedData(data: any) {
    console.log(data)
    // let content= ``, content2 =``,  content3 =``, content4 =``
    let content = `Current Selected Branches:  \n`
    let content2 = `Current Selected Divisions:  \n`
    let content3 = `Current Selected Area:  \n`
    let content4 = `Current Selected B category:  \n`
    let branchDivisionData = '';
    if(data.BranchData){
      // content = `Current Selected Branches:  \n`
      data.BranchData.forEach((Bdata: any)=>{
        branchDivisionData += Bdata.BRANCH_CODE+'#'
        content += Bdata.BRANCH_CODE ? `${Bdata.BRANCH_CODE}, ` : ''
      }) 
    }

    if(data.DivisionData){
      // content2 = `Current Selected Divisions:  \n`
      data.DivisionData.forEach((Ddata: any)=>{
        branchDivisionData += Ddata.DIVISION_CODE+'#'
        content2 += Ddata.DIVISION_CODE ? `${Ddata.DIVISION_CODE}, ` : ''
      }) 
    }

    if(data.AreaData){
      // content3 = `Current Selected Area:  \n`
      data.AreaData.forEach((Adata: any)=>{
        branchDivisionData += Adata.AREA_CODE+'#'
        content3 += Adata.AREA_CODE ? `${Adata.AREA_CODE}, ` : ''
      }) 
    }

    if(data.BusinessCategData){
      // content4 = `Current Selected B category:  \n`
      data.BusinessCategData.forEach((BCdata: any)=>{
        branchDivisionData += BCdata.CATEGORY_CODE+'#'
        content4 += BCdata.CATEGORY_CODE ? `${BCdata.CATEGORY_CODE}, ` : ''
      }) 
    }

    content = content.replace(/, $/, '');
    content2 = content2.replace(/, $/, '');
    content3 = content3.replace(/, $/, '');
    content4 = content4.replace(/, $/, '');
    this.branchDivisionControlsTooltip = content +'\n'+content2 +'\n'+ content3 +'\n'+ content4


    // const uniqueArray = [...new Set(this.branchDivisionData)];
    // const plainText = uniqueArray.join('');
    this.formattedBranchDivisionData = branchDivisionData
    this.salesOrderRegisterForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  savePdf() {
    const printContent: any = document.getElementById('pdf_container');
    var WindowPrt: any = window.open(
      '',
      '_blank',
      // `height=${window.innerHeight / 1.5}, width=${window.innerWidth / 1.5}`
    );
    WindowPrt.document.write(
      '<html><head><title>SunTech - POS ' +
      new Date().toISOString() +
      '</title></head><body><div>'
    );
    const linkElement = WindowPrt.document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('type', 'text/css');
    linkElement.setAttribute('href', this.cssFilePath);
    WindowPrt.document.head.appendChild(linkElement);

    const bootstrapPdfLinkElement = WindowPrt.document.createElement('link');
    bootstrapPdfLinkElement.setAttribute('rel', 'stylesheet');
    bootstrapPdfLinkElement.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap-print-css/css/bootstrap-print.min.css');
    bootstrapPdfLinkElement.setAttribute('media', 'print');
    WindowPrt.document.head.appendChild(bootstrapPdfLinkElement);

    const bootstrapLinkElement = WindowPrt.document.createElement('link');
    bootstrapLinkElement.setAttribute('rel', 'stylesheet');
    bootstrapLinkElement.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css');
    bootstrapLinkElement.setAttribute('rel', 'stylesheet');
    bootstrapLinkElement.setAttribute('integrity', 'sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC');
    bootstrapLinkElement.setAttribute('crossorigin', 'anonymous');
    WindowPrt.document.head.appendChild(bootstrapLinkElement);

    const bootstrapScriptLinkElement = WindowPrt.document.createElement('script');
    bootstrapScriptLinkElement.setAttribute('src', 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js');
    bootstrapScriptLinkElement.setAttribute('integrity', 'sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM');
    bootstrapScriptLinkElement.setAttribute('crossorigin', 'anonymous');
    WindowPrt.document.head.appendChild(bootstrapScriptLinkElement);

    const fontFamilyLinkElement = WindowPrt.document.createElement('link');
    fontFamilyLinkElement.setAttribute('rel', 'preconnect');
    fontFamilyLinkElement.setAttribute('href', 'https://fonts.googleapis.com');
    WindowPrt.document.head.appendChild(fontFamilyLinkElement);

    const fontFamilyLinkTwoElement = WindowPrt.document.createElement('link');
    fontFamilyLinkTwoElement.setAttribute('rel', 'preconnect');
    fontFamilyLinkTwoElement.setAttribute('href', 'https://fonts.gstatic.com');
    fontFamilyLinkTwoElement.setAttribute('crossorigin','');
    WindowPrt.document.head.appendChild(fontFamilyLinkTwoElement);

    const fontFamilyLinkThreeElement = WindowPrt.document.createElement('link');
    fontFamilyLinkThreeElement.setAttribute('rel', 'stylesheet');
    fontFamilyLinkThreeElement.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    WindowPrt.document.head.appendChild(fontFamilyLinkThreeElement);
 
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.write('</div></body></html>');
    WindowPrt.document.close();
    WindowPrt.focus();
    setTimeout(() => {
      WindowPrt.print();
    }, 800);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


}