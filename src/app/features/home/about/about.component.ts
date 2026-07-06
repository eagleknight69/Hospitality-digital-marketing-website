import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  private bookingService = inject(BookingService);

  openBooking(tab: 'schedule' | 'brand' | 'audit' = 'brand') {
    this.bookingService.openBooking(tab);
  }
}
