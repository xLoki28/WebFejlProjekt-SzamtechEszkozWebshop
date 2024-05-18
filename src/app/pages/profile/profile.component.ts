import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  currentUser?: User;
  title?: boolean;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if (window.innerWidth < 992) {
      if(window.orientation == 90){
        this.title = true;
      } else{
        this.title = false;
      }
    }
    const user = JSON.parse(localStorage.getItem('user') as string);
    this.userService.getById(user.uid).subscribe(data => {
      this.currentUser = data;
    })
  }

  @HostListener('window:orientationchange')
  onOrientationChange() {
    window.location.reload();
  }
}
