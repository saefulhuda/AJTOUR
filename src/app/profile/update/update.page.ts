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
  passconf: any;
  passStatus: any;
  phone: any;
  email: any;
  constructor(private route: Router, private req: HttpRequestService, private storage: Storage, private app: AppServiceService) {
    this.session = [];
    this.storage.get('session').then(data => {
      if (data == undefined) {
        this.route.navigate(['auth']);
      } else {
        this.session = data;
        this.ngOnInit();
      }
    });
    this.passStatus = 0;
  }

  ngOnInit() {
    // console.log(this.session);
    this.profile = this.session;
  }

  checkPassConf() {
    if (this.password != this.passconf) {
      this.app.showAlert('', 'Konfirmasi Password Tidak Sesuai', 'Pastikan konfirmasi sesuai dengan password baru anda');
      this.passStatus = 2;
    }
  }

  doUpdate() {
    if (this.passStatus == 0 || this.passStatus == 1) {
      let param = [{ api_key: '414414' }, { request: JSON.stringify({ user_id: this.session.id, phone: this.phone, password: this.password, name: this.name }) }]
      this.req.postRequest('auth/update_user_profile', param).subscribe(data => {
        console.log(data);
      });
      this.route.navigate(['/live/profile']);
    } else {
      this.app.showToast('Ada yang salah', 2000, 'top');
    }
  }

  alertPassword() {
    this.app.showAlert('', 'Notice : ', 'Silahkan isi kolom password jika ingin merubah password, jika masih nyaman dengan password lama biarkan kolom password tetap kosong');
    this.passStatus = 1;
  }

  alertPhone() {
    this.app.showAlert('', 'Notice : ', 'Nomor telpon biasa dipakai teman untuk menghubungi anda, pastikan nomor terisi dengan benar')
  }

  back() {
    this.route.navigate(['/live/profile']);
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
