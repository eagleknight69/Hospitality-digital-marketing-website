import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { TrustedBrandsComponent } from './trusted-brands/trusted-brands.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { PortfolioPreviewComponent } from './portfolio-preview/portfolio-preview.component';
import { ProcessComponent } from './process/process.component';
import { FoundersComponent } from './founders/founders.component';
import { TestimonialsPreviewComponent } from './testimonials-preview/testimonials-preview.component';
import { CtaComponent } from './cta/cta.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    HeroComponent,
    TrustedBrandsComponent,
    AboutComponent,
    ServicesComponent,
    PortfolioPreviewComponent,
    ProcessComponent,
    FoundersComponent,
    TestimonialsPreviewComponent,
    CtaComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private route = inject(ActivatedRoute);

  constructor() {
    if (typeof document !== 'undefined') {
      this.route.fragment.subscribe(frag => {
        if (frag) {
          setTimeout(() => {
            const element = document.getElementById(frag);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 150);
        }
      });
    }
  }
}
