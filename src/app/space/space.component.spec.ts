import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpaceComponent } from './space.component';

describe('SpaceComponent', () => {
  let component: SpaceComponent;
  let fixture: ComponentFixture<SpaceComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
