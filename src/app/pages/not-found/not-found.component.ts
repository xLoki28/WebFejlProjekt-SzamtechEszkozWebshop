import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit {

  title?: boolean;

  ngOnInit(): void {
    if (window.innerWidth < 992) {
      if(window.orientation == 90){
        this.title = true;
      } else{
        this.title = false;
      }
    } 
  }

  @HostListener('window:orientationchange')
  onOrientationChange() {
    window.location.reload();
  }

}
