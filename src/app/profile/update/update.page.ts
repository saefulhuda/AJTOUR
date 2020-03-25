import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/http-request.service';
import { Storage } from '@ionic/storage';
import { AppServiceService } from 'src/app/app-service.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  session: any;
  profile = [];
  name: any;
  password: any;
  phone: any;
  email: any;
  constructor(private route: Router, private req: HttpRequestService, private storage: Storage, private app: AppServiceService) {
    this.session = []; 
    this.storage.get('session').then(data => {
      if (data==undefined) {
        this.route.navigate(['auth']);
      } else {
        this.session = data;
        this.ngOnInit();
      }
    });
   }

  ngOnInit() {
    // console.log(this.session);
    this.profile = this.session;
  }

  doUpdate() {
    let param = [{api_key:'414414'}, {request:JSON.stringify({email:this.email, phone:this.phone, password:this.password, name: this.name})}]
    this.req.postRequest('auth/update_user_profile', param).subscribe(data => {
      console.log(data);
    });
    this.route.navigate(['/live/profile']);
  }

  alertPassword() {
    this.app.showAlert('', 'Notice : ', 'Silahkan isi kolom password jika ingin merubah password, jika masih nyaman dengan password lama biarkan kolom password tetap kosong');
  }

  alertPhone() {
    this.app.showAlert('', 'Notice : ', 'Nomor telpon biasa dipakai teman untuk menghubungi anda, pastikan nomor terisi dengan benar')
  }

  back() {
    this.route.navigate(['/live/profile']);
  }

}
