import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreeningComponent } from './screening.component';

describe('ScreeningComponent', () => {
  let component: ScreeningComponent;
  let fixture: ComponentFixture<ScreeningComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
