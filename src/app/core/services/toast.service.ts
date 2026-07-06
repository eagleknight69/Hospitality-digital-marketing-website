import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  showToast = signal(false);
  toastMessage = signal('');
  toastMeetingId = signal('');

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  show(message: string, meetingId = 'CC-CONFIRMED', duration = 8000) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.toastMessage.set(message);
    this.toastMeetingId.set(meetingId);
    this.showToast.set(true);

    this.timeoutId = setTimeout(() => {
      this.showToast.set(false);
    }, duration);
  }

  hide() {
    this.showToast.set(false);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
