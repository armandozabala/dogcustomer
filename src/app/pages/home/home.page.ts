import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, LoadingController, ModalController } from "@ionic/angular";
import { Geolocation } from "@ionic-native/geolocation/ngx";


import { take } from "rxjs/operators";
import { POSITION_INTERVAL, SHOW_VEHICLES_WITHIN, VEHICLE_LAST_ACTIVE_LIMIT } from "src/app/services/constants";
import { DriverService } from "src/app/services/driver.service";
import { PlaceService } from "src/app/services/place.service";
import { SettingService } from "src/app/services/setting.service";
import { TripService } from "src/app/services/trip.service";

declare var google: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  // map id
  mapId = Math.random() + "map";

  // map height
  mapHeight = 380;

  // show - hide modal bg
  showModalBg = false;

  // show vehicles flag
  showVehicles = false;

  // list vehicles
  vehicles: any = [];

  // current vehicle type
  currentVehicle: any;

  // Note to user
  note: any = "";

  // Map
  map: any;

  // origin and destination
  origin: any;
  destination: any;

  // loading object
  loading: any;

  // distance between origin and destination
  distance = 0;

  // currency
  currency: string;

  // current locality
  locality: any;

  // payment method
  paymentMethod = "cash";

  // active drivers list
  activeDrivers: Array<any> = [];

  // list of user markers on the map
  driverMarkers: Array<any> = [];

  // user tracking interval
  driverTracking: any;

  // debug content
  deb: string;

  // current lat lng
  currentLatlng: any;

  constructor(
    public router: Router,
    // public platform: Platform,
    public alertCtrl: AlertController,
    public placeService: PlaceService,
    private geolocation: Geolocation,
    private chRef: ChangeDetectorRef,
    public loadingCtrl: LoadingController,
    public settingService: SettingService,
    public tripService: TripService,
    public driverService: DriverService,
    public modalController: ModalController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.origin = this.tripService.getOrigin();
    this.destination = this.tripService.getDestination();

    // on view ready, start loading map
    this.loadMap();
  }

  ionViewWillLeave() {
    // stop tracking driver
    clearInterval(this.driverTracking);
  }

  // get current payment method from service
  getPaymentMethod() {
    this.paymentMethod = this.tripService.getPaymentMethod();
    return this.paymentMethod;
  }

  // toggle active vehicle
  chooseVehicle(index) {
    for (let i = 0; i < this.vehicles.length; i++) {
      this.vehicles[i].active = i === index;

      // choose this vehicle type
      if (i === index) {
        this.tripService.setVehicle(this.vehicles[i]);
        this.currentVehicle = this.vehicles[i];
      }
    }

    // start tracking new driver type
    this.trackDrivers();
    this.toggleVehicles();
  }

  // load map
  async loadMap() {
    await this.showLoading();

    try {
      const options = {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 0,
      };
      const resp = await this.geolocation.getCurrentPosition(options);

      let latLng;
      // const lat = 16.8660694;
      const lat = resp.coords.latitude;
      // const lng = 96.19513200000002;
      const lng = resp.coords.longitude;

      if (this.origin) {
        // set map center as origin
        latLng = new google.maps.LatLng(
          this.origin.location.lat,
          this.origin.location.lng
        );
      } else {
        // set map center as current location
        latLng = new google.maps.LatLng(lat, lng);
      }

      this.currentLatlng = {
        latitude: lat,
        longitude: lng,
      };

      // debug GPS
      // this.deb = latLng.lat() + ',' + latLng.lng();

      this.map = new google.maps.Map(document.getElementById(this.mapId), {
        zoom: 15,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false,
      });

      const directionService = new google.maps.DirectionsService(this.map);

      // get ion-view height, 44 is navbar height
      this.mapHeight = window.screen.height - 44;

      // find map center address
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
            this.setOrigin();
            this.chRef.detectChanges();
          } else {
            this.setOrigin();
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

      // add destination to map
      if (this.destination) {
        // tslint:disable-next-line:no-unused-expression
        new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(
            this.destination.location.lat,
            this.destination.location.lng
          ),
        });
      }

      await this.hideLoading();
    } catch (e) {
      console.log("Error getting location", e);
    }
  }

  // Show note popup when click to 'Notes to user'
  async showNotePopup() {
    const prompt = await this.alertCtrl.create({
      header: "Notes to user",
      message: "",
      inputs: [
        {
          name: "note",
          placeholder: "Note",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: (data) => {
            console.log("Cancel clicked");
          },
        },
        {
          text: "Save",
          handler: (data) => {
            this.note = data;
            this.tripService.setNote(data);
            console.log("Saved clicked");
          },
        },
      ],
    });

    prompt.present();
  }

  // go to next view when the 'Book' button is clicked
  book() {
    // store detail
    this.tripService.setAvailableDrivers(this.activeDrivers);
    /*this.tripService.setDistance(this.distance);
    this.tripService.setFee(this.currentVehicle.fee);*/
    this.tripService.setIcon(this.currentVehicle.icon);
    //this.tripService.setNote(this.note);
    // this.tripService.setPaymentMethod('');

    // go to finding page
    this.router.navigateByUrl("/finding");
  }

  // choose origin place
  chooseOrigin() {
    // go to places page
    this.router.navigate([
      "/places",
      { type: "origin", ...this.currentLatlng },
    ]);
  }

  // choose destination place
  chooseDestination() {
    // go to places page
    this.router.navigate([
      "/places",
      { type: "destination", ...this.currentLatlng },
    ]);
  }

  // choose payment method
  choosePaymentMethod() {
    // go to payment method page
    this.router.navigateByUrl("/payment-method");
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

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Please wait...",
    });
    await this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
  }

  // show or hide vehicles
  toggleVehicles() {
    this.showVehicles = !this.showVehicles;
    this.showModalBg = this.showVehicles === true;
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
            // console.log('This vehicle is too far');
          }
        });
      });
  }

  // clear expired drivers on the map
  clearDrivers() {
    this.activeDrivers = [];
    this.driverMarkers.forEach((vehicle) => {
      vehicle.setMap(null);
    });
  }

  dismiss(pet:any) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
       pet,
       
    });
  }
}
