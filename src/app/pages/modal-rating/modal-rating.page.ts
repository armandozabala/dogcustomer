import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { TripService } from "src/app/services/trip.service";


@Component({
  selector: "app-modal-rating",
  templateUrl: "./modal-rating.page.html",
  styleUrls: ["./modal-rating.page.scss"],
})
export class ModalRatingPage implements OnInit {
  // Data passed in by componentProps
  @Input() driver: any;
  @Input() trip: any;

  // rating
  rating = 0;

  constructor(
    public tripService: TripService,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  // call when click to stars
  rate(star) {
    this.rating = star;
  }

  // submit rating
  submit() {
    this.tripService.rateTrip(this.trip.id, this.rating).then(() => {
      this.modalCtrl.dismiss();
    });
  }
}
