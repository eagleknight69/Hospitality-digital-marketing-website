import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  duration: string;
}

@Component({
  selector: 'app-process',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  templateUrl: './process.component.html',
  styleUrl: './process.component.scss'
})
export class ProcessComponent {
  activeProcessStep = signal<number>(0);

  processSteps: ProcessStep[] = [
    {
      number: '01',
      title: 'Discovery & Aesthetic Audit',
      subtitle: 'Mapping your property’s unique narrative DNA.',
      description: 'We perform a comprehensive audit of your digital ecosystem. We analyze your location, target luxury demographic, current OTA commission leakages, and identify the core visual story that makes your hotel unique.',
      deliverables: [
        'Detailed OTA Commission Leakage Analysis',
        'Visual Identity Gap Assessment',
        'Competitive Hospitality Benchmarking',
        'Property Positioning Roadmap'
      ],
      duration: 'Week 1'
    },
    {
      number: '02',
      title: 'Premium Content Production',
      subtitle: 'Capturing the sensory luxury of your estate.',
      description: 'Our award-winning photography and drone team arrives on-site. Using elite cinematic cinema cameras and creative light manipulation, we produce an extensive library of architectural, lifestyle, and epicurean assets.',
      deliverables: [
        '8K Ultra-HD Cinematic Video Library',
        'Signature Sunrise/Sunset Drone Overlays',
        'Luxe Room & Lifestyle Asset Pack',
        'Social-First Reels & Vertical Edits'
      ],
      duration: 'Weeks 2 - 4'
    },
    {
      number: '03',
      title: 'Direct-Booking Experience Launch',
      subtitle: 'Building a flawless, high-performance digital foyer.',
      description: 'We design and build a high-converting, high-speed custom website. We integrate seamless booking tools, develop high-end ad funnels on search and social channels, and deploy custom landing pages that load instantly.',
      deliverables: [
        'Editorial Hospitality Web Application',
        'Responsive Dynamic Booking Panel',
        'Performance Ads Setup & Creative Assocs',
        'Targeted High-Net-Worth Meta/Google Funnels'
      ],
      duration: 'Weeks 5 - 6'
    },
    {
      number: '04',
      title: 'Scale & Growth Management',
      subtitle: 'Optimizing high-yield direct booking streams.',
      description: 'We actively manage your campaigns, refine copywriting hooks, analyze heatmaps, and implement continuous conversion optimization to consistently lower OTA reliance and scale your property’s profitability.',
      deliverables: [
        'Active Performance Advertising Optimization',
        'Bi-weekly Strategic Direct-Booking Reports',
        'Fresh Monthly Creative & Visual Content Refreshes',
        'Continuous UX Conversion A/B Testing'
      ],
      duration: 'Ongoing'
    }
  ];

  setProcessStep(index: number) {
    this.activeProcessStep.set(index);
  }
}
