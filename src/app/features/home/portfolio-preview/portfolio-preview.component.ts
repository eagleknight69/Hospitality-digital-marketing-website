import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../../core/services/booking.service';

export interface PortfolioItem {
  id: string;
  title: string;
  hotel: string;
  category: string;
  image: string;
  tag: string;
  stat?: string;
  statLabel?: string;
}

@Component({
  selector: 'app-portfolio-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  templateUrl: './portfolio-preview.component.html',
  styleUrl: './portfolio-preview.component.scss'
})
export class PortfolioPreviewComponent {
  private bookingService = inject(BookingService);

  portfolioFilter = signal<string>('All');
  portfolioCategories = ['All', 'Photography', 'Videography', 'Web Design', 'Branding'];

  portfolioItems = signal<PortfolioItem[]>([
    {
      id: 'p1',
      title: 'Dawn Over Caldera',
      hotel: 'Viceroy Caldera Suites, Santorini',
      category: 'Photography',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      tag: 'Sunrise Drone & Interior',
      stat: '+42%',
      statLabel: 'Direct Bookings increase'
    },
    {
      id: 'p2',
      title: 'Cinematic Horizon',
      hotel: 'Aman Sanctuary, Utah Desert',
      category: 'Videography',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      tag: '8K Promo & Reels Campaign',
      stat: '2.4M',
      statLabel: 'Campaign Views'
    },
    {
      id: 'p3',
      title: 'The Digital Hideaway',
      hotel: 'Soneva Fushi, Maldives',
      category: 'Web Design',
      image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80',
      tag: 'Bespoke Booking Interface',
      stat: '-30%',
      statLabel: 'OTA Commissions'
    },
    {
      id: 'p4',
      title: 'Visual Heritage Identity',
      hotel: 'Kyoto Ritz Experience, Kyoto',
      category: 'Branding',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      tag: 'Brand Book & Sensory Assets',
      stat: '+65%',
      statLabel: 'High-Net-Worth Leads'
    },
    {
      id: 'p5',
      title: 'Midnight Oasis Sessions',
      hotel: 'Al Maha Desert Resort, Dubai',
      category: 'Photography',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      tag: 'Nocturnal Pool Photography',
      stat: '100%',
      statLabel: 'Suites Sold Out Season'
    },
    {
      id: 'p6',
      title: 'Pure Sensory Narrative',
      hotel: 'Singita Wilderness Lodges, Serengeti',
      category: 'Videography',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      tag: 'Wildlife Luxury Documentary',
      stat: '14.8x',
      statLabel: 'Ad Spend ROI'
    }
  ]);

  filteredPortfolioItems = computed(() => {
    const filter = this.portfolioFilter();
    if (filter === 'All') {
      return this.portfolioItems();
    }
    return this.portfolioItems().filter(item => item.category === filter);
  });

  setPortfolioFilter(filter: string) {
    this.portfolioFilter.set(filter);
  }

  openBooking(tab: 'schedule' | 'brand' | 'audit' = 'brand') {
    this.bookingService.openBooking(tab);
  }
}
