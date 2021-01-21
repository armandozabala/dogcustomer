import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, ModalController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { POSITION_INTERVAL, SHOW_VEHICLES_WITHIN, VEHICLE_LAST_ACTIVE_LIMIT } from 'src/app/services/constants';
import { DriverService } from 'src/app/services/driver.service';
import { PlaceService } from 'src/app/services/place.service';
import { SettingService } from 'src/app/services/setting.service';
import { TripService } from 'src/app/services/trip.service';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map: any;

  // active drivers list
  activeDrivers: Array<any> = [];
  // pin address
  address: any;

    // user tracking interval
    driverTracking: any;
  // marker position on screen
  markerFromTop = 0;
  markerFromLeft = 0;

    // origin and destination
    origin: any;
    destination: any;

  // current vehicle type
  currentVehicle: any;
    vehicles: any = [];
    
      // currency
  currency: string;

  // current locality
  locality: any;
  // list of user markers on the map
  driverMarkers: Array<any> = [];

  constructor(
    public router: Router,
    private geolocation: Geolocation,
    public chRef: ChangeDetectorRef,
    public placeService: PlaceService,
    public tripService: TripService,
    public activatedRoute: ActivatedRoute,
    public modalController: ModalController,
    public loadingCtrl: LoadingController,
    public settingService: SettingService,
    public driverService: DriverService
  ) {
  }

  ngOnInit() {
  }

  // Load map only after view is initialized
  ionViewDidEnter() {
    this.origin = this.tripService.getOrigin();
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


      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ latLng: this.map.getCenter() }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (!this.origin) {
            // set map center as origin
            this.origin = this.placeService.formatAddress(results[0]);
            this.tripService.setOrigin(
              this.origin.vicinity,
              this.origin.location.lat,
              this.origin.location.lng
            );
            //this.setOrigin();
            this.chRef.detectChanges();
          } else {
           // this.setOrigin();
          }

          // save locality
          const locality = this.placeService.setLocalityFromGeocoder(results);
          console.log("locality", locality);
          // load list vehicles
          this.settingService.getPrices().subscribe((snapshot: any) => {
            const obj = snapshot[locality]
              ? snapshot[locality]
              : snapshot.default;
            this.currency = obj.currency;
            this.tripService.setCurrency(this.currency);

            // calculate price
            this.vehicles = [];
            

            console.log(obj.vehicles);

            Object.keys(obj.vehicles).forEach((id) => {
              obj.vehicles[id].id = id;
              this.vehicles.push(obj.vehicles[id]);
            });

            // google map direction service
            /*if (this.destination) {
              directionService.route(
                {
                  origin: new google.maps.LatLng(
                    this.origin.location.lat,
                    this.origin.location.lng
                  ),
                  destination: new google.maps.LatLng(
                    this.destination.location.lat,
                    this.destination.location.lng
                  ),
                  travelMode: "DRIVING",
                },
                (result) => {
                  this.distance = result.routes[0].legs[0].distance.value;

                  for (const vehicle of this.vehicles) {
                    vehicle.fee = (this.distance * vehicle.price) / 1000;
                    vehicle.fee = vehicle.fee.toFixed(2);
                  }
                }
              );
            }*/

            // set first device as default
            this.vehicles[0].active = true;
            this.currentVehicle = this.vehicles[0];

        
              this.locality = locality;
            this.trackDrivers();
          });
        
        }
      });
      
      


      this.map.addListener('center_changed', (event) => {
        const center = this.map.getCenter();
        this.findPlace(center);
      });
    } catch (e) {
      console.log('Error getting location', e);
    }
  }


    // track drivers
    trackDrivers() {
      this.showDriverOnMap(this.locality);
      clearInterval(this.driverTracking);
  
      this.driverTracking = setInterval(() => {
        this.showDriverOnMap(this.locality);
      }, POSITION_INTERVAL);
    }

     // show drivers on map
  showDriverOnMap(locality) {
    // get active drivers
    
    this.driverService
      .getActiveDriver(locality, this.currentVehicle.id)
      .pipe(take(1))
      .subscribe((actions) => {
        // console.log('Refresh vehicles', snapshot);

        // clear vehicles
        this.clearDrivers();
        // only show near vehicle
        actions.forEach((action:any) => {
          const vehicle: any = { id: action.key, ...action.payload.val() };

          console.log(vehicle);

          // only show vehicle which has last active < 30 secs & distance < 5km
          const distance = this.placeService.calcCrow(
            vehicle.lat,
            vehicle.lng,
            this.origin.location.lat,
            this.origin.location.lng
          );

          console.log(distance);

          if (
            distance < SHOW_VEHICLES_WITHIN &&
            Date.now() - vehicle.last_active < VEHICLE_LAST_ACTIVE_LIMIT
          ) {
            // create or update
            const latLng = new google.maps.LatLng(vehicle.lat, vehicle.lng);
            const angle = this.driverService.getIconWithAngle(vehicle);

            const marker = new google.maps.Marker({
              map: this.map,
              position: latLng,
              icon: {
                url:
                  "assets/img/icon/" +
                  this.currentVehicle.icon +
                  angle +
                  ".png",
                size: new google.maps.Size(55, 55),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(16, 16),
                scaledSize: new google.maps.Size(32, 32),
              },
            });

            // add vehicle and marker to the list
            vehicle.distance = distance;
            this.driverMarkers.push(marker);
            this.activeDrivers.push(vehicle);
          } else {
             console.log('This vehicle is too far');
          }
        });
      });
  }


    // add origin marker to map
    setOrigin() {
      // add origin and destination marker
      const latLng = new google.maps.LatLng(
        this.origin.location.lat,
        this.origin.location.lng
      );
      // tslint:disable-next-line:no-unused-expression
      new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
        icon: "assets/img/pin.png",
      });
  
      // set map center to origin address
      this.map.setCenter(latLng);
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

    this.dismiss(this.address, this.activeDrivers);
    //this.router.navigateByUrl('/home');
  }


    // clear expired drivers on the map
    clearDrivers() {
      this.activeDrivers = [];
      this.driverMarkers.forEach((vehicle) => {
        vehicle.setMap(null);
      });
    }

  dismiss(address:any, activeDrivers:any) {
    
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
       activeDrivers: activeDrivers,
       address: address.formatted_address,
       lat: this.address.geometry.location.lat(),
       lng: this.address.geometry.location.lng()
    });
  }
}
