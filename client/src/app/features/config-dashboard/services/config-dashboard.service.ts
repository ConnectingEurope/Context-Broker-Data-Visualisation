import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContextBrokerConfiguration, ServiceConfiguration } from '../models/context-broker-configuration';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/misc/utils';
import { ContextSubscription } from '../components/subscriptions-dialog/subscriptions-dialog.component';
import { TypeContainerDto } from '../models/type-container-dto';

@Injectable({
    providedIn: 'root',
})
export class ConfigDashboardService {

    public defaultContextName: string = 'New Context Broker';
    public defaulServiceHeader: string = 'New Service';
    public contextHeaderWhenEmpty: string = 'Context Broker without name';
    public serviceHeaderWhenEmpty: string = 'No service specified';

    constructor(
        private http: HttpClient,
    ) { }

    public createContextBrokerForm(): FormGroup {
        return new FormGroup({
            name: new FormControl(this.defaultContextName, [Validators.required, Validators.pattern(Utils.whiteSpaceExp)]),
            url: new FormControl('', [Validators.required, Validators.pattern(Utils.whiteSpaceExp)]),
            needServices: new FormControl(false),
            needHistoricalData: new FormControl(false),
        });
    }

    public createHistoricalForm(): FormGroup {
        return new FormGroup({
            cygnus: new FormControl('', []),
            comet: new FormControl('', [Validators.required, Validators.pattern(Utils.whiteSpaceExp)]),
        });
    }

    public createServiceForm(): FormGroup {
        return new FormGroup({
            service: new FormControl('', [Validators.required, Validators.pattern(Utils.whiteSpaceExp)]),
            servicePath: new FormControl('', [Validators.pattern(Utils.pathExp)]),
        });
    }

    public createContextBrokerFormFromConfig(cbConfig: ContextBrokerConfiguration): FormGroup {
        const formGroup: FormGroup = this.createContextBrokerForm();
        formGroup.get('name').setValue(cbConfig.name);
        formGroup.get('url').setValue(cbConfig.url);
        formGroup.get('needServices').setValue(cbConfig.needServices);
        formGroup.get('needHistoricalData').setValue(cbConfig.needHistoricalData);
        return formGroup;
    }

    public createHistoricalFormFromConfig(cbConfig: ContextBrokerConfiguration): FormGroup {
        const formGroup: FormGroup = this.createHistoricalForm();
        formGroup.get('cygnus').setValue(cbConfig.cygnus);
        formGroup.get('comet').setValue(cbConfig.comet);
        return formGroup;
    }

    public createServiceFormFromConfig(sConfig: ServiceConfiguration): FormGroup {
        const formGroup: FormGroup = this.createServiceForm();
        formGroup.get('service').setValue(sConfig.service);
        formGroup.get('servicePath').setValue(sConfig.servicePath);
        return formGroup;
    }

    public checkBrokerHealth(url: string): Observable<boolean> {
        return this.checkHealth(url, '/server/check-health/broker');
    }

    public checkCygnusHealth(url: string): Observable<boolean> {
        return this.checkHealth(url, '/server/check-health/cygnus');
    }

    public checkCometHealth(url: string): Observable<boolean> {
        return this.checkHealth(url, '/server/check-health/comet');
    }

    public getEntitiesFromService(url: string, service?: string, servicePath?: string): Observable<TypeContainerDto[]> {
        const body: any = { url, service, servicePath };
        return this.http.post<TypeContainerDto[]>('/server/entities/schema', body);
    }

    public getConfiguration(): Observable<ContextBrokerConfiguration[]> {
        return this.http.get<ContextBrokerConfiguration[]>('/server/configuration');
    }

    public postConfiguration(config: ContextBrokerConfiguration[]): Observable<void> {
        return this.http.post<void>('/server/configuration', config);
    }

    public getSubscriptions(url: string, service?: string, servicePath?: string): Observable<ContextSubscription[]> {
        const body: any = { url, service, servicePath };
        return this.http.post<ContextSubscription[]>('/server/subscriptions', body);
    }

    private checkHealth(url: string, api: string): Observable<boolean> {
        let parameters: HttpParams = new HttpParams();
        parameters = parameters.append('url', url);

        return this.http.get<boolean>(api, { params: parameters });
    }

}
