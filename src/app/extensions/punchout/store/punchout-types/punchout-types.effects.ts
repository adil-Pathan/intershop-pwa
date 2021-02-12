import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs/operators';

import { mapErrorToAction } from 'ish-core/utils/operators';

import { PunchoutService } from '../../services/punchout/punchout.service';

import { loadPunchoutTypes, loadPunchoutTypesFail, loadPunchoutTypesSuccess } from './punchout-types.actions';

@Injectable()
export class PunchoutTypesEffects {
  constructor(private actions$: Actions, private punchoutService: PunchoutService) {}

  loadPunchoutTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPunchoutTypes),
      concatMap(() =>
        this.punchoutService.getPunchoutTypes().pipe(
          map(types => loadPunchoutTypesSuccess({ types })),
          mapErrorToAction(loadPunchoutTypesFail)
        )
      )
    )
  );
}
