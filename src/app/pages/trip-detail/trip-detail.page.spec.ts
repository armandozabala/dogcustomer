import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TripDetailPage } from './trip-detail.page';

describe('TripDetailPage', () => {
  let component: TripDetailPage;
  let fixture: ComponentFixture<TripDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TripDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
