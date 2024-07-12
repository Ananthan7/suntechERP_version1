import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ounce-rate-master',
  templateUrl: './ounce-rate-master.component.html',
  styleUrls: ['./ounce-rate-master.component.scss']
})
export class OunceRateMasterComponent implements OnInit {

  dataSource: any[] = [];
  ounceRateList: any = {};
  combinedRequest: any = {};
  currentDate = new Date();
  dailyRate: any;
  private subscriptions: Subscription[] = [];

  rateOunceForm: FormGroup = this.formBuilder.group({
    date: [new Date()],
    division: [""],
    rateType: [""],
    currency: [""],
    currencyRate: [""],
    ounceRate: [""],
    gramRate: [""],
  });

  columnhead: any[] = [
    "System Rate Criteria",
    "Internal Rate",
    "G and JG Margin",
    "Total",
    "Board Price",
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.handleOunceRate("LOAD");
  }

  onOunceRateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const ounceRate = target.value;
    this.handleOunceRate('UPDATE', ounceRate);
  }

  handleOunceRate(flag: string, ounceRate?: any) {
    const API = `UspDailyRateOunceWeb`;
    const postData = {
      "FLAG": flag,
      "INPUT": {
        "STRMAINVOCTYPE": this.comService.getqueryParamVocType(),
        "TXTOUNCERATE": ounceRate ? ounceRate.toString() : "0",
        "DBLGETVALUE": flag === "LOAD" ? "0" : "1"
      }
    };

    this.dataService.postDynamicAPI(API, postData).subscribe((res: any) => {
      if (res.status == "Success") {
        if (flag === "LOAD") {
          const data = res.dynamicData[0][0];
          this.rateOunceForm.controls.division.setValue(data["DIVISION_CODE"]);
          this.rateOunceForm.controls.rateType.setValue(data["RATE_TYPE"]);
          this.rateOunceForm.controls.currency.setValue(data["CURRENCY_CODE"]);
          this.rateOunceForm.controls.currencyRate.setValue(data["CURRENCY_RATE"]);
          this.rateOunceForm.controls.ounceRate.setValue(
            this.comService.decimalQuantityFormat(data["WHOLESALE_RATE"], 'PURITY')
          );

          this.handleOunceRate("UPDATE", data["WHOLESALE_RATE"]);
        } else if (flag === "UPDATE") {
          this.dataSource = [];
          this.rateOunceForm.controls.gramRate.setValue('');
          this.dataSource = res.dynamicData[0];
          this.rateOunceForm.controls.gramRate.setValue(
            this.comService.decimalQuantityFormat(res.dynamicData[1][0].Column1, 'PURITY')
          );
          this.ounceRateList = JSON.parse(res.dynamicData[1][0].JSONB);
          console.log(this.ounceRateList);
          this.setPostAPIParams(this.ounceRateList);


        }
      }
    });
  }


  setPostAPIParams(ounceRateList: any) {
    this.dailyRate = {
      "DATE": this.rateOunceForm.value.date,
      "DIVISION_CODE": this.rateOunceForm.value.division,
      "BASE_RATE_TYPE": this.rateOunceForm.value.rateType,
      "CURRENCY": this.rateOunceForm.value.currency,
      "OUNCE_RATE": this.rateOunceForm.value.ounceRate,
      "GRAM_RATE": this.rateOunceForm.value.gramRate,
      "POP_PUR_RATE": 0,
      "POS_SELL_RATE": 0
    };

    this.combinedRequest = {
      dailyRate: this.dailyRate,
      internationalRate: ounceRateList.internationalRate,
      gandjgMargin: ounceRateList.gandjgMargin,
      totalRate: ounceRateList.totalRate,
      boardPrice: ounceRateList.boardPrice,
      userName: localStorage.getItem('username'),
      editReason: "",
      editDesc: ""
    };
    console.log(this.combinedRequest);
  }

insertExchangeRate(){


  const saveApi = 'DailyOunceRate';
  let Sub: Subscription = this.dataService.postDynamicAPI(saveApi, this.combinedRequest)
  .subscribe((result) => {
    if (result) {
      if (result.status == "Success") {
        Swal.fire({
          title: result.message || 'Success',
          text: '',
          icon: 'success',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        }).then((result: any) => {
          if (result.value) {
            this.rateOunceForm.reset()
            this.dataSource = []
            this.close('reloadMainGrid')
          }
        });
      }
    } else {
      this.toastr.error('Not saved')
    }
  }, err => alert(err))
this.subscriptions.push(Sub)


  // this.dataService.postDynamicAPICustom(`DailyOunceRate`, this.combinedRequest)
  // .subscribe((result: any) => {
  //   console.log(result);

  // });
}

  customizeText(data: any) {
    if (isNaN(data.value)) {
      return '';
    } else {
      return data.value.toFixed(6);
    }
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

}
