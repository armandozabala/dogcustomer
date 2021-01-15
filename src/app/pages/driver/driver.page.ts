import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { take } from "rxjs/operators";
import { DriverService } from "src/app/services/driver.service";
import { TripService } from "src/app/services/trip.service";

@Component({
  selector: "app-driver",
  templateUrl: "./driver.page.html",
  styleUrls: ["./driver.page.scss"],
})
export class DriverPage implements OnInit {
  driver: any;
  // trip info
  trip: any;
  navTimeout: any;

  constructor(
    public router: Router,
    public driverService: DriverService,
    public tripService: TripService
  ) {
    const tripId = this.tripService.getId();
    // get current trip
    this.tripService
      .getTrip(tripId)
      .pipe(take(1))
      .subscribe((snapshot: any) => {
        this.trip = snapshot;

        // get driver from trip
        this.driverService
          .getDriver(snapshot.driverId)
          .pipe(take(1))
          .subscribe((snap) => {
            this.driver = snap;
          });
      });

    // after 5 seconds, go to trcking page
    this.navTimeout = setTimeout(() => {
      this.router.navigateByUrl("/tracking");
    }, 5000);
  }

  ngOnInit() {}

  ionViewWillLeave() {
    clearTimeout(this.navTimeout);
  }

  // make array with range is n
  range(n) {
    return new Array(Math.round(n));
  }
}
