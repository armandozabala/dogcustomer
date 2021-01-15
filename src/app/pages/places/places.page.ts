import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { IonSearchbar, LoadingController } from "@ionic/angular";

import { Geolocation } from "@ionic-native/geolocation/ngx";
import { PlaceService } from "src/app/services/place.service";
import { TripService } from "src/app/services/trip.service";

declare var google: any;

@Component({
  selector: "app-places",
  templateUrl: "./places.page.html",
  styleUrls: ["./places.page.scss"],
})
export class PlacesPage implements OnInit {
  @ViewChild("searchbar", { static: false }) searchbar: IonSearchbar;

  // map id
  mapId = Math.random() + "map";

  // all places
  places: any;

  // search keyword
  keyword = "";

  // lat & lon
  lat;
  lon;

  // loading object
  loading: any;

  // google map place service
  mapService: any;

  constructor(
    public router: Router,
    public placeService: PlaceService,
    public geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public tripService: TripService,
    public activatedRoute: ActivatedRoute,
    public changeRef: ChangeDetectorRef
  ) {
    this.initLoading();
  }

  ngOnInit() {}

  async initLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Please wait...",
    });
  }

  // show search input
  ionViewDidEnter() {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 500);

    this.lat = this.activatedRoute.snapshot.paramMap.get("latitude");
    this.lon = this.activatedRoute.snapshot.paramMap.get("longitude");
    this.loadMap();
    this.search();
  }

  // load google map service
  loadMap() {
    const latLng = new google.maps.LatLng(this.lat, this.lon);
    const map = new google.maps.Map(document.getElementById(this.mapId), {
      center: latLng,
    });
    this.mapService = new google.maps.places.PlacesService(map);
  }

  // choose a place
  selectPlace(place) {
    if (this.activatedRoute.snapshot.paramMap.get("type") === "origin") {
      this.tripService.setOrigin(
        place.vicinity,
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
    } else {
      this.tripService.setDestination(
        place.vicinity,
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
    }

    this.router.navigateByUrl("/home");
  }

  // clear search input
  clear() {
    this.keyword = "";
    this.search();
  }

  // search by address
  search() {
    // this.showLoading();
    this.mapService.nearbySearch(
      {
        location: new google.maps.LatLng(this.lat, this.lon),
        keyword: this.keyword,
        radius: 50000,
      },
      (results) => {
        // this.hideLoading();
        this.places = results;
        this.changeRef.detectChanges();
      }
    );
  }

  // calculate distance from a place to current position
  calcDistance(place) {
    return this.placeService
      .calcCrow(
        place.geometry.location.lat(),
        place.geometry.location.lng(),
        this.lat,
        this.lon
      )
      .toFixed(1);
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

  // open map page
  openMap() {
    this.router.navigate([
      "/map",
      { type: this.activatedRoute.snapshot.paramMap.get("type") },
    ]);
  }
}
