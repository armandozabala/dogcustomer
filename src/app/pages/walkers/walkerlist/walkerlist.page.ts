import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { DriverService } from '../../../services/driver.service';

@Component({
  selector: "app-walkerlist",
  templateUrl: "./walkerlist.page.html",
  styleUrls: ["./walkerlist.page.scss"],
})
export class WalkerlistPage implements OnInit {
  walkerList: any;
  loading: any;

  constructor(
    private router: Router,
    private driverService: DriverService,
    public loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    await this.showLoading();
    this.getWalkers();
  }

  async getWalkers() {
    this.driverService.getDrivers().subscribe((res: any) => {
      this.walkerList = res;
      this.hideLoading();
    });
  }

  getCountLikes(list) {
    return Object.keys(list).length;
  }

  getWalker(walk) {

    console.log(walk.userId);

        let navigationExtras: NavigationExtras = {
          queryParams: {
            walkerId: walk.userId,
          },
        };
    
    this.router.navigate(["walker"], navigationExtras);
    

  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Please wait...",
    });
    await this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
  }
}
