import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BookingService, BookingTab } from '../../../core/services/booking.service';

@Component({
  selector: 'app-founders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  templateUrl: './founders.component.html',
  styleUrl: './founders.component.scss'
})
export class FoundersComponent {
  private bookingService = inject(BookingService);

  openBooking(tab: BookingTab = 'schedule') {
    this.bookingService.openBooking(tab);
  }
}
