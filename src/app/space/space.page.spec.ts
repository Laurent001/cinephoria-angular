import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpacePage } from './space.page';

describe('SpacePage', () => {
  let component: SpacePage;
  let fixture: ComponentFixture<SpacePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SpacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
