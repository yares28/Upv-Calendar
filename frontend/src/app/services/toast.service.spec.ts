import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { Toast } from '../components/toast-notification/toast-notification.component';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty toasts array', (done) => {
    service.toasts$.subscribe(toasts => {
      expect(toasts).toEqual([]);
      done();
    });
  });

  it('should add success toast with correct type', (done) => {
    service.success('Success message');
    
    service.toasts$.subscribe(toasts => {
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('success');
      expect(toasts[0].message).toBe('Success message');
      expect(toasts[0].timeout).toBe(5000);
      done();
    });
  });

  it('should add error toast with correct type and longer timeout', (done) => {
    service.error('Error message');
    
    service.toasts$.subscribe(toasts => {
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('error');
      expect(toasts[0].message).toBe('Error message');
      expect(toasts[0].timeout).toBe(8000);
      done();
    });
  });

  it('should add info toast with correct type', (done) => {
    service.info('Info message');
    
    service.toasts$.subscribe(toasts => {
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('info');
      expect(toasts[0].message).toBe('Info message');
      done();
    });
  });

  it('should add warning toast with correct type', (done) => {
    service.warning('Warning message');
    
    service.toasts$.subscribe(toasts => {
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('warning');
      expect(toasts[0].message).toBe('Warning message');
      done();
    });
  });

  it('should remove toast by id', (done) => {
    // Add two toasts
    service.success('First toast');
    service.error('Second toast');
    
    // Get the first toast id
    let firstToastId: number;
    service.toasts$.subscribe(toasts => {
      if (toasts.length === 2) {
        firstToastId = toasts[0].id;
        
        // Remove the first toast
        service.remove(firstToastId);
      } else if (toasts.length === 1) {
        // After removal, check that only second toast remains
        expect(toasts[0].message).toBe('Second toast');
        done();
      }
    });
  });

  it('should clear all toasts', (done) => {
    // Add multiple toasts
    service.success('Toast 1');
    service.error('Toast 2');
    service.info('Toast 3');
    
    // Clear all toasts
    service.clear();
    
    service.toasts$.subscribe(toasts => {
      expect(toasts.length).toBe(0);
      done();
    });
  });

  it('should generate unique IDs for each toast', (done) => {
    service.success('Toast 1');
    service.success('Toast 2');
    
    service.toasts$.subscribe(toasts => {
      if (toasts.length === 2) {
        expect(toasts[0].id).not.toBe(toasts[1].id);
        done();
      }
    });
  });
}); 