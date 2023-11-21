import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-scheme-register',
  templateUrl: './scheme-register.component.html',
  styleUrls: ['./scheme-register.component.scss']
})
export class SchemeRegisterComponent implements OnInit {
  vocMaxDate = new Date();
  currentDate = new Date();
  private cssFilePath = '/assets/scss/scheme_register_pdf.scss';
  // private cssFilePath = 'assets/scheme_register_pdf.scss';

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
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

    const bootstrapLinkElement = WindowPrt.document.createElement('link');
    bootstrapLinkElement.setAttribute('rel', 'stylesheet');
    bootstrapLinkElement.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap-print-css/css/bootstrap-print.min.css');
    bootstrapLinkElement.setAttribute('media', 'print');
    WindowPrt.document.head.appendChild(bootstrapLinkElement);

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
