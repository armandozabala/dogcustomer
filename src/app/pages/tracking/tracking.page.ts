import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Platform, ModalController } from "@ionic/angular";
import { take } from "rxjs/operators";
import { TRIP_STATUS_FINISHED, POSITION_INTERVAL, TRIP_STATUS_GOING } from "src/app/services/constants";
import { DriverService } from "src/app/services/driver.service";
import { PlaceService } from "src/app/services/place.service";
import { TripService } from "src/app/services/trip.service";
import { ModalRatingPage } from "../modal-rating/modal-rating.page";



declare var google: any;

@Component({
  selector: "app-tracking",
  templateUrl: "./tracking.page.html",
  styleUrls: ["./tracking.page.scss"],
})
export class TrackingPage implements OnInit {
  // map height
  mapHeight = 480;
  // user info
  driver: any;
  // map
  map: any;
  // trip info
  trip: any;
  // user tracking interval
  driverTracking: any;
  // user marker on map
  marker: any;
  // trip status
  tripStatus: any;
  // trip subscription
  tripSubscription: any;

  constructor(
    public router: Router,
    public driverService: DriverService,
    public platform: Platform,
    public tripService: TripService,
    public placeService: PlaceService,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    const tripId = this.tripService.getId();
    this.tripService
      .getTrip(tripId)
      .pipe(take(1))
      .subscribe((snapshot: any) => {
        this.trip = snapshot;
        this.trip.id = tripId;

        this.driverService
          .getDriver(snapshot.driverId)
          .pipe(take(1))
          .subscribe((snap) => {
            this.driver = snap;
            this.driver.id = snapshot.driverId;
            this.watchTrip(tripId);
            // init map
            this.loadMap();
          });
      });
  }

  ionViewWillLeave() {
    // this.tripSubscription.unsubscribe();
    clearInterval(this.driverTracking);
  }

  watchTrip(tripId) {
    this.tripSubscription = this.tripService
      .getTrip(tripId)
      .subscribe((snapshot: any) => {
        // console.log(snapshot);
        this.tripStatus = snapshot.status;

        // if trip has been finished

        if (this.tripStatus === TRIP_STATUS_FINISHED) {
          this.tripSubscription.unsubscribe();
          this.showRatingModal();
        }
      });
  }

  async showRatingModal() {
    // console.log(this.trip, this.driver);
    const modal = await this.modalCtrl.create({
      component: ModalRatingPage,
      componentProps: {
        trip: this.trip,
        driver: this.driver,
      },
    });

    await modal.present();
    await modal.onWillDismiss();
    this.router.navigateByUrl("/home");
  }

  loadMap() {
    const latLng = new google.maps.LatLng(
      this.trip.origin.location.lat,
      this.trip.origin.location.lng
    );

    const mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false,
    };

    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // get ion-view height
    const viewHeight = window.screen.height - 44; // minus nav bar
    // get info block height
    const infoHeight = document.getElementsByClassName("tracking-info")[0]
      .scrollHeight;

    this.mapHeight = viewHeight - infoHeight;

    // tslint:disable-next-line:no-unused-expression
    new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon: "assets/img/pin.png",
    });

    this.trackDriver();
  }

  // make array with range is n
  range(n) {
    return new Array(Math.round(n));
  }

  trackDriver() {
    this.showDriverOnMap();

    this.driverTracking = setInterval(() => {
      this.marker.setMap(null);
      this.showDriverOnMap();
    }, POSITION_INTERVAL);
  }

  // show user on map
  showDriverOnMap() {
    // get user's position
    this.driverService
      .getDriverPosition(
        this.placeService.getLocality(),
        this.driver.type,
        this.driver.id
      )
      .pipe(take(1))
      .subscribe((snapshot: any) => {
        // create or update
        const latLng = new google.maps.LatLng(snapshot.lat, snapshot.lng);
        const angle = this.driverService.getIconWithAngle(snapshot);

        if (this.tripStatus === TRIP_STATUS_GOING) {
          this.map.setCenter(latLng);
        }

        // show vehicle to map
        this.marker = new google.maps.Marker({
          map: this.map,
          position: latLng,
          icon: {
            url:
              "assets/img/icon/" + this.tripService.getIcon() + angle + ".png",
            size: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 16),
            scaledSize: new google.maps.Size(32, 32),
          },
        });
      });
  }
}
