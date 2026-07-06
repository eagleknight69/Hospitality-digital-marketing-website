import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trusted-brands',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './trusted-brands.component.html',
  styleUrl: './trusted-brands.component.scss'
})
export class TrustedBrandsComponent {}
