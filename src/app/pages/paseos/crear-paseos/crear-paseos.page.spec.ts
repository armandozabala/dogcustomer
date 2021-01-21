import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CrearPaseosPage } from './crear-paseos.page';

describe('CrearPaseosPage', () => {
  let component: CrearPaseosPage;
  let fixture: ComponentFixture<CrearPaseosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearPaseosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearPaseosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
