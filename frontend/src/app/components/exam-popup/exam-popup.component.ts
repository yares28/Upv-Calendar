import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Exam, ExamPopupPosition } from '../../types/exam.types';

@Component({
  selector: 'app-exam-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exam-popup-overlay" *ngIf="show" (click)="onOverlayClick($event)">
      <div 
        class="exam-popup" 
        [style.top]="position?.top" 
        [style.left]="position?.left"
        [style.transform-origin]="position?.transformOrigin"
        [@popupAnimation]="show"
      >
        <div class="popup-connector" *ngIf="shouldShowConnector"
             [style.top]="connectorPosition.top"
             [style.left]="connectorPosition.left">
        </div>
        <div class="popup-header">
          <h3>{{ date | date:'EEEE, MMMM d, y' }}</h3>
          <button class="close-btn" (click)="close.emit()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="popup-content">
          <div class="no-exams" *ngIf="exams.length === 0">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>No exams scheduled for this date.</p>
          </div>

          <div class="exam-list" *ngIf="exams.length > 0">
            <div class="exam-card" *ngFor="let exam of exams">
              <div class="exam-header">
                <h4>{{ exam.name }}</h4>
                <span class="time-badge">{{ exam.time }}</span>
              </div>

              <div class="exam-info">
                <div class="info-row">
                  <span class="info-label">Course</span>
                  <span class="info-value">{{ exam.course }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Subject</span>
                  <span class="info-value">{{ exam.subject }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Location</span>
                  <span class="info-value">{{ exam.location }}</span>
                </div>
                <div class="info-row" *ngIf="exam.notes">
                  <span class="info-label">Notes</span>
                  <span class="info-value notes">{{ exam.notes }}</span>
                </div>
              </div>

              <div class="exam-actions">
                <button class="action-btn add-calendar" (click)="onAddToCalendar(exam)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <line x1="12" y1="14" x2="12" y2="18"></line>
                    <line x1="10" y1="16" x2="14" y2="16"></line>
                  </svg>
                  Add to Calendar
                </button>
                <button class="action-btn share" (click)="onShare(exam)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .exam-popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .exam-popup {
      position: absolute;
      width: 320px;
      max-width: 90vw;
      max-height: 90vh;
      background: var(--surface-1);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      z-index: 1001;
    }

    .popup-connector {
      position: absolute;
      width: 16px;
      height: 16px;
      background-color: var(--primary);
      transform: rotate(45deg);
      z-index: 0;
    }

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: var(--primary);
      color: white;
      position: relative;
      z-index: 2;
    }

    .popup-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      padding: 4px;
      cursor: pointer;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .close-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .popup-content {
      padding: 20px;
      max-height: calc(90vh - 64px);
      overflow-y: auto;
      position: relative;
      z-index: 2;
    }

    .no-exams {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px;
      text-align: center;
      color: var(--text);
      opacity: 0.7;
    }

    .exam-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .exam-card {
      background: var(--surface-2);
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .exam-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .exam-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--surface-3);
    }

    .exam-header h4 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--primary);
      font-weight: 500;
    }

    .time-badge {
      background: var(--primary);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .exam-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .info-row {
      display: flex;
      align-items: baseline;
    }

    .info-label {
      flex: 0 0 80px;
      font-weight: 500;
      color: var(--text);
      opacity: 0.7;
      font-size: 0.9rem;
    }

    .info-value {
      flex: 1;
      color: var(--text);
    }

    .info-value.notes {
      font-style: italic;
      opacity: 0.8;
    }

    .exam-actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--surface-3);
    }

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn.add-calendar {
      background: var(--primary);
      color: white;
    }

    .action-btn.add-calendar:hover {
      background: var(--primary-dark);
    }

    .action-btn.share {
      background: var(--surface-3);
      color: var(--text);
    }

    .action-btn.share:hover {
      background: var(--surface-4);
    }

    @media (max-width: 768px) {
      .exam-popup-overlay {
        align-items: flex-end;
      }

      .exam-popup {
        position: relative;
        width: 100%;
        max-width: none;
        max-height: 80vh;
        border-radius: 16px 16px 0 0;
      }

      .popup-connector {
        display: none;
      }

      .exam-actions {
        position: sticky;
        bottom: 0;
        background: var(--surface-1);
        margin: 0 -20px -20px;
        padding: 16px 20px;
        box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
      }
    }
  `],
  animations: [
    trigger('popupAnimation', [
      transition(':enter', [
        style({ 
          opacity: 0,
          transform: 'scale(0.95)'
        }),
        animate('200ms ease-out', style({ 
          opacity: 1,
          transform: 'scale(1)'
        }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ 
          opacity: 0,
          transform: 'scale(0.95)'
        }))
      ])
    ])
  ]
})
export class ExamPopupComponent {
  @Input() show = false;
  @Input() position?: ExamPopupPosition;
  @Input() date?: Date;
  @Input() exams: Exam[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() addToCalendar = new EventEmitter<Exam>();
  @Output() shareExam = new EventEmitter<Exam>();

  // Connector logic
  get shouldShowConnector(): boolean {
    return !!this.position?.transformOrigin && window.innerWidth > 768;
  }

  get connectorPosition(): { top: string, left: string } {
    if (!this.position?.transformOrigin) {
      return { top: '0', left: '0' };
    }

    // Calculate connector position based on transformOrigin
    const origin = this.position.transformOrigin;
    
    if (origin.includes('top')) {
      // If popup is below the date, place connector at top
      return { top: '-8px', left: 'calc(50% - 8px)' };
    } else if (origin.includes('bottom')) {
      // If popup is above the date, place connector at bottom
      return { top: 'calc(100% - 8px)', left: 'calc(50% - 8px)' };
    } else if (origin.includes('left')) {
      // If popup is to the right of the date
      return { top: 'calc(50% - 8px)', left: '-8px' };
    } else {
      // If popup is to the left of the date
      return { top: 'calc(50% - 8px)', left: 'calc(100% - 8px)' };
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as Element).classList.contains('exam-popup-overlay')) {
      this.close.emit();
    }
  }

  onAddToCalendar(exam: Exam): void {
    this.addToCalendar.emit(exam);
  }

  onShare(exam: Exam): void {
    this.shareExam.emit(exam);
  }
}
