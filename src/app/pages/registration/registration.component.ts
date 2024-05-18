import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { User } from '../../shared/models/User';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit{

  look?: boolean;
  title?: boolean;

  registerForm = this.createForm({
    id: '',
    name: '',
    email: '',
    username: ''
  }, '', '');

  constructor(private location: Location, private fb: FormBuilder, private authService: AuthService, private userService: UserService) { }

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

  createForm(model: User, passwordfirst: string, repassword: string){
    const formGroup = this.fb.group({
      name: [model.name, Validators.required],
      email: [model.email, [Validators.required, Validators.email]],
      password: [passwordfirst, [Validators.required, Validators.minLength(6)]],
      passwordagain: [repassword, Validators.required]
    });

    formGroup.get('name')?.setValidators([Validators.required]);
    formGroup.get('email')?.setValidators([Validators.required, Validators.email]);
    formGroup.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    formGroup.get('passwordagain')?.setValidators([Validators.required, this.passwordMatchValidator()]);
    return formGroup;
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const passwordControl = control.root.get('password');
      const password = passwordControl?.value;
      const passwordAgain = control.value;
      
      if (password !== passwordAgain) {
        return { 'mismatch': true };
      }

      return null;
    };
  }

  onSubmit() {
    if(this.registerForm.valid){
      console.log(this.registerForm.value);
      this.authService.register(this.registerForm.get('email')?.value as string, this.registerForm.get('password')?.value as string).then(cred => {
        console.log(cred);
        const user: User = {
          id: cred.user?.uid as string,
          name: this.registerForm.get('name')?.value as string,
          email: this.registerForm.get('email')?.value as string,
          username: this.registerForm.get('email')?.value?.split('@')[0] as string,
        }

        this.userService.create(user).then(_ => {
          console.log('User added successfully!');
        }).catch(error => {
          console.error(error);
        });
        
      }).catch(error => {
        console.error(error);
      });
    }
  }

  goBack() {
    this.location.back();
  }

}
