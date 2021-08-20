import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetResetComponent } from './forget-reset.component';

describe('ForgetResetComponent', () => {
  let component: ForgetResetComponent;
  let fixture: ComponentFixture<ForgetResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgetResetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
