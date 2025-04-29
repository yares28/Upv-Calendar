import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastNotificationComponent } from './toast-notification.component';

describe('ToastNotificationComponent', () => {
  let component: ToastNotificationComponent;
  let fixture: ComponentFixture<ToastNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastNotificationComponent, BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastNotificationComponent);
    component = fixture.componentInstance;
    
    // Set required inputs
    component.id = 1;
    component.message = 'Test toast message';
    component.type = 'success';
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message correctly', () => {
    const messageElement = fixture.debugElement.query(By.css('.toast-message'));
    expect(messageElement.nativeElement.textContent).toContain('Test toast message');
  });

  it('should have correct CSS class based on type', () => {
    const containerElement = fixture.debugElement.query(By.css('.toast-container'));
    expect(containerElement.nativeElement.classList).toContain('toast-success');
    
    // Change type and verify class changes
    component.type = 'error';
    fixture.detectChanges();
    expect(containerElement.nativeElement.classList).toContain('toast-error');
  });

  it('should close toast when close button is clicked', () => {
    spyOn(component, 'closeToast');
    const closeButton = fixture.debugElement.query(By.css('.toast-close'));
    closeButton.triggerEventHandler('click', { stopPropagation: () => {} });
    expect(component.closeToast).toHaveBeenCalled();
  });

  it('should start with progress bar at 100%', () => {
    const progressBar = fixture.debugElement.query(By.css('.toast-progress'));
    expect(component.progressWidth).toBe(100);
  });

  it('should clear timeout on destroy', () => {
    spyOn(component, 'clearTimeout');
    component.ngOnDestroy();
    expect(component.clearTimeout).toHaveBeenCalled();
  });
}); 