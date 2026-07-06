import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.scss'
})
export class CtaComponent {
  private bookingService = inject(BookingService);

  openBooking(tab: 'schedule' | 'brand' | 'audit' = 'schedule') {
    this.bookingService.openBooking(tab);
  }
}
