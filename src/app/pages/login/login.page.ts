import { Component, OnInit } from "@angular/core";
import { AlertController, LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";


@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  email: any;
  password: any;

  constructor(
    private router: Router,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  async login() {
    // require email and password
    if (!this.email || !this.password) {
      const alert = await this.alertCtrl.create({
        message: "Please provide email and password",
        buttons: ["OK"],
      });
      return alert.present();
    }

    const loading = await this.loadingCtrl.create({
      message: "Please wait...",
    });
    await loading.present();

    try {
      await this.authService.login(this.email, this.password);
      loading.dismiss();
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

  // login with facebook
  /*async loginWithFacebook() {
    try {
      await this.authService.loginWithFacebook();
      this.router.navigateByUrl("/home");
    } catch (e) {
      // in case of login error
      const alert = await this.alertCtrl.create({
        message: e,
        buttons: ["OK"],
      });
      await alert.present();
    }
  }*/

  // login with google
  /*async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigateByUrl("/home");
    } catch (e) {
      // in case of login error
      const alert = await this.alertCtrl.create({
        message: e,
        buttons: ["OK"],
      });
      await alert.present();
    }
  }*/
}
