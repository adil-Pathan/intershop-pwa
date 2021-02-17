import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { PunchoutType } from '../../models/punchout-user/punchout-user.model';

@Component({
  selector: 'ish-account-punchout-create-page',
  templateUrl: './account-punchout-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPunchoutCreatePageComponent implements OnInit {
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;
  selectedType$: Observable<PunchoutType>;

  form: FormGroup = this.fb.group(
    {
      login: ['', [Validators.required, SpecialValidators.punchoutLogin]],
      active: [true],
      password: ['', [Validators.required, SpecialValidators.password]],
      passwordConfirmation: ['', [Validators.required, SpecialValidators.password]],
    },
    {
      validators: [SpecialValidators.equalTo('passwordConfirmation', 'password')],
    }
  );

  punchoutTypeText: string;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private punchoutFacade: PunchoutFacade,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.loading$ = this.punchoutFacade.punchoutLoading$;
    this.error$ = this.punchoutFacade.punchoutError$;
    this.selectedType$ = this.punchoutFacade.selectedPunchoutType$;
  }

  submitForm(punchoutType: PunchoutType) {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    const email = this.form.get('login').value + UUID.UUID();

    this.punchoutFacade.addPunchoutUser({ ...this.form.value, email, punchoutType });
  }

  getPunchoutTypeText(punchoutType: PunchoutType): string {
    return (this.punchoutTypeText = this.translateService.instant(`account.punchout.${punchoutType}.text`));
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }
}
