import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CartsPage } from './carts.page';

describe('CartsPage', () => {
  let component: CartsPage;
  let fixture: ComponentFixture<CartsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CartsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
