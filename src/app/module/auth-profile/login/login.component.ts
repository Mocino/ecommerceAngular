import { Component, OnInit } from '@angular/core';
import { User } from '../../models/auth.model';
import { AuthService } from '../_services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email:string = "";
  password:string = "";

  constructor(
    public _authService: AuthService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    // console.log(this.authService.user);
    if(this._authService.user){
      this.router.navigate(["/"]);
    }
  }

  login(): void {
    if(!this.email) {
      alert("ES NECESARIO INGRESAR EL EMAIL");
      return;
    }

    if(!this.password) {
      alert("ES NECESARIO INGRESAR UNA CONTRASEÑA");
      return;
    }

    this._authService.login(this.email, this.password).subscribe((resp) => {
      if(typeof resp === 'boolean' && resp) {
        // El usuario ingresó con éxito
        this.router.navigate(["/"]);
      } else if (typeof resp !== 'boolean' && resp.error) {
        alert(resp.error.message);
      }
    });
  }
}
