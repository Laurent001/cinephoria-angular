import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreeningsComponent } from '../screenings/screenings.component';

describe('FilmsComponent', () => {
  let component: ScreeningsComponent;
  let fixture: ComponentFixture<ScreeningsComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreeningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
