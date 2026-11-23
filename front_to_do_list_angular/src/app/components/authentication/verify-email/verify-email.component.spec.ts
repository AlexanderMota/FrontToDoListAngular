
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { VerifyEmailComponent } from './verify-email.component';
import { AuthService } from '../../../services/auth.service';

describe('VerifyEmailComponent', () => {

  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  let token: string | null;

  beforeEach(async () => {

    token = 'token_test_123';

    authServiceMock = jasmine.createSpyObj('AuthService', [
      'verifyEmail'
    ]);

    await TestBed.configureTestingModule({
      imports: [VerifyEmailComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              get queryParamMap() {
                return convertToParamMap(
                  token ? { token } : {}
                );
              }
            }
          }
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser'
        }
      ]
    })
    .overrideComponent(VerifyEmailComponent, {
      set: { template: '' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;

    // No ejecutamos fixture.detectChanges() aquí.
    // Lo haremos dentro de cada test para controlar ngOnInit().
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe comenzar en estado de carga', () => {
    expect(component.loading).toBeTrue();
    expect(component.success).toBeFalse();
    expect(component.message).toBe('');
  });

  describe('ngOnInit', () => {

    it('Debe mostrar un error si no existe token', () => {

      token = null;

      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(component.success).toBeFalse();

      expect(component.message).toBe(
        'No se ha proporcionado un token de verificación.'
      );

      expect(authServiceMock.verifyEmail).not.toHaveBeenCalled();
    });

    it('Debe enviar el token correctamente al servicio', () => {

      authServiceMock.verifyEmail.and.returnValue(
        of({
          message: 'Correo verificado correctamente.'
        } as any)
      );

      fixture.detectChanges();

      expect(authServiceMock.verifyEmail)
        .toHaveBeenCalledWith('token_test_123');
    });

    it('Debe actualizar el estado tras verificar correctamente el correo', () => {

      authServiceMock.verifyEmail.and.returnValue(
        of({
          message: 'Correo verificado correctamente.'
        } as any)
      );

      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(component.success).toBeTrue();

      expect(component.message).toBe(
        'Correo verificado correctamente.'
      );
    });

    it('Debe mostrar el mensaje de error recibido del backend', () => {

      authServiceMock.verifyEmail.and.returnValue(
        throwError(() => ({
          status: 400,
          error: {
            error: 'El token ha expirado'
          }
        }))
      );

      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(component.success).toBeFalse();

      expect(component.message).toBe('El token ha expirado');
    });

    it('Debe mostrar un mensaje genérico si el backend no proporciona uno', () => {

      authServiceMock.verifyEmail.and.returnValue(
        throwError(() => ({
          status: 500,
          error: {}
        }))
      );

      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(component.success).toBeFalse();

      expect(component.message).toBe(
        'No se pudo verificar el correo electrónico.'
      );
    });
  });
});

describe('VerifyEmailComponent - SSR', () => {

  it('No debe verificar el correo durante el renderizado del servidor', async () => {

    const authServiceMock = jasmine.createSpyObj(
      'AuthService',
      ['verifyEmail']
    );

    await TestBed.configureTestingModule({
      imports: [VerifyEmailComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({
                token: 'token_test_123'
              })
            }
          }
        },
        {
          provide: PLATFORM_ID,
          useValue: 'server'
        }
      ]
    })
    .overrideComponent(VerifyEmailComponent, {
      set: { template: '' }
    })
    .compileComponents();

    const fixture = TestBed.createComponent(VerifyEmailComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(authServiceMock.verifyEmail).not.toHaveBeenCalled();

    expect(component.success).toBeFalse();
    expect(component.message).toBe('');
  });
});
