import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MypetsPage } from './mypets.page';

describe('MypetsPage', () => {
  let component: MypetsPage;
  let fixture: ComponentFixture<MypetsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MypetsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MypetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
