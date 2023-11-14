import { Injectable } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';
import { CommonServiceService } from './common-service.service';
import { SuntechAPIService } from './suntech-api.service';

@Injectable({
  providedIn: 'root'
})
export class IndexedApiService {
  userBranch: any;

  constructor(
    private suntechApi: SuntechAPIService,
    private comFunc: CommonServiceService,
    private inDb: IndexedDbService
  ) { }

  setInitailLoadSetUp() {
    /** Start set basic api data */
    this.userBranch = localStorage.getItem('userbranch');

    this.comFunc.mastersList = JSON.parse(sessionStorage.getItem('generalMastersList') || 'null');
    this.comFunc.allbranchMaster = JSON.parse(localStorage.getItem('BRANCH_PARAMETER') || 'null');

    const branchDetailsString = localStorage.getItem('BRANCH_PARAMETER');

    this.inDb.getAllData('compparams').subscribe((data) => {
      if (data.length == 0) {
        this.getAllCompanyParameters();
      } else {
        this.comFunc.allCompanyParams = data;
        this.comFunc.setCompParaValues();
      }
    });

    this.inDb.getAllData('branchCurrencyMaster').subscribe((data) => {
      if (data.length == 0) {
        this.getBranchCurrencyMaster();
      } else {

        this.comFunc.allBranchCurrency = data;
      }
    });

    this.inDb.getAllData('messageBox').subscribe((data) => {
      if (data.length == 0) {

        this.getAllMessageBox();
      } else {
        this.comFunc.allMessageBoxData = data;
      }
    });
    this.inDb.getAllData('comboFilter').subscribe((data) => {
      if (data.length == 0) {
        this.getComboFilter();
      } else {
        this.comFunc.comboFilter = data;
      }
    });
    this.inDb.getAllData('divisionMaster').subscribe((data) => {

      if (data.length == 0) {

        this.getDivisionMaster();
      } else {

        this.comFunc.divisionMasterList = data;
      }
    });
    this.inDb.getAllData('countryMaster').subscribe((data) => {
      if (data.length == 0) {
        this.getCountryMaster();
      } else {
        this.comFunc.countryMaster = data;
      }
    });
    this.inDb.getAllData('nationalityMaster').subscribe((data) => {
      if (data.length == 0) {
        this.getNationalityMaster();
      } else {
        this.comFunc.nationalityMaster = data;
      }
    });
    this.inDb.getAllData('idMaster').subscribe((data) => {
      if (data.length == 0) {
        this.getIdMaster();
      } else {
        this.comFunc.idMaster = data;
      }
    });
    this.inDb.getAllData('customerTypeMaster').subscribe((data) => {
      if (data.length == 0) {
        this.getCustomerTypeMaster();
      } else {
        this.comFunc.customerTypeMaster = data;
      }
    });

    this.inDb.getAllData('RateTypeMaster').subscribe((data) => {
      if (data.length == 0) {
        this.getRateTypeMaster();
      } else {
        this.comFunc.RateTypeMasterData = data;
      }
    });
    this.inDb.getAllData('LocationMaster').subscribe((data) => {
      if (data.length == 0) {
        this.getLocationMasterList();
      } else {
        this.comFunc.LocationMasterData = data;
      }
    });
    this.inDb.getAllData('karatMaster').subscribe((data) => {
      if (data.length == 0) {
        this.getKaratMasterList();
      } else {
        this.comFunc.karatMasterData = data;
      }
    });
    this.inDb.getAllData('CreditCardMaster').subscribe((data) => {
      if (data.length == 0) {
        this.getCreditCardMaster();
      } else {
        this.comFunc.creditCardMasterData = data;
      }
    });
    this.inDb.getAllData('SalespersonMaster').subscribe((data) => {
      if (data.length == 0) {
        this.getSalespersonMasterList();
      } else {
        this.comFunc.SalespersonMasterData = data;
      }
    });
    /** End set basic api data */
  }
  setVocTypeDataOnLoad(branch: any){
    this.inDb.getAllData('VocTypeMaster').subscribe((data) => {
      console.log(data,'data');
      
      if (data.length == 0 || data.length == 1) {
        this.getVocTypeMaster(branch);
      } else {
        this.comFunc.VocTypeMasterData = data;
      }
    });
  }

  getVocTypeMaster(branch:any) {
    let API = `VoctypeMaster/GetVoctypeMasterWithBranchCode/BranchCode=${branch}`
    this.suntechApi.getDynamicAPI(API).subscribe((data) => {
      if (data.status == 'Success') {
        this.comFunc.VocTypeMasterData = data.response;
        this.inDb.bulkInsert('VocTypeMaster', data.response);
      }
    });
  }
  getSalespersonMasterList() {
    this.suntechApi.getDynamicAPI('SalesPersonMaster/GetSalespersonMasterList').subscribe((data) => {
      if (data.status == 'Success') {
        this.comFunc.SalespersonMasterData = data.response;
        this.inDb.bulkInsert('SalespersonMaster', data.response);
      }
    });
  }

  getCreditCardMaster() {
    this.suntechApi.getDynamicAPI('CreditCardMaster/GetCreditCardMaster').subscribe((data) => {
      if (data.status == 'Success') {
        this.comFunc.creditCardMasterData = data.response;
        this.inDb.bulkInsert('CreditCardMaster', data.response);
      }
    });
  }

  getDivisionMaster() {
    this.suntechApi.getDynamicAPI('DivisionMaster/GetDivisionMaster').subscribe((data) => {
      if (data.status == 'Success') {
        this.comFunc.divisionMasterList = data.response;
        this.inDb.bulkInsert('divisionMaster', data.response);
      }
    });
  }

  getCountryMaster() {
    this.suntechApi
      .getDynamicAPI(`GeneralMaster/GetGeneralMasterList/${encodeURIComponent('COUNTRY MASTER')}`)
      .subscribe(async (data) => {
        if (data.status == 'Success') {
          this.comFunc.countryMaster = await data.response;
          this.inDb.bulkInsert('countryMaster', data.response);
        } else {
          this.comFunc.countryMaster = [];
        }
      });
  }

  getNationalityMaster() {
    this.suntechApi
      .getDynamicAPI(`GeneralMaster/GetGeneralMasterList/${encodeURIComponent('NATIONALITY MASTER')}`)
      .subscribe(async (data) => {
        if (data.status == 'Success') {
          this.comFunc.nationalityMaster = await data.response;
          this.inDb.bulkInsert('nationalityMaster', data.response);
        } else {
          this.comFunc.nationalityMaster = [];

        }

      });
  }
  getIdMaster() {
    this.suntechApi.getDynamicAPI(`GeneralMaster/GetGeneralMasterList/${encodeURIComponent('ID MASTER')}`).subscribe(async (data) => {
      if (data.status == 'Success') {
        this.comFunc.idMaster = await data.response;
        this.inDb.bulkInsert('idMaster', data.response);

      } else {
        this.comFunc.idMaster = [];
      }

    });
  }
  getCustomerTypeMaster() {
    this.suntechApi.getDynamicAPI(`GeneralMaster/GetGeneralMasterList/${encodeURIComponent('CUSTOMER TYPE MASTER')}`).subscribe(async (data) => {
      if (data.status == 'Success') {
        this.comFunc.customerTypeMaster = await data.response;
        this.inDb.bulkInsert('customerTypeMaster', data.response);

      } else {
        this.comFunc.customerTypeMaster = [];
      }

    });
  }
  async getComboFilter() {
    this.suntechApi.getDynamicAPI('ComboFilter').subscribe(async (data) => {
      // console.table(data)
      if (data.status == 'Success') {
        this.comFunc.comboFilter = await data.response;
        this.inDb.bulkInsert('comboFilter', data.response);

        // sessionStorage.setItem(
        //   'comboFilterList',
        //   JSON.stringify(data.response)
        // );
      } else {
        this.comFunc.comboFilter = [];
        // sessionStorage.setItem(
        //   'comboFilterList',
        //   JSON.stringify(data.response)
        // );
      }
    });
  }

  getBranchCurrencyMaster() {
    this.suntechApi
      .getDynamicAPI(`BranchCurrencyMaster/GetBranchCurrencyMasterDetail/${localStorage.getItem('userbranch')}`)
      // this.suntechApi.getBranchCurrencyMaster(branch)
      .subscribe((data) => {
        // this.comFunc.allBranchCurrency = data.response;
        this.comFunc.allBranchCurrency = data.response;
        this.inDb.bulkInsert('branchCurrencyMaster', data.response);

      });
  }

  getAllCompanyParameters() {
    let map = new Map();
    this.suntechApi.getDynamicAPI('CompanyParameters').subscribe((resp) => {
      if (resp.status == 'Success') {
        //  set data in local
        this.inDb.bulkInsert('compparams', resp.response);

        // this.suntechApi.setCompanyParamSubject('testsubject');
        // console.log(resp.response.length);
        // for (var i = 0; i < resp.response.length; i++) {
        //   map.set(resp.response[i].PARAMETER, resp.response[i].PARAM_VALUE);
        // }
        // let jsonObject = {};
        // map.forEach((value, key) => {
        //   jsonObject[key] = value;
        // });
        // this.comFunc.allCompanyParams = jsonObject;
        this.comFunc.allCompanyParams = resp.response;
        this.setCompParaValues();
      } else {
        this.comFunc.allCompanyParams = [];
      }
    });
  }

  setCompParaValues() {
    this.comFunc.allCompanyParams.filter((data: any) => {
      if (data.PARAMETER == 'AMTFORMAT')
        this.comFunc.amtFormat = data.PARAM_VALUE;
      if (data.PARAMETER == 'MQTYFORMAT')
        this.comFunc.mQtyFormat = data.PARAM_VALUE;
      if (data.PARAMETER == 'AMTDECIMALS') {
        this.comFunc.amtDecimals = data.PARAM_VALUE;
      }
      if (data.PARAMETER == 'MQTYDECIMALS')
        this.comFunc.mQtyDecimals = data.PARAM_VALUE;
      if (data.PARAMETER == 'POSSHOPCTRLAC')
        this.comFunc.basePartyCode = data.PARAM_VALUE;

      if (data.PARAMETER == 'COMPANYCURRENCY') {
        this.comFunc.compCurrency = data.PARAM_VALUE;
      }
      if (data.Parameter == 'POSKARATRATECHANGE') {
        this.comFunc.posKARATRATECHANGE = data.Param_Value;
        if (this.comFunc.posKARATRATECHANGE.toString() == '0') {
          this.comFunc.formControlSetReadOnlyByClass('karat_code', true);
        }
      }

      if (data.PARAMETER == 'POPMETALVALUEONNET') {
        this.comFunc.popMetalValueOnNet = data.PARAM_VALUE;
      }
    });
  }

  getAllMessageBox() {
    this.suntechApi.getDynamicAPI('MessageBoxNet').subscribe((resp) => {
      if (resp.status == 'Success') {
        this.comFunc.allMessageBoxData = resp.response;
        this.inDb.bulkInsert('messageBox', resp.response);
      }
    });
  }
  getRateTypeMaster() {
    this.suntechApi.getDynamicAPI('RateTypeMaster/GetRateTypeMasterHeaderList').subscribe((resp) => {
      if (resp.status == 'Success') {
        this.comFunc.RateTypeMasterData = resp.response;
        this.inDb.bulkInsert('RateTypeMaster', resp.response);
      }
    });
  }
  getLocationMasterList() {
    this.suntechApi.getDynamicAPI('LocationMaster/GetLocationMasterList').subscribe((resp) => {
      if (resp.status == 'Success') {
        this.comFunc.LocationMasterData = resp.response;
        this.inDb.bulkInsert('LocationMaster', resp.response);
      }
    });
  }
  getKaratMasterList() {
    this.suntechApi.getDynamicAPI('karatMaster/GetKaratMasterList').subscribe((resp) => {
      if (resp.status == 'Success') {
        this.comFunc.karatMasterData = resp.response;
        this.inDb.bulkInsert('karatMaster', resp.response);
      }
    });
  }
}
