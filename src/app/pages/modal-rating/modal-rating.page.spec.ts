import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalRatingPage } from './modal-rating.page';

describe('ModalRatingPage', () => {
  let component: ModalRatingPage;
  let fixture: ComponentFixture<ModalRatingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRatingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRatingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
