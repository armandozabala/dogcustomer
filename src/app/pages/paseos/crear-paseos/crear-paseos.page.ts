import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { PlaceService } from 'src/app/services/place.service';
import { TripService } from 'src/app/services/trip.service';
import { HomePage } from '../../home/home.page';
import { MapPage } from '../../map/map.page';
import { MypetsPage } from '../../pets/mypets/mypets.page';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { SettingService } from 'src/app/services/setting.service';
import { take } from 'rxjs/operators';
import { POSITION_INTERVAL, SHOW_VEHICLES_WITHIN, VEHICLE_LAST_ACTIVE_LIMIT } from 'src/app/services/constants';
import { DriverService } from 'src/app/services/driver.service';
declare var google: any;
@Component({
  selector: "app-crear-paseos",
  templateUrl: "./crear-paseos.page.html",
  styleUrls: ["./crear-paseos.page.scss"],
})
export class CrearPaseosPage implements OnInit {
  pet: any;
  address: any = {
    address: "Address",
    lat: "",
    lng: "",
  };
  // user tracking interval
  driverTracking: any;
  opc: any = "hoy";

  data: any = {
    address: "Address",
  };

  origin: any;

  activeDrivers: any;

  map: any;
  // current vehicle type
  currentVehicle: any;
  // current locality
  locality: any;
  vehicles: any = [];
  // currency
  currency: string;
  // loading object
  loading: any;
  // list of user markers on the map
  driverMarkers: Array<any> = [];

  constructor(
    public driverService: DriverService,
    private geolocation: Geolocation,
    public settingService: SettingService,
    public placeService: PlaceService,
    public route: ActivatedRoute,
    public tripService: TripService,
    public loadingCtrl: LoadingController,
    private router: Router,
    public chRef: ChangeDetectorRef,
    public modalController: ModalController
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.loadMap();

      console.log(" US = " + params["userId"]);
    });
  }

  async openPets() {
    const modal = await this.modalController.create({
      component: MypetsPage,
      cssClass: "my-custom-class",
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.pet = data.pet;
    console.log(data);
  }

  getOpc(event) {
    this.opc = event.detail.value;
    console.log(event.detail.value);
  }

  async openLocation() {
    const modal = await this.modalController.create({
      component: MapPage,
      cssClass: "my-custom-class",
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.address = data;
    this.data.address = this.address.address;
    console.log(this.address);
  }

  async loadMap() {
    await this.showLoading();

    // set current location as map center
    try {
      const resp: any = await this.geolocation.getCurrentPosition();
      const latLng = new google.maps.LatLng(
        resp.coords.latitude,
        resp.coords.longitude
      );

      /*this.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        zoomControl: false,
      });*/

      // get center's address
      this.findPlace(latLng);

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ latLng: latLng }, (results, status) => {
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
            this.hideLoading();
            this.trackDrivers();
          });
        }
      });

      /*this.map.addListener("center_changed", (event) => {
        const center = this.map.getCenter();
        this.findPlace(center);
      });*/
    } catch (e) {
      console.log("Error getting location", e);
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
        actions.forEach((action: any) => {
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
            console.log("This vehicle is too far");
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

  // find address by LatLng
  findPlace(latLng) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ latLng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.data.address = results[0].formatted_address;
        this.chRef.detectChanges();
      }
    });
  }

  solicitarPaseo() {
    this.data.userId = this.pet.userId;
    this.data.petId = this.pet.petId;
    this.data.latitude = this.address.lat;
    this.data.longitude = this.address.lng;

    console.log(this.data);
    console.log(this.activeDrivers);

    this.tripService.setAvailableDrivers(this.activeDrivers);
    this.tripService.setPets(this.data.petId);
    /*this.tripService.setDistance(this.distance);
    this.tripService.setFee(this.currentVehicle.fee);*/
    //this.tripService.setIcon(this.currentVehicle.icon);
    ///this.tripService.setNote(this.note);

    this.router.navigateByUrl("/finding");
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Please get your address...",
    });
    await this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
  }
}
