import { AfterContentChecked, Component, DoCheck, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from '../../shared/services/loading.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy{

  email = new FormControl('');
  password = new FormControl('');

  loadingSubscription?: Subscription;

  loading: boolean = false;
  look?: boolean;
  title?: boolean;

  constructor(private router: Router, private loadingService: LoadingService, private authService: AuthService) { }

  ngOnInit(): void {
    if (window.innerWidth < 992) {
      this.look = true;
      if(window.orientation == 90){
        this.title = true;
      } else{
        this.title = false;
      }
    } else{
      this.look = false;
    }
  }

  @HostListener('window:orientationchange')
  onOrientationChange() {
    window.location.reload();
  }

  login() {
    this.loading = true;

    this.authService.login(this.email.value as string, this.password.value as string).then(cred => {
      console.log(cred);
      this.router.navigateByUrl('/main');
      this.loading = false;
    }).catch(error => {
      console.error(error);
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.loadingSubscription?.unsubscribe();
  }

}
