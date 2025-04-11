import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { RegisterData } from '../../models/register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    public _authServices: AuthService,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repet_password: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    if (this._authServices.user) {
      this.router.navigate(["/"]);
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const repetPassword = formGroup.get('repet_password')?.value;
    return password === repetPassword ? null : { mismatch: true };
  }

  registro(): void {
    if (this.registerForm.invalid) {
      alert("POR FAVOR COMPLETE TODOS LOS CAMPOS CORRECTAMENTE");
      return;
    }

    if (this.registerForm.hasError('mismatch')) {
      alert("LAS CONTRASEÑAS DEBEN SER IGUALES");
      return;
    }

    const formValue = this.registerForm.value;
    const data: RegisterData = {
      email: formValue.email,
      name: formValue.name,
      surname: formValue.surname,
      password: formValue.password,
      rol: 'cliente'
    };

    this._authServices.registro(data).subscribe({
      next: (resp) => {
        console.log('Registro exitoso', resp);
        // Redirigir a login o directamente hacer login
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Error en registro', err);
        alert(err.error?.message || 'Error en el registro');
      }
    });
  }
}
