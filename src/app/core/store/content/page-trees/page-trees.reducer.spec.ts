import { ContentPageTree, ContentPageTreeElement } from 'ish-core/models/content-page-tree/content-page-tree.model';
import { pageTree } from 'ish-core/utils/dev/test-data-utils';

import { loadContentPageTree, loadContentPageTreeFail, loadContentPageTreeSuccess } from './page-trees.actions';
import { initialState, pageTreesReducer } from './page-trees.reducer';

describe('Page Trees Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as ReturnType<
        typeof loadContentPageTree | typeof loadContentPageTreeSuccess | typeof loadContentPageTreeFail
      >;
      const state = pageTreesReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('Load content page tree actions', () => {
    describe('LoadContentPageTreeSuccess action', () => {
      let tree: ContentPageTree;

      beforeEach(() => {
        tree = pageTree([
          { contentPageId: '1', path: ['1'] },
          { contentPageId: '1.1', path: ['1', '1.1'] },
          { contentPageId: '1.2', path: ['1', '1.2'] },
          { contentPageId: '1.1.1', path: ['1', '1.1', '1.1.1'] },
          { contentPageId: '1.1.2', path: ['1', '1.1', '1.1.2'] },
          { contentPageId: '1.2.1', path: ['1', '1.2', '1.2.1'] },
        ] as ContentPageTreeElement[]);
      });

      it('should insert whole page tree to state', () => {
        const action = loadContentPageTreeSuccess({ tree });
        const state = pageTreesReducer(initialState, action);

        expect(Object.keys(state.trees.nodes)).toHaveLength(6);
        expect(Object.keys(state.trees.nodes)).toEqual(['1', '1.1', '1.2', '1.1.1', '1.1.2', '1.2.1']);
      });
    });
  });
});
