import { Injectable, signal } from '@angular/core';

export type BookingTab = 'schedule' | 'brand' | 'audit';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  isBookingModalOpen = signal(false);
  activeModalTab = signal<BookingTab>('schedule');

  openBooking(tab: BookingTab = 'schedule') {
    this.activeModalTab.set(tab);
    this.isBookingModalOpen.set(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeBooking() {
    this.isBookingModalOpen.set(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}
