import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BookingService } from './booking.service';
import { ToastService } from './toast.service';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(BookingService);
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should default to closed modal on the schedule tab', () => {
    expect(service.isBookingModalOpen()).toBe(false);
    expect(service.activeModalTab()).toBe('schedule');
  });

  it('should open modal on requested tab and lock body scroll', () => {
    service.openBooking('audit');
    expect(service.isBookingModalOpen()).toBe(true);
    expect(service.activeModalTab()).toBe('audit');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should close modal and restore body scroll', () => {
    service.openBooking('brand');
    service.closeBooking();
    expect(service.isBookingModalOpen()).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });
});

describe('ToastService', () => {
  let toast: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    toast = TestBed.inject(ToastService);
  });

  afterEach(() => {
    toast.hide();
  });

  it('should display and hide toast notifications with meeting IDs', () => {
    toast.show('Consultation confirmed', 'CC-999999');
    expect(toast.showToast()).toBe(true);
    expect(toast.toastMessage()).toBe('Consultation confirmed');
    expect(toast.toastMeetingId()).toBe('CC-999999');

    toast.hide();
    expect(toast.showToast()).toBe(false);
  });
});
