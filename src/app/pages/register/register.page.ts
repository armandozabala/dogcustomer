import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AlertController, LoadingController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  email: any;
  password: any;
  name: any;
  phoneNumber: any;

  constructor(
    public router: Router,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  // process signup button
  async signup() {
    // require email, password, name
    if (!this.email || !this.password || !this.name || !this.phoneNumber) {
      const alert = await this.alertCtrl.create({
        message: "Please provide email, name, phone and password",
        buttons: ["OK"],
      });
      return alert.present();
    }

    const loading = await this.loadingCtrl.create({
      message: "Please wait...",
    });
    await loading.present();

    try {
      this.authService.register(
        this.email,
        this.password,
        this.name,
        this.phoneNumber
      );
      await loading.dismiss();
      this.router.navigateByUrl("/home");
    } catch (error) {
      // in case of login error
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        message: error,
        buttons: ["OK"],
      });
      await alert.present();
    }
  }

  login() {
    this.router.navigateByUrl("/login");
  }
}
