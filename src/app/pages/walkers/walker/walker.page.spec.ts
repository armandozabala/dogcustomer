import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalkerPage } from './walker.page';

describe('WalkerPage', () => {
  let component: WalkerPage;
  let fixture: ComponentFixture<WalkerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalkerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalkerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
