import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { DriverService } from 'src/app/services/driver.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: "app-walker",
  templateUrl: "./walker.page.html",
  styleUrls: ["./walker.page.scss"],
})
export class WalkerPage implements OnInit {
  loading: any;
  walk: any;
  user: any;
  heartType = "heart-outline";

  constructor(
    private router: Router,
    private authService: AuthService,
    public driverService: DriverService,
    public route: ActivatedRoute,
    public loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    
    this.user = await this.authService.getUserData();


      

    await this.showLoading();

    this.route.queryParams.subscribe((params) => {
      
      console.log(" WLK = " + params["walkerId"]);

      let id = params["walkerId"];

      this.getDriver(id);
    });
  }

  async getDriver(id) {

    let resp = await this.driverService.getLikes(id, this.user.uid);

    console.log(" RESP ", resp);
    
    this.heartType = resp ? 'heart' : 'heart-outline';
    
    this.driverService.getDriver(id).subscribe((res: any) => {
      
      this.walk = res;
      this.hideLoading();
    });
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

  toggleHeart() {

    let likes = this.walk.likes == undefined ? {} : this.walk.likes;

    if (this.heartType == "heart-outline") {
   
      
      this.heartType = "heart";
       this.driverService.setLike(this.walk.userId, this.user.uid, likes);
    } else {

        this.heartType = "heart-outline";
       this.driverService.unsetLike(this.walk.userId, this.user.uid, likes);
    }
  }
}
