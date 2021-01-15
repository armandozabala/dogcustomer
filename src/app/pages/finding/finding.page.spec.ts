import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FindingPage } from './finding.page';

describe('FindingPage', () => {
  let component: FindingPage;
  let fixture: ComponentFixture<FindingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FindingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
