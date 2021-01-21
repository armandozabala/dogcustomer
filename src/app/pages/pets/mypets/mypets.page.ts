import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController, LoadingController, ModalController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { DEFAULT_AVATAR } from 'src/app/services/constants';
import { PetsService } from 'src/app/services/pets.service';

@Component({
  selector: 'app-mypets',
  templateUrl: './mypets.page.html',
  styleUrls: ['./mypets.page.scss'],
})
export class MypetsPage implements OnInit {

  pets:any = {
    photoURL:  DEFAULT_AVATAR
  }
  user:any;
  petsList:any;
    // loading object
    loading: any;
  
  constructor(
    private storage: AngularFireStorage,
    private petsService: PetsService,
    public router: Router,
    public toastCtrl: ToastController,
    public authService: AuthService,
    public modalController: ModalController,
    public loadingCtrl: LoadingController ) { 

      this.getData();
     
    }

  ngOnInit() {
    
  
  }


  async getData() {
    this.user  = await this.authService.getUserData();
    this.getPets();
    /*this.authService
      .getUser(loggedInUser.uid)
      .pipe(take(1))
      .subscribe((snapshot: any) => {
        snapshot.uid = loggedInUser.uid;
        this.user = snapshot;
        console.log(this.user);
        this.getPets();
      });*/
  }


  async getPets(){

    await this.showLoading();
  
     this.petsService.getPetsCustomer(this.user.uid).subscribe( (res:any) => {

          this.petsList = res;

          this.hideLoading();

     });
  }

  getPet(pet){

    let navigationExtras: NavigationExtras = {
      queryParams: {
          id: pet.petId,
          pets: pet
      }
  };
   // this.router.navigate(['update'], navigationExtras);
    
    this.dismiss(pet);

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


  dismiss(pet:any) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
       pet
    });
  }
}
