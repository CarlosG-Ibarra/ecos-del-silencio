import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-caracteristicas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './caracteristicas.html',
  styleUrls: ['./caracteristicas.css']
})
export class Caracteristicas implements AfterViewInit {

  ngAfterViewInit() {
    const features = document.querySelectorAll('.feature');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.2 });

    features.forEach(f => observer.observe(f));
  }
}
