import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignumCRMApiService {
  liveBaseAPIPath: string = 'http://supportdata.sunwebapps.com/';
  liveAPIPath: string = 'http://supportdata.sunwebapps.com/api/';
  SignumAPIPath: string = 'http://34.242.202.25:93/api/';

  branchCode: any = localStorage.getItem('userbranch');

  private _trickerSubject = new Subject<any>();
  public editorData: any;
  constructor(
    private http: HttpClient
  ) { }

  dynamicFunction(funcName: any) {
    console.log('*********' + funcName + '********');
    (this as any)[funcName]();
  }
  
  async getDynamicAPI(apiName: any) {
    const response = await this.http.get(this.SignumAPIPath + apiName).toPromise();
    return response;
  }
  async postDynamicAPI(apiName: any,data:any) {
    const response = await this.http.post(this.SignumAPIPath + apiName,data).toPromise();
    return response;
  }
  async putDynamicAPI(apiName: any,data:any) {
    const response = await this.http.put(this.SignumAPIPath + apiName,data).toPromise();
    return response;
  }
  async deleteDynamicAPI(apiName: any,data: any) {
    const response = await this.http.delete(environment.api_SignumApiPath_url + apiName+ data).toPromise();
    return response;
  }
  async getSubModuleByModule(module: any) {
    const response = await this.http.get(this.liveAPIPath + 'SupportSubModule?strModule=' + module).toPromise();
    return response;
  }
  // subject function start
  clickSubject(value: any) {
    this._trickerSubject.next(value);
  }
  getObservable(): Subject<any> {
    return this._trickerSubject;
  }
  // subject function end

  //task page

  async saveTask(postData: any) {
    const response = await this.http.post(`${this.liveAPIPath}SuntechTask`, postData).toPromise();
    return response;
  }

  async getTypebydepartment(strDepartment: any) {
    const response = await this.http.get(this.liveAPIPath + 'SuntechTaskType?strDepartment=' + strDepartment).toPromise();
    return response;
  }
  async getTask() {
    const response = await this.http.get(this.liveAPIPath + 'SuntechTask').toPromise();
    return response;
  }
  /** getRoleBaseKpiChartData  api*/
  async getRoleBaseKpiChartData() {
    // const response = await this.http.get(environment.api_SignumApiPath_url + 'SignumReport/RoleBasedKPI/' + this.branchCode).toPromise();
    const response = await this.http.get(environment.api_SignumApiPath_url + 'SignumReport/RoleBasedKPIVisual/' + this.branchCode).toPromise();
    return response;
  }
  /** getRoleBaseKpiChartData year  api*/
  async getKpiEvolutionData(filter: string) {
    let response
    if (filter == 'Year') {
      response = await this.http.get(environment.api_SignumApiPath_url + 'SignumReport/KPIEvolution/KPIEvolutionAllDataBranchwiseVisual/' + this.branchCode).toPromise();
    } else if (filter == 'YTD') {
      response = await this.http.get(environment.api_SignumApiPath_url + 'SignumReport/KPIEvolution/KPIEvolutionAllDataBranchwiseVisual/' + this.branchCode).toPromise();
    } else if (filter == 'Quarter') {
      response = await this.http.get(environment.api_SignumApiPath_url + 'SignumReport/KPIEvolution/KPIEvolutionAllDataBranchwiseVisual/' + this.branchCode).toPromise();
    } else if (filter == 'QOQ') {
      response = await this.http.get(environment.api_SignumApiPath_url + 'SignumReport/KPIEvolution/KPIEvolutionAllDataBranchwiseVisual/' + this.branchCode).toPromise();
    } else if (filter == 'Month') {
      response = await this.http.get(environment.api_SignumApiPath_url + 'SignumReport/KPIEvolution/KPIEvolutionAllDataBranchwiseVisual/' + this.branchCode).toPromise();
    }
    return response;
  }
  async getKpiEvolutionYearData() {
    let branchcode = localStorage.getItem('branch')
    const response = await this.http.get(environment.api_SignumApiPath_url + 'SignumReport/KPIEvolution/KPIEvolutionYear/' + branchcode).toPromise();
    return response;
  }

  async getSideMenu() {
    const response = await this.http.get(this.SignumAPIPath + 'MainMenuMaster/getMainMenuMasterList').toPromise();
    return response;
  }

  /** getRoleBaseKpiChartData YTD  api*/
  async getKpiEvolutionYtdData() {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'SignumReport/KPIEvolution/KPIEvolutionYTD').toPromise();
    return response;
  }
  async getSalesmanBoard() {
    const response = await this.http.get(this.SignumAPIPath + 'SalesmanBoardVisual/' + this.branchCode).toPromise();
    // const response = await this.http.get(this.SignumAPIPath + 'SalesmanBoard/' + this.branchCode).toPromise();
    return response;
  }
  async getOverallSalesMetrics() {
    const response = await this.http.get(this.SignumAPIPath + 'OverallSalesMetricsVisual/' + this.branchCode).toPromise();
    return response;
  }

  async getBranchDetailsTarget(branchCode: any) {
    const response = await this.http.get(this.SignumAPIPath + 'BranchDetailsWithTargetVisual/' + branchCode).toPromise();
    return response;
  }

  async getSalesInventroyTrends() {
    const response = await this.http.get(this.SignumAPIPath + 'SignumReport/Inventory/SalesAndInventoryTrends/' + this.branchCode).toPromise();
    return response;
  }

  async getSalesmanParetoData() {
    const response = await this.http.get(this.SignumAPIPath + 'SalesmanParetoAnalysisVisual/' + this.branchCode).toPromise();
    return response;
  }

  async getSalesmanAnalysisData(branch: any, salesman: any) {
    const response = await this.http.get(this.SignumAPIPath + 'SalesmanAnalysisVisual/' + branch).toPromise();
    // const response = await this.http.get(this.SignumAPIPath + 'SalesmanAnalysisVisual/' + branch + '/' + salesman).toPromise();
    return response;
  }

  async getCustomerDemographics() {
    const response = await this.http.get(this.SignumAPIPath + 'CustomerDemographicsVisual/' + this.branchCode).toPromise();
    return response;
  }

  async getSalesBranchwise() {
    const response = await this.http.get(this.SignumAPIPath + 'OverallSalesBranchwiseVisual/' + this.branchCode).toPromise();
    return response;
  }

  async getSalesmanPerformance() {
    const response = await this.http.get(this.SignumAPIPath + 'SalesmanPerformanceVisual/' + this.branchCode).toPromise();
    return response;
  }

  async getYtdBranchComparison() {
    const response = await this.http.get(this.SignumAPIPath + 'SignumReport/BranchPerformance/YTDBranchComparison/' + this.branchCode).toPromise();
    return response;
  }

  async getSalesOverView(branch: any) {
    const response = await this.http.get(this.SignumAPIPath + 'SalesOverview/' + branch).toPromise();
    return response;
  }

  /** settings create new role api*/
  async insertRoleMaster(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'RoleMaster/insertRoleMaster', postData).toPromise();
    return response;
  }
  /** settings create new insertUserMaster user api*/
  async settingsUserMaster(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'UserMaster/insertUserMaster', postData).toPromise();
    return response;
  }
  /** settings save config Branch  api
   * RoleConfiguration/insertRoleConfiguration
  */
  async saveBranchConfiguration(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'BranchConfiguration/insertBranchConfiguration', postData).toPromise();
    return response;
  }
  /** settings save config Branch  api*/
  async saveRoleConfiguration(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'RoleConfiguration/insertRoleConfiguration', postData).toPromise();
    return response;
  }
  /** settings save config Division api*/
  async saveDivisionConfiguration(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'DivisionConfiguration/insertDivisionConfiguration', postData).toPromise();
    return response;
  }
  /** settings save config date api*/
  async saveDateConfiguration(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'DateConfiguration/insertDateConfiguration', postData).toPromise();
    return response;
  }
  /** settings save config date api*/
  async saveFestivalDateConfiguration(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'FestivalConfiguration/insertFestivalConfiguration', postData).toPromise();
    return response;
  }
  /** settings save config date api*/
  async saveCurrencySelection(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'CurrencyMaster/insertCurrency', postData).toPromise();
    return response;
  }
  /** settings save config date api*/
  async saveBranchSellingPrice(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'BranchSellingPrice/insertBranchSellingPrice', postData).toPromise();
    return response;
  }
  /** settings save config date api*/
  async saveSalespersonConfiguration(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'SalespersonConfiguration/insertSalespersonConfig', postData).toPromise();
    return response;
  }
  /** settings save config date api*/
  async saveFilterReports(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'ProductAttributes/insertProductAttribute', postData).toPromise();
    return response;
  }
  /** settings get Festival list api*/
  async getFestivallist() {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'ControlPanelSettingMasters/FestivalMaster').toPromise();
    return response;
  }
  /** settings get Branch list api*/
  async getBranchList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'ControlPanelSettingMasters/BranchMaster').toPromise();
    return response;
  }
  /** settings get Division list api*/
  async getDivisionList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'ControlPanelSettingMasters/DivisionMaster').toPromise();
    return response;
  }
  /** settings get Division list api*/
  async getCurrencyRates() {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'ControlPanelSettingMasters/CurrencyRates').toPromise();
    return response;
  }
  /** settings get Division list api*/
  async getSalesmanList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'ControlPanelSettingMasters/Salesman').toPromise();
    return response;
  }
  /** settings get Division list api*/
  async getRoleMasterList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'ControlPanelSettingMasters/RoleMasters').toPromise();
    return response;
  }
  /** settings get Division list api */
  async getBehavioralSegmentationChampions(param: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'SignumReport/BehavioralSegmentation/Champions', param).toPromise();
    return response;
  }
  /** pupouse: filtertab ControlPanelSettings  GeneralMaster api */
  async getGeneralMasterSettings(param: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'ControlPanelSettingMasters/GeneralMaster', param).toPromise();
    return response;
  }
  /** settings get Division list api*/
  async getUserBranchesList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'UserBranches/getUserBranchesList').toPromise();
    return response;
  }
  /** settings get FilterSubCollection list api*/
  async getSubCollectionList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'Filter/FilterSubCollection').toPromise();
    return response;
  }
  /** settings get FilterDesign List api*/
  async getFilterDesignList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'Filter/FilterDesignCode').toPromise();
    return response;
  }
  /** settings get FilterSubCollection list api*/
  async getFilterSettingList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'Filter/FilterSetting').toPromise();
    return response;
  }
  /** settings getFilterStoneTypeLock List api*/
  async getFilterStoneTypeLockList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'Filter/FilterStoneTypeLock').toPromise();
    return response;
  }
  /** settings getFilterShape List api*/
  async getFilterShapeList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'Filter/FilterShape').toPromise();
    return response;
  }
  /** settings  get Filter Fluor List  api*/
  async getFilterFluorList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'Filter/FilterFluor').toPromise();
    return response;
  }
  /** purpose: filtertab ControlPanelSettings  GeneralMaster api */
  async KPIEvolutionSalesDetail(param: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'SignumReport/KPIEvolution/KPIEvolutionSalesDetail', param).toPromise();
    return response;
  }
  /** get api for branch preformance branch key metrics */
  async getBranchKeyMatricsAllData(param: any) {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'SignumReport/BranchPerformance/BranchKeyMetricsOverallVisual/' + param).toPromise();
    return response;
  }
  /** get api for branch preformance branch key metrics */
  async getOverallBranchAnalysis(param: any) {
    const response = await this.http.get(environment.api_SignumApiPath_url + 'SignumReport/BranchPerformance/OverallBranchAnalysisCMvsSMVisual/' + param).toPromise();
    return response;
  }
  /** get api for branch preformance branch key metrics */
  async getBranchComparisonData(branch: any,fromdate:any,todate:any) {
    const response = await this.http.get(environment.api_SignumApiPath_url + `SignumReport/BranchPerformance/BranchComparison/getRPTBranchComparison/${fromdate}/${todate}/${branch}`).toPromise();
    return response;
  }
  
  //ADMIN settings API s
  /**  API get MenuMaster  */
  async getMenuMasterList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + `AdminMainMenuMaster/getMenuMasterList`).toPromise();
    return response;
  }
  /** ADMIN API for insert MenuMaster */
  async insertMainMenuMaster(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'AdminMainMenuMaster/insertMainMenuMaster', postData).toPromise();
    return response;
  }
  /** ADMIN get API delete MenuMaster  */
  async deleteMainMenuMaster(param:any) {
    const response = await this.http.delete(environment.api_SignumApiPath_url + `AdminMainMenuMaster/deleteMainMenuMaster/${param}`).toPromise();
    return response;
  }
  /** ADMIN get API update MenuMaster  */
  async updateMainMenuMaster(param:any) {
    const response = await this.http.put(environment.api_SignumApiPath_url + `AdminMainMenuMaster/updateMainMenuMaster/`,param).toPromise();
    return response;
  }
  //SubMenuMaster starts
  /** get API get SubMenuMasterList */
  async getSubMenuMasterList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + `AdminSubMenuMaster/getSubMenuMasterList`).toPromise();
    return response;
  }
  /**API for insert sub menu */
  async insertSubMenuMaster(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'AdminSubMenuMaster/insertSubMenuMaster', postData).toPromise();
    return response;
  }
  /**API for update SubMenuMaster */
  async updateSubMenuMaster(param: any) {
    const response = await this.http.put(environment.api_SignumApiPath_url + 'AdminSubMenuMaster/updateSubMenuMaster', param).toPromise();
    return response;
  }
  /**API for update SubMenuMaster */
  async deleteSubMenuMaster(param: any) {
    const response = await this.http.delete(environment.api_SignumApiPath_url + 'AdminSubMenuMaster/updateSubMenuMaster/'+param).toPromise();
    return response;
  }

  /** get API for getGroupMasterList */
  async getGroupMasterList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + `AdminGroupMaster/getGroupMasterList`).toPromise();
    return response;
  }
  /**api for insertGroupMaster */
  async insertGroupMaster(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'AdminGroupMaster/insertGroupMaster', postData).toPromise();
    return response;
  }
  /**api deleteGroupMaster */
  async deleteGroupMaster(postData: any) {
    const response = await this.http.delete(environment.api_SignumApiPath_url + 'AdminGroupMaster/deleteGroupMaster/'+ postData).toPromise();
    return response;
  }
  /**api updateGroupMaster */
  async updateGroupMaster(postData: any) {
    const response = await this.http.put(environment.api_SignumApiPath_url + 'AdminGroupMaster/updateGroupMaster/', postData).toPromise();
    return response;
  }

  /** get api for getUserMasterList */
  async getUserMasterList() {
    const response = await this.http.get(environment.api_SignumApiPath_url + `AdminUserMaster/getUserMasterList`).toPromise();
    return response;
  }
  /**api for insertUserMaster */
   async insertUserMaster(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'AdminUserMaster/insertUserMaster', postData).toPromise();
    return response;
  }
  /**api for updateUserMaster */
   async updateUserMaster(postData: any) {
    const response = await this.http.put(environment.api_SignumApiPath_url + 'AdminUserMaster/updateUserMaster', postData).toPromise();
    return response;
  }
  async deleteUserMaster(postData: any) {
    const response = await this.http.delete(environment.api_SignumApiPath_url + 'AdminUserMaster/deleteUserMaster/'+ postData).toPromise();
    return response;
  }

   /**api for insert UserBranch */
   async insertUserBranch(postData: any) {
    const response = await this.http.post(environment.api_SignumApiPath_url + 'UserBranches/insertUserBranch', postData).toPromise();
    return response;
  }
   /**api for  update UserBranch */
   async updateUserBranch(postData: any) {
    const response = await this.http.put(environment.api_SignumApiPath_url + 'UserBranches/updateUserBranch', postData).toPromise();
    return response;
  }
  async deleteUserBranch(postData: any,branches:any) {
    const response = await this.http.delete(environment.api_SignumApiPath_url + `UserBranches/deleteUserBranch/${postData}/${branches}`).toPromise();
    return response;
  }
}
