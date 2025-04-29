import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamPopupComponent } from './exam-popup.component';

describe('ExamPopupComponent', () => {
  let component: ExamPopupComponent;
  let fixture: ComponentFixture<ExamPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
