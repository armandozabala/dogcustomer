import { Injectable } from "@angular/core";
import { NOTIFICATIONS } from "./mock-notifications";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private notifications: any;

  constructor() {
    this.notifications = NOTIFICATIONS;
  }

  getAll() {
    return this.notifications;
  }

  getItem(id) {
    for (const notification of this.notifications) {
      if (notification.id === parseInt(id, 0)) {
        return notification;
      }
    }

    return null;
  }

  remove(item) {
    this.notifications.splice(this.notifications.indexOf(item), 1);
  }
}
