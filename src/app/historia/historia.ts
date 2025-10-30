import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-historia',
  standalone: true,
  templateUrl: './historia.html',
  styleUrls: ['./historia.css']
})
export class Historia implements AfterViewInit {
  ngAfterViewInit() {
    const items = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.2 });

    items.forEach(item => observer.observe(item));
  }
}
