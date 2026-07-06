import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ScrollService } from '../../services/scroll.service';
import { BookingService } from '../../services/booking.service';
import { LogoComponent } from '../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, LogoComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  public scrollService = inject(ScrollService);
  public bookingService = inject(BookingService);
  
  scrolled = this.scrollService.scrolled;
  mobileMenuOpen = signal(false);

  openConsultation(tab: 'schedule' | 'brand' | 'audit') {
    this.bookingService.openBooking(tab);
    this.mobileMenuOpen.set(false);
  }
}
