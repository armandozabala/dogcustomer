import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { HomePage } from '../../home/home.page';
import { MapPage } from '../../map/map.page';
import { MypetsPage } from '../../pets/mypets/mypets.page';

@Component({
  selector: 'app-crear-paseos',
  templateUrl: './crear-paseos.page.html',
  styleUrls: ['./crear-paseos.page.scss'],
})
export class CrearPaseosPage implements OnInit {

  pet:any;
  address : any = {
    address: 'Address',
    lat: '',
    lng: ''
  };
  opc:any = "hoy";

  data : any = {
    address: 'Address'
  };

  constructor(public route: ActivatedRoute,
              private router: Router,
              public modalController: ModalController) { }

  async ngOnInit() {

    this.route.queryParams.subscribe(params => {

      console.log(" US = "+params['userId']);

  });



  }



  async openPets(){

    const modal = await this.modalController.create({
      component: MypetsPage,
      cssClass: 'my-custom-class'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.pet = data.pet;
    console.log(data);
    
   
  }

  getOpc(event){
     
    this.opc = event.detail.value;
    console.log(event.detail.value);


  }

  async openLocation(){

    const modal = await this.modalController.create({
      component: MapPage,
      cssClass: 'my-custom-class'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.address = data;
    this.data.address = this.address.address;
    console.log(this.address);

  }

  solicitarPaseo(){

    this.data.userId = this.pet.userId;
    this.data.petId = this.pet.petId;
    this.data.latitude = this.address.lat;
    this.data.longitude = this.address.lng;

    console.log(this.data);

    this.router.navigateByUrl("/finding");

  }

}
