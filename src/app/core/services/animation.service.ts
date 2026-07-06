import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  durations = {
    fast: 'duration-200',
    normal: 'duration-300',
    slow: 'duration-500'
  };

  easings = {
    smooth: 'cubic-bezier(0.16, 1, 0.3, 1)'
  };
}
