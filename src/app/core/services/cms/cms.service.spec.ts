import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ContentPageletEntryPointMapper } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.mapper';
import { ContentPageletTreeData } from 'ish-core/models/content-pagelet-tree/content-pagelet-tree.interface';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';

import { CMSService } from './cms.service';

describe('Cms Service', () => {
  let cmsService: CMSService;
  let apiService: ApiService;
  let cpepMapper: ContentPageletEntryPointMapper;

  beforeEach(() => {
    apiService = mock(ApiService);
    cpepMapper = mock(ContentPageletEntryPointMapper);

    TestBed.configureTestingModule({
      providers: [
        { provide: ContentPageletEntryPointMapper, useFactory: () => instance(cpepMapper) },
        { provide: ApiService, useFactory: () => instance(apiService) },
      ],
    });

    cmsService = TestBed.inject(CMSService);
  });

  it('should be created', () => {
    expect(cmsService).toBeTruthy();
  });

  describe('getContentInclude', () => {
    it('should call api service to retrieve content include', done => {
      when(apiService.get(anything(), anything())).thenReturn(of('My Data'));
      // tslint:disable-next-line: no-any
      when(cpepMapper.fromData(anything())).thenReturn({} as any);

      cmsService.getContentInclude('ID').subscribe(
        data => {
          verify(apiService.get(anything(), anything())).once();

          const args = capture(apiService.get).first();
          expect(args).toMatchInlineSnapshot(`
            Array [
              "cms/includes/ID",
              Object {
                "sendPGID": true,
              },
            ]
          `);

          expect(data).toMatchInlineSnapshot(`
            Object {
              "include": undefined,
              "pagelets": undefined,
            }
          `);
        },
        fail,
        done
      );
    });
  });

  describe('getContentPageTree', () => {
    beforeEach(() => {
      when(apiService.get(`cms/pagetree/dummyId`, anything())).thenReturn(
        of({ page: { itemId: 'dummyId' } } as ContentPageletTreeData)
      );
    });

    it('should call ApiService "PageTree" when used', () => {
      cmsService.getContentPageTree('dummyId');
      verify(apiService.get(`cms/pagetree/dummyId`, anything())).once();
    });

    it('should set depth when property is set', () => {
      cmsService.getContentPageTree('dummyId', '2');
      verify(apiService.get(`cms/pagetree/dummyId`, anything())).once();

      expect(capture(apiService.get).last()[0].toString()).toMatchInlineSnapshot(`"cms/pagetree/dummyId"`);
      const options: AvailableOptions = capture(apiService.get).last()[1];
      expect(options.params.toString()).toMatchInlineSnapshot(`"depth=2"`);
    });

    it('should throw error when contentPageId is not set', done => {
      cmsService.getContentPageTree(undefined).subscribe(fail, err => {
        expect(err).toBeTruthy();
        done();
      });

      verify(apiService.get(anything())).never();
    });
  });
});
