import { TestBed, ComponentFixture, inject, async } from '@angular/core/testing';
import { HttpModule, Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { Resource } from './resource';
import { Config } from './config';
import { ResourceService } from './resource.service';

////////  SPECS  /////////////
describe('ResourceService', function () {
    const myName = 'MY_NAME';

    beforeAll(() => {
        spyOn(Config.prototype, 'get').and.callFake(function (name: string) {
            if (name == 'WS_refreshDelayMs') return 0; // disable timer
            if (name == 'WS_baseUrl') return 'https://ww.fake.com/api/resource';
            return null;
        });
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                {
                    provide: Http,
                    useFactory: (mockBackend: MockBackend, options: BaseRequestOptions) => {
                        return new Http(mockBackend, options);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
                Config,
                MockBackend,
                BaseRequestOptions,

                ResourceService
            ]
        });
    });

    describe('getResources()', () => {
        it('should return the Observablee<Array<Resource>> ',
            async(inject([ResourceService, MockBackend], (resourceService: ResourceService, mockBackend: MockBackend) => {
                const mockResponse = [
                    { "type": "Type 1", "subtype": "Subtype 1", "name": myName },
                    { "type": "Type 1", "subtype": "Subtype 1", "name": "resource #2" }
                ]

                mockBackend.connections.subscribe((connection: MockConnection) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        body: JSON.stringify(mockResponse),
                        status: 200
                    })));
                });

                resourceService.getResources().subscribe((resource: Resource[]) => {
                    expect(resource).toBeDefined();
                    expect(resource.length).toBe(2);
                    expect(resource[0].name).toBe(myName);
                });
            })));

        it('should return exception',
            async(inject([ResourceService, MockBackend], (resourceService: ResourceService, mockBackend: MockBackend) => {
                mockBackend.connections.subscribe((connection: MockConnection) => {
                    connection.mockRespond(new Response(new ResponseOptions({
                        status: 401
                    })));
                });

                resourceService.getResources().subscribe((resource: Resource[]) => {
                    fail('must not work');
                }, (error) => {
                    expect(error).toBe('Invalid response');
                });
            })));            
    });
});
