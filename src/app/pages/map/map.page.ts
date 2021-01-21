import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import { PlaceService } from 'src/app/services/place.service';
import { TripService } from 'src/app/services/trip.service';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map: any;

  // pin address
  address: any;

  // marker position on screen
  markerFromTop = 0;
  markerFromLeft = 0;

  constructor(
    public router: Router,
    private geolocation: Geolocation,
    public chRef: ChangeDetectorRef,
    public placeService: PlaceService,
    public tripService: TripService,
    public activatedRoute: ActivatedRoute,
    public modalController: ModalController
  ) {
  }

  ngOnInit() {
  }

  // Load map only after view is initialized
  ionViewDidEnter() {
    this.loadMap();

    // set marker position in center of screen
    // minus marker's size
    this.markerFromTop = window.screen.height / 2 - 16;
    this.markerFromLeft = window.screen.width / 2 - 8;
  }

  async loadMap() {
    // set current location as map center
    try {
      const resp: any = await this.geolocation.getCurrentPosition();
      const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        zoomControl: false,
      });

      // get center's address
      this.findPlace(latLng);

      this.map.addListener('center_changed', (event) => {
        const center = this.map.getCenter();
        this.findPlace(center);
      });
    } catch (e) {
      console.log('Error getting location', e);
    }
  }

  // find address by LatLng
  findPlace(latLng) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({latLng}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.address = results[0];
        this.chRef.detectChanges();
      }
    });
  }

  // choose address and go back to home page
  selectPlace() {
    const address = this.placeService.formatAddress(this.address);

    if (this.activatedRoute.snapshot.paramMap.get('type') === 'origin') {
      this.tripService.setOrigin(address.vicinity, address.location.lat, address.location.lng);
    } else {
      this.tripService.setDestination(address.vicinity, address.location.lat, address.location.lng);
    }

    this.dismiss(this.address);
    //this.router.navigateByUrl('/home');
  }

  dismiss(address:any) {
    
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
       address: address.formatted_address,
       lat: this.address.geometry.location.lat(),
       lng: this.address.geometry.location.lng()
    });
  }
}
