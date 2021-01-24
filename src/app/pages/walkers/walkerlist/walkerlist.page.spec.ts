import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalkerlistPage } from './walkerlist.page';

describe('WalkerlistPage', () => {
  let component: WalkerlistPage;
  let fixture: ComponentFixture<WalkerlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalkerlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalkerlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
