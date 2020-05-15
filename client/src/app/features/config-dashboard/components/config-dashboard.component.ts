import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { ConfigDashboardService } from '../services/config-dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { ContextBrokerForm, ServiceForm } from '../models/context-broker-form';
import { ContextBrokerConfiguration, ServiceConfiguration } from '../models/context-broker-configuration';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { ServiceConfigurationComponent } from './service-configuration/service-configuration.component';
import { AccordionTab } from 'primeng/accordion/accordion';
import { EntityTreeNodeService } from '../services/entity-tree-node.service';
import { Observable, combineLatest } from 'rxjs';

@Component({
    selector: 'app-config-dashboard',
    templateUrl: './config-dashboard.component.html',
    styleUrls: ['./config-dashboard.component.scss'],
})
export class ConfigDashboardComponent extends BaseComponent implements OnInit {

    public configurationLoaded: boolean = false;
    public addedContextBrokerAtLeastOnce: boolean = false;
    public removedContextBrokerAtLeastOnce: boolean = false;
    public removedServiceAtLeastOnce: boolean = false;
    public selectedEntitiesChange: boolean = false;
    public accordionTabsSelected: boolean = false;
    public favAttrChange: boolean = false;
    public contextBrokers: ContextBrokerForm[] = [];

    @ViewChild('serviceConfiguration') private serviceConfiguration: ServiceConfigurationComponent;
    @ViewChildren('accordionTab') private accordionTabs: QueryList<AccordionTab>;

    constructor(
        private configDashboardService: ConfigDashboardService,
        private appMessageService: AppMessageService,
        private entityTreeNodeService: EntityTreeNodeService,
        private confirmationService: ConfirmationService,
        private router: Router,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.getConfiguration();
    }

    /*****************************************************************************
     Button visibility functions
    *****************************************************************************/

    public shouldApplyButtonBeDisplayed(): boolean {
        return this.configurationLoaded &&
            (this.contextBrokers.length > 0 || this.addedContextBrokerAtLeastOnce || this.removedContextBrokerAtLeastOnce);
    }

    public shouldApplyButtonBeEnabled(): boolean {
        return this.shouldApplyButtonBeDisplayed() && this.isDirtyConfiguration() && this.isValidConfiguration();
    }

    public shouldAdvertisementBeDisplayed(): boolean {
        return this.shouldApplyButtonBeEnabled();
    }

    /*****************************************************************************
     Event functions
    *****************************************************************************/

    public onAddContextBroker(): void {
        this.accordionTabsSelected = true;
        if (this.accordionTabs && this.accordionTabs.length > 0) {
            this.accordionTabs.forEach(a => a.selected = false);
        }
        this.addedContextBrokerAtLeastOnce = true;
        this.contextBrokers.push({
            header: this.configDashboardService.defaultContextName,
            form: this.configDashboardService.createContextBrokerForm(),
            historicalForm: this.configDashboardService.createHistoricalForm(),
            services: [],
            entities: [],
            selectedEntities: [],
        });
    }

    public onRemoveService(): void {
        this.removedServiceAtLeastOnce = true;
    }

    public onSelectedEntitiesChange(): void {
        this.selectedEntitiesChange = true;
    }

    public onFavChange(): void {
        this.favAttrChange = true;
    }

    public onRemoveContextBroker(cb: ContextBrokerForm, index: number): void {
        this.confirmationService.confirm({
            icon: 'pi pi-info',
            header: 'Are you sure you want to delete this Context Broker?',
            message: 'The configuration of the Context Broker "' + cb.header + '" will be deleted. ' +
                'Note that this change will only be confirmed when applying the configuration.',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            accept: (): void => {
                this.removedContextBrokerAtLeastOnce = true;
                this.contextBrokers.splice(index, 1);
            },
        });
    }

    public onApplyConfiguration(): void {
        if (this.contextBrokers.length === 0) {
            this.applyConfiguration();
        } else if (this.checkEntities() && this.checkSameUrls()) {
            const connectionCalls: Observable<any>[] = this.getConnectionCalls();
            this.executeCalls(connectionCalls);
        }
    }

    public onUrlChange(cb: ContextBrokerForm): void {
        if (this.serviceConfiguration) {
            this.serviceConfiguration.onContextBrokerUrlChange();
            cb.entities = [];
            cb.selectedEntities = [];
            cb.services.forEach(s => {
                s.entities = [];
                s.selectedEntities = [];
            });
        }
    }

    /*****************************************************************************
     Getting configuration functions
    *****************************************************************************/

    private getConfiguration(): void {
        this.configDashboardService.getConfiguration().pipe(takeUntil(this.destroy$)).subscribe(
            contextBrokers => {
                if (contextBrokers.length === 0) {
                    this.onAddContextBroker();
                } else {
                    this.loadConfiguration(contextBrokers);
                }
                this.configurationLoaded = true;
            },
            err => {
                this.appMessageService.add({ severity: 'error', summary: 'Something went wrong loading the configuration' });
            },
        );
    }

    private loadConfiguration(contextBrokers: ContextBrokerConfiguration[]): void {
        contextBrokers.forEach(cb => {
            const { treeNodes, selectedTreeNodes }: any = this.entityTreeNodeService.convertEntitiesConfToNodes(cb.entities);
            this.contextBrokers.unshift({
                header: cb.name,
                form: this.configDashboardService.createContextBrokerFormFromConfig(cb),
                historicalForm: this.configDashboardService.createHistoricalFormFromConfig(cb),
                services: this.loadServiceConfiguration(cb),
                entities: treeNodes,
                selectedEntities: selectedTreeNodes,
            });
        });
        this.closeAccordionTabs();
    }

    private loadServiceConfiguration(cb: ContextBrokerConfiguration): ServiceForm[] {
        return cb.services.map(s => {
            const { treeNodes, selectedTreeNodes }: any = this.entityTreeNodeService.convertEntitiesConfToNodes(s.entities);
            return {
                header: s.service + s.servicePath,
                form: this.configDashboardService.createServiceFormFromConfig(s),
                entities: treeNodes,
                selectedEntities: selectedTreeNodes,
            };
        });
    }

    private closeAccordionTabs(): void {
        setTimeout(() => {
            if (this.accordionTabs && this.accordionTabs.length > 0) {
                this.accordionTabs.forEach(a => a.selected = false);
            }
        });
    }

    /*****************************************************************************
     Setting configuration functions
    *****************************************************************************/

    private applyConfiguration(): void {
        const config: ContextBrokerConfiguration[] = this.getContextBrokers();
        this.configDashboardService.postConfiguration(config).pipe(takeUntil(this.destroy$)).subscribe(
            res => {
                this.onApplyConfigurationSuccess();
            },
            err => {
                this.onApplyConfigurationFail();
            });
    }

    private onApplyConfigurationSuccess(): void {
        this.appMessageService.add({ severity: 'success', summary: 'Configuration applied' });
        this.router.navigate(['/map']);
    }

    private onApplyConfigurationFail(): void {
        this.appMessageService.add({ severity: 'error', summary: 'Something went wrong applying the configuration' });
    }

    private getContextBrokers(): ContextBrokerConfiguration[] {
        return this.contextBrokers.map(cb => {
            const needServicesBool: boolean = cb.form.get('needServices').value;
            const needHistoricalDataBool: boolean = cb.form.get('needHistoricalData').value;
            return {
                name: cb.form.get('name').value,
                url: cb.form.get('url').value,
                needServices: needServicesBool,
                needHistoricalData: needHistoricalDataBool,
                cygnus: needHistoricalDataBool ? cb.historicalForm.get('cygnus').value : '',
                comet: needHistoricalDataBool ? cb.historicalForm.get('comet').value : '',
                entities: this.entityTreeNodeService.convertNodesToEntitiesConf(cb.entities, cb.selectedEntities),
                services: needServicesBool ? this.getServices(cb) : [],
            };
        });
    }

    private getServices(cb: ContextBrokerForm): ServiceConfiguration[] {
        return cb.services.map(s => {
            return {
                service: s.form.get('service').value,
                servicePath: s.form.get('servicePath').value,
                entities: this.entityTreeNodeService.convertNodesToEntitiesConf(s.entities, s.selectedEntities),
            };
        });
    }

    /*****************************************************************************
     Validation functions
    *****************************************************************************/

    private checkEntities(): boolean {
        let valid: boolean = true;
        this.contextBrokers.forEach(cb => {
            if (cb.services.length === 0) {
                if (cb.selectedEntities.length === 0) { valid = false; }
            } else {
                cb.services.forEach(s => {
                    if (s.selectedEntities.length === 0) { valid = false; }
                });
            }
        });
        if (!valid) { this.showNoSelectedEntitiesMessage(); }
        return valid;
    }

    private checkSameUrls(): boolean {
        const urlSet: Set<string> = new Set();
        this.contextBrokers.forEach(cb => {
            urlSet.add(cb.form.get('url').value);
        });
        const valid: boolean = urlSet.size === this.contextBrokers.length;
        if (!valid) { this.showSameUrl(); }
        return valid;
    }

    private getConnectionCalls(): Observable<any>[] {
        const connectionCalls: Observable<any>[] = [];

        this.contextBrokers.forEach(cb => {
            connectionCalls.push(this.configDashboardService.checkBrokerHealth(cb.form.get('url').value));
            if (cb.form.get('needHistoricalData').value) {
                if (cb.historicalForm.get('cygnus').value) {
                    connectionCalls.push(this.configDashboardService.checkCygnusHealth(cb.historicalForm.get('cygnus').value));
                }
                connectionCalls.push(this.configDashboardService.checkCometHealth(cb.historicalForm.get('comet').value));
            }
        });

        return connectionCalls;
    }

    private executeCalls(connectionCalls: Observable<any>[]): void {
        combineLatest(connectionCalls).pipe(takeUntil(this.destroy$)).subscribe(
            (combinedResults) => {
                combinedResults.every(r => r) ? this.applyConfiguration() : this.showConnectionProblem();
            },
            err => { this.showConnectionProblem(); },
        );
    }

    private showNoSelectedEntitiesMessage(): void {
        this.appMessageService.add({
            severity: 'error', summary: 'Cannot apply the configuration',
            detail: 'There is at least one Context Broker or one service with no selected entities',
        });
    }

    private showSameUrl(): void {
        this.appMessageService.add({
            severity: 'error', summary: 'Cannot apply the configuration',
            detail: 'There are two or more Context Brokers with the same URL',
        });
    }

    private showConnectionProblem(): void {
        this.appMessageService.add({
            severity: 'error', summary: 'Cannot apply the configuration',
            detail: 'There is at least one URL which is not working',
        });
    }

    private isDirtyConfiguration(): boolean {
        return this.contextBrokers.some(cb => {
            return cb.form.dirty ||
                (cb.form.get('needHistoricalData').value && cb.historicalForm.dirty) ||
                (cb.form.get('needServices').value && cb.services.some(s => s.form.dirty));
        }) || this.removedContextBrokerAtLeastOnce || this.removedServiceAtLeastOnce || this.selectedEntitiesChange || this.favAttrChange;
    }

    private isValidConfiguration(): boolean {
        return this.contextBrokers.every(cb => {
            return cb.form.valid &&
                (!cb.form.get('needHistoricalData').value || cb.historicalForm.valid) &&
                (!cb.form.get('needServices').value || (cb.services.length > 0 && cb.services.every(s => s.form.valid)));
        });
    }

    // Method not used by now, but that could be useful to mark all the configuration page as pristine
    private markFormsAsPristine(): void {
        this.addedContextBrokerAtLeastOnce = false;
        this.removedContextBrokerAtLeastOnce = false;
        this.removedServiceAtLeastOnce = false;
        this.selectedEntitiesChange = false;
        this.favAttrChange = false;
        this.contextBrokers.forEach(cb => {
            cb.form.markAsPristine();
            cb.historicalForm.markAsPristine();
            cb.services.forEach(s => s.form.markAsPristine());
        });
    }

}
