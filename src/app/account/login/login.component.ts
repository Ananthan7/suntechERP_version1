import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from 'src/app/core/services/language.service';

import { LAYOUT_MODE } from '../../layouts/layouts.model';
import { EventService } from 'src/app/core/services/event.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { IndexedApiService } from 'src/app/services/indexed-api.service';
import { IndexedDbService } from 'src/app/services/indexed-db.service';
import { CommonServiceService } from 'src/app/services/common-service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {
  public snackBarRef: any;
  public all_branch: any;
  public all_year: any;
  public user_name: any;
  public validateState = 0;
  public dataForm: FormGroup;
  public userDetails: any[] = [];

  options: string[] = [''];
  filteredOptions: Observable<string[]> | undefined;

  options_year: string[] = [''];
  filteredOptions_year: Observable<string[]> | undefined;
  private subscriptions: Subscription[] = [];
  currentIndex = 0;
  slideIndex = 1;


  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    public dataService: SuntechAPIService,
    private comService: CommonServiceService,
    private renderer: Renderer2

  ) {
    let isLayoutRTL = false;
    this.changeRtlLayout(isLayoutRTL);
    let map = new Map();

    this.dataForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      branch: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required),
      keepLog: new FormControl('',)
    });



  }
  ngAfterViewInit() {


    // this.getCompanyParameter()
    // this.getMessageBox()
  }
  /**use: to get all parameters before login, from indexedDb */
  // private setIndexedDB(): void{
  //     let sub: Subscription = this.indexedDb.getAllData('compparams').subscribe((data) => {
  //       if (data.length > 0) {
  //         this.indexedApiService.setInitailLoadSetUp()
  //       } 
  //     });
  //     this.subscriptions.push(sub)
  // }

  private changeRtlLayout(flag: any): void {
    // if (flag) {
    //   document.querySelector('body').classList.add('gradient-rtl');
    // } else {
    //   document.querySelector('body').classList.remove('gradient-rtl');
    // }
  }
  ngOnInit() {
    
    this.comService.formControlSetReadOnly('password', true);
    this.comService.formControlSetReadOnly('branch', true);
    this.comService.formControlSetReadOnly('year', true);
    
    const keepLog = localStorage.getItem('keepLog') === 'true';
    this.dataForm.controls.keepLog.setValue(keepLog) ;
    if (keepLog == true) {
      this.setGetUserAuthDetails();
    }

    this.showSlides(this.slideIndex);
  }

  changeKeepLog(e: any){

    // if(e.target.checked){
    //   this.setGetUserAuthDetails('add');
    // }else{
    //   localStorage.setItem('keepLog',  'false');
    //   localStorage.setItem('password',  '');
    // }

  }
  setGetUserAuthDetails(type?: any) {
    if (type == null) {
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');
  
      this.dataForm.controls.username.setValue(username);
      this.dataForm.controls.password.setValue(password);

      this.user_name = username;
      this.comService.formControlSetReadOnly('password', false);
      this.validateState = 2;
      this.renderer.selectRootElement('#password')?.focus();


    } else {
      localStorage.setItem('keepLog',  'true');
      localStorage.setItem('username',  this.dataForm.value.username);
      localStorage.setItem('password',  this.dataForm.value.password);
    }

  }
  plusSlides(n: number) {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n: number) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n: number) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { this.slideIndex = 1; }
    if (n < 1) { this.slideIndex = slides.length; }
    for (i = 0; i < slides.length; i++) {
      (slides[i] as HTMLElement).style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    (slides[this.slideIndex - 1] as HTMLElement).style.display = "block";
    dots[this.slideIndex - 1].className += " active";
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filteryear(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options_year.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  changeTextUpperCase(event: any) {
    event.target.value = event.target.value.toString().toUpperCase();
    this.user_name = event.target.value;
  }
  /**use: to check username */
  checkUserName(event: any) {
    if (this.user_name != '') {
      this.snackBarRef = this.snackBar.open('Validating Username ...');
      let API = 'UserDetailNetMaster/' + this.user_name
      let sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((resp: any) => {
        if (resp.status == 'Success') {

          this.comService.formControlSetReadOnly('password', false);
          this.renderer.selectRootElement('#password')?.focus();

          this.userDetails = resp.response
          // localStorage.setItem('userRole', resp['response']['GROUP_NAME']);
          // localStorage.setItem('userLang', resp['response']['USER_LANGUAGE']);
          this.validateState = 1;
        } else {
          this.comService.formControlSetReadOnly('password', true);
          this.renderer.selectRootElement('#username')?.focus();

        }
        this.snackBar.dismiss();
      });
      //to unsubscribe
      this.subscriptions.push(sub)
    }
  }
  // use: to check username and password from API
  checkUserNamePassword(event: any) {
    let password = event.target.value;

    // if (this.validateState == 1 ) {
      if (password != '') {

        this.snackBarRef = this.snackBar.open(
          'Validating Username & Password ...'
        );
        /* ****** vb ****** */
        let API = 'ValidatePassword?strusername=' + this.user_name + '&strPassword=' + password
        let sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((resp: any) => {
          if (resp.status == 'Success') {

            this.renderer.selectRootElement('#branch')?.focus();

            this.snackBar.open('loading...');
            let API2 = 'UseBranchNetMaster/' + this.user_name + ''
            let sub2: Subscription = this.dataService.getDynamicAPI(API2).subscribe((resp) => {
              if (resp.status == 'Success') {
                this.snackBar.dismiss();

                this.comService.formControlSetReadOnly('branch', false);

                this.all_branch = resp.response;
                var data = this.all_branch.map((item: any) => item.BRANCH_CODE);

                this.options = data;
                this.dataForm.controls.branch.setValue(data[0]);
                this.filteredOptions =
                  this.dataForm.controls.branch.valueChanges.pipe(
                    startWith(''),
                    map((value) => this._filter(value))
                  );
              } else {
                this.comService.formControlSetReadOnly('branch', true);

              }

            });
            this.subscriptions.push(sub2)
            this.validateState = 2;
            this.snackBar.dismiss();
          } else {
            
            this.snackBar.dismiss();
            
            this.snackBar.open(
              'Invalid User Credentials! Check Username & Password.',
              'OK',
              {
                duration: 5000,
              }
              );

              this.validateState = 1;
              this.renderer.selectRootElement('#password')?.focus();

            this.filteredOptions = undefined;
          }
        });
        //to unsubscribe
        this.subscriptions.push(sub)
      }
    // } else {
    //   this.snackBar.open('Enter Valid UserName', '', {
    //     duration: 2000,
    //   });
    // }
  }
  validateYear(event: any) {
    if (event.target.value == '') {
      this.renderer.selectRootElement('#year')?.focus();
    }
    let yearSelected = this.options_year.filter((item: any) => item == event.target.value)
    if (yearSelected.length == 0) {
      this.dataForm.controls.year.setValue('')
    }
  }
  changeBranchText(e: any) {
    e.target.value = e.target.value.toString().toUpperCase();
    this.dataForm.controls.branch.setValue(e.target.value);
  }
  /**USE: branch change function to call financial year API */
  changeBranch(e: any) {
    if (e.target.value == '' && 
    this.validateState != 1
    ) {

      this.renderer.selectRootElement('#branch')?.focus();

      return;
    }
    let optionsSelected = this.options.filter((item: any) => item == (e.target.value).toUpperCase())
    if (optionsSelected.length == 0) {
      this.dataForm.controls.branch.setValue('')
      return
    }
    let selectedBranch = this.dataForm.value.branch;
    if (selectedBranch != '') {

      this.snackBar.open('loading...');
      let API = `FinancialYear?branchcode=${selectedBranch}&strusername=${this.user_name}`
      let sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((resp) => {

        if (resp.status == 'Success') {
          this.snackBar.dismiss();
          this.comService.formControlSetReadOnly('year', false);
          this.renderer.selectRootElement('#year')?.focus();

          this.all_year = resp.response;
          this.options_year = this.all_year.map((item: any) => item.fyearcode);

          this.dataForm.controls.year.setValue(this.options_year[0]);

          this.filteredOptions_year =
            this.dataForm.controls.year.valueChanges.pipe(
              startWith(''),
              map((value) => this._filteryear(value))
            );

        } else {
          this.comService.formControlSetReadOnly('year', true);
          this.renderer.selectRootElement('#branch')?.focus();

        }
      });
      //to unsubscribe
      this.subscriptions.push(sub)
    }

  }
  /**USE: sign in with API branchmaster */
  signin() {
    let branch = this.dataForm.value.branch;
    let year = this.dataForm.value.year;

    if (branch != '' && this.validateState == 2 && year != '') {

      if(this.dataForm.value.keepLog)      {
        this.setGetUserAuthDetails('add');
      }else{
        localStorage.setItem('keepLog',  'false');
        localStorage.setItem('password',  '');
      }


      let API = 'BranchMaster/' + branch
      let sub: Subscription = this.dataService.getDynamicAPI(API)
        .subscribe((resp: any) => {
          //to unsubscribe
          this.subscriptions.push(sub)
          this.unsubscribeAll();
          if (resp.status == 'Success') {
            console.log('fired1');

            // if (resp.status == 'Success') {
            this.validateState = 3;
            localStorage.setItem('USER_PARAMETER', JSON.stringify(this.userDetails));
            localStorage.setItem('BRANCH_PARAMETER', JSON.stringify(resp.response));
            // this.comFunc.allbranchMaster = resp.response;
            // localStorage.setItem('currentUser', JSON.stringify(this.userDetails));
            localStorage.setItem('username', this.user_name);
            localStorage.setItem('userbranch', branch);
            localStorage.setItem('YEAR', year);
            console.log('fired2');

            // this.getBranchCurrencyMaster();
            // this.router.navigate(['/']);
            setTimeout(() => {
              window.location.href = '/';
            }, 500);
          }
          this.snackBar.dismiss();
        }, (err) => {
          //to unsubscribe
          this.subscriptions.push(sub)
          this.unsubscribeAll();
          alert('Server error ')
        });

    } else {
      this.snackBar.open('Invalid Credentials', '', {
        duration: 2000,
      });
    }
  }

  ngOnDestroy() {
  }

  private unsubscribeAll() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the array
  }

  // getBranchCurrencyMaster() {
  //   //alert("test");
  //   let branch = localStorage.getItem('userbranch')
  //   let API = `BranchCurrencyMaster/GetBranchCurrencyMasterDetail/${branch}`
  //   this.dataService.getDynamicAPI(API)
  //     .subscribe((data: any) => {
  //       // this.comFunc.allBranchCurrency = data.response;
  //       // this.comFunc.allBranchCurrency = data.response;
  //     });
  // }
}