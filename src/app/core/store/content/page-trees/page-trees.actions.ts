import { createAction } from '@ngrx/store';

import { ContentPageletTree } from 'ish-core/models/content-pagelet-tree/content-pagelet-tree.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadContentPageTree = createAction(
  '[Content Page] Load Content Page Tree',
  payload<{ contentPageId: string; depth: string }>()
);

export const loadContentPageTreeFail = createAction('[Content Page API] Load Content Page Tree Fail', httpError());

export const loadContentPageTreeSuccess = createAction(
  '[Content Page API] Load Content Page Tree Success',
  payload<{ tree: ContentPageletTree }>()
);
