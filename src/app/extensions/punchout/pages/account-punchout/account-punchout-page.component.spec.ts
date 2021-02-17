import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

import { AccountPunchoutHeaderComponent } from './account-punchout-header/account-punchout-header.component';
import { AccountPunchoutPageComponent } from './account-punchout-page.component';

describe('Account Punchout Page Component', () => {
  let component: AccountPunchoutPageComponent;
  let fixture: ComponentFixture<AccountPunchoutPageComponent>;
  let element: HTMLElement;
  let punchoutFacade: PunchoutFacade;

  const users = [
    { login: 'punchout1@test.intershop.de', email: 'punchout1@test.intershop.de' },
    { login: 'punchout2@test.intershop.de', email: 'punchout2@test.intershop.de' },
  ] as PunchoutUser[];

  beforeEach(async () => {
    punchoutFacade = mock(PunchoutFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        AccountPunchoutPageComponent,
        MockComponent(AccountPunchoutHeaderComponent),
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockComponent(ModalDialogComponent),
      ],
      providers: [{ provide: PunchoutFacade, useFactory: () => instance(punchoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPunchoutPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(punchoutFacade.punchoutUsersByRoute$()).thenReturn(of(users));
    when(punchoutFacade.selectedPunchoutType$).thenReturn(of('oci'));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display loading overlay if users are loading', () => {
    when(punchoutFacade.punchoutLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should display user list after creation ', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="user-list"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="user-list"]').innerHTML).toContain('punchout1@test.intershop.de');

    expect(element.querySelector('[data-testing-id="empty-user-list"]')).toBeFalsy();
  });

  it('should call deletePunchoutUser at punchout facade  when deleteUser is triggered', () => {
    when(punchoutFacade.deletePunchoutUser(anyString())).thenReturn(undefined);

    component.deleteUser(users[0]);

    verify(punchoutFacade.deletePunchoutUser(users[0])).once();
  });

  it('should display the empty list message if there is no user', () => {
    when(punchoutFacade.punchoutUsersByRoute$()).thenReturn(of([]));

    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="empty-user-list"]')).toBeTruthy();
  });
});
