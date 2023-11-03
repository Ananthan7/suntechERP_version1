import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-menu-updation',
  templateUrl: './menu-updation.component.html',
  styleUrls: ['./menu-updation.component.scss']
})
export class MenuUpdationComponent implements OnInit {
  subscriptions: Subscription[] = []
  menuMasterForm: FormGroup = this.formBuilder.group({
    strMenuID: ['',[Validators.required]],
    strPathName: ['',[Validators.required]],
    strComponentName: ['',[Validators.required]],
    strFormComponentName: ['',[Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
  ) { }

  ngOnInit(): void {
  }
  //party Code validate
  updateMenu() {
    if (this.menuMasterForm.invalid) {
      this.commonService.showSnackBarMsg('All fields required')
      return
    }
    let postData = {
      "SPID": "029",
      "parameter": {
        "strMenuID": this.menuMasterForm.value.strMenuID?.trim() || '',
        "strPathName": this.menuMasterForm.value.strPathName || '',
        "strComponentName": this.menuMasterForm.value.strComponentName || '',
        "strFormComponentName": this.menuMasterForm.value.strFormComponentName || ''
      }
    }
    this.commonService.showSnackBarMsg('Loading')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        console.log(result);
        
        if (result.status == "Success") {
          let data = result.dynamicData[0]
//       Swal.fire({
    //         title: 'SUCCESS!',
    //         text: 'Registered Successfully!',
    //         icon: 'success',
    //         confirmButtonColor: '#336699',
    //         confirmButtonText: 'Ok'
    //       }).then((result:any)=>{console.log(result);
    //         if(result.value){
    //           this.router.navigate(['/account/login']);
    //         }
    //       });
        } else {
         
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
      })
    this.subscriptions.push(Sub)
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
