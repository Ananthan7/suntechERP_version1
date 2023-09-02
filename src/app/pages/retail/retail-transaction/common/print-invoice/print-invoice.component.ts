import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  printInvoice() {
    console.log('printing...');
    let _validate = [{}]
    if (_validate[0]) {
      const printContent: any  = document.getElementById('print_invoice');
      var WindowPrt:any = window.open(
        '',
        '_blank',
        `height=${window.innerHeight / 1.5}, width=${window.innerWidth / 1.5}`
      );
      /* WindowPrt.document.write(
        '<html><title>SunTech</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"><style>.anim-rotate {animation: anim-rotate 1s linear infinite;}@keyframes anim-rotate {100% {transform: rotate(360deg);}}.anim-close-card {animation: anim-close-card 1.4s linear;}@keyframes anim-close-card {100% {opacity: 0.3;transform: scale3d(.3, .3, .3);}}.card {box-shadow: $card-shadow;margin-bottom: 30px;transition: all 0.3s ease-in-out;&:hover {box-shadow: 0 0 25px -5px #9e9c9e;}.card-header {border-bottom: $card-header-border;position: relative;+.card-body {padding-top: 0;}h5 {margin-bottom: 0;color: $theme-heading-color;font-size: 14px;font-weight: 700;display: inline-block;margin-right: 10px;line-height: 1.1;position: relative;}.card-header-right {right: 10px;top: 10px;display: inline-block;float: right;padding: 0;position: absolute;@media only screen and (max-width: 575px) {display: none;}.dropdown-menu {margin-top: 0;li {cursor: pointer;a {font-size: 14px;text-transform: capitalize;}}}.btn.dropdown-toggle {border: none;background: transparent;box-shadow: none;color: #888;i {margin-right: 0;}&:after {display: none;}&:focus {box-shadow: none;outline: none;}}// custom toggler .btn.dropdown-toggle {border: none;background: transparent;box-shadow: none;padding: 0;width: 20px;height: 20px;right: 8px;top: 8px;&.mobile-menu span {background-color: #888;height: 2px;border-radius: 5px;&:after, &:before {border-radius: 5px;height: 2px;background-color: #888;}}}.nav-pills {padding: 0;box-shadow: none;background: transparent;}}}.card-footer {padding: 0px !important;background-color: none !important ;border-top: 0px !important}}.card-block, .card-body {padding: 20px 25px;}&.card-load {position: relative;overflow: hidden;.card-loader {position: absolute;top: 0;left: 0;width: 100%;height: 100%;display: flex;align-items: center;background-color: rgba(256, 256, 256,0.7);z-index: 999;i {margin: 0 auto;color: $primary-color;font-size: 24px;align-items: center;display: flex;}}}&.full-card {z-index: 99999;border-radius: 0;}}h4 {margin-bottom: 5px;}.btn-sm, .btn-group-sm>.btn {font-size: 12px;}.view-group {display: -ms-flexbox;display: flex;-ms-flex-direction: row;flex-direction: row;padding-left: 0;margin-bottom: 0;}.thumbnail {height: 180px;margin-bottom: 30px;padding: 0px;-webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px;}.item.list-group-item {float: none;width: 100%;background-color: #fff;margin-bottom: 30px;-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding: 0 1rem;border: 0;}.item.list-group-item .img-event {float: left;width: 30%;}.item.list-group-item .list-group-image {margin-right: 10px;}.item.list-group-item .thumbnail {margin-bottom: 0px;width: 100%;display: inline-block;}.item.list-group-item .caption {float: left;width: 70%;margin: 0;}.item.list-group-item:before, .item.list-group-item:after {display: table;content: " ";}.item.list-group-item:after {clear: both;}.card-title {margin-bottom: 5px;}h4 {font-size: 18px;}.card .card-block, .card .card-body {padding: 10px;}.caption p {margin-bottom: 5px;}.price {font-weight: 500;font-size: 1.25rem;color: #826d22;}.list-group-item .img-fluid {max-width: 75% !important;height: auto;}.list-group-item .img-event {text-align: center;}@media (min-width: 400px) {.list-group-item .table_comp_w {width: 50%;margin-top: -20%;margin-left: 35%;}}:host ::ng-deep .mat-form-field-appearance-outline .mat-form-field-infix {padding: .5em 0 .5em 0 !important;}:host ::ng-deep .mat-form-field-wrapper {padding-bottom: 0.34375em;}.prod_weight td, .prod_weight th {padding: 5px 0px;font-size: 12px;}.prod_weight th {background-color: #ededf1;}.prod_weight td {color: #b3852d;}    table, th, td {border: 1px solid black; border-collapse: collapse;  }    th, td {    padding: 5px;    text-align: left;    }</style><body><div>'
      );*/

      // SunTech - POS
      WindowPrt.document.write(
        '<html><head><title>SunTech - POS ' +
        new Date().toISOString() +
        '</title></head><style> table, th, td { border: 1px solid black;border-collapse: collapse;}th, td {padding: 5px;text-align: left;}</style><body><div>'
      );
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.write('</div></body></html>');
      WindowPrt.document.close();
      WindowPrt.focus();
      setTimeout(() => {
        WindowPrt.print();
      }, 800);
      console.log('printing... end ');
      console.log(printContent.innerHTML);
      //WindowPrt.close();
    } else {
      // alert(_validate[1]);
    }
  }

}
