import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, OnInit, ViewChild } from '@angular/core';
import { ConfigDashboardService } from '../../services/config-dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { ContextBrokerForm, ServiceForm } from '../../models/context-broker-form';
import { EntityDto } from '../../models/entity-dto';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { AccordionTab } from 'primeng/accordion/accordion';
import { SubscriptionsDialogComponent, ContextSubscription } from '../subscriptions-dialog/subscriptions-dialog.component';
import { EntityTreeNodeService } from '../../services/entity-tree-node.service';
import { TreeNodeService } from 'src/app/shared/services/tree-node.service';

@Component({
    selector: 'app-service-configuration',
    templateUrl: './service-configuration.component.html',
    styleUrls: ['./service-configuration.component.scss'],
})
export class ServiceConfigurationComponent extends BaseComponent implements OnInit {

    @Input() public cb: ContextBrokerForm;
    @Output() public removeServiceEvent: EventEmitter<number> = new EventEmitter<number>();
    @Output() public selectedEntitiesChange: EventEmitter<void> = new EventEmitter<void>();
    @Output() public favChange: EventEmitter<void> = new EventEmitter<void>();

    public chooseWarningVisible: boolean;
    public subsWarningVisible: boolean;
    public displaySubs: boolean;
    public displaySubsContent: any[];
    public accordionTabsSelected: boolean = false;

    @ViewChildren('accordionTab') private accordionTabs: QueryList<AccordionTab>;
    @ViewChild('subscriptionDialog') private subscriptionDialog: SubscriptionsDialogComponent;

    constructor(
        private configDashboardService: ConfigDashboardService,
        private treeNodeService: TreeNodeService,
        private entityTreeNodeService: EntityTreeNodeService,
        private confirmationService: ConfirmationService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.cb.services.length === 0 ? this.onAddService() : this.closeAccordionTabs();
    }

    /*****************************************************************************
     Event functions
    *****************************************************************************/

    public onContextBrokerUrlChange(): void {
        this.chooseWarningVisible = false;
        this.subsWarningVisible = false;
    }

    public onAddService(): void {
        this.accordionTabsSelected = true;
        if (this.accordionTabs && this.accordionTabs.length > 0) {
            this.accordionTabs.forEach(a => a.selected = false);
        }
        this.cb.services.push({
            header: this.configDashboardService.defaulServiceHeader,
            form: this.configDashboardService.createServiceForm(),
            entities: [],
            selectedEntities: [],
        });
    }

    public onRemoveService(index: number): void {
        this.confirmationService.confirm({
            icon: 'pi pi-info',
            header: 'Are you sure you want to delete this service?',
            message: 'The configuration of the service "' + this.cb.services[index].header +
                '" will be deleted. Note that this change will only be confirmed when applying the configuration.',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            accept: (): void => {
                this.removeServiceEvent.emit(index);
                this.cb.services.splice(index, 1);
            },
        });
    }

    public onServiceConfigChange(index: number): void {
        this.chooseWarningVisible = false;
        this.subsWarningVisible = false;
        const service: string = this.cb.services[index].form.value.service;
        const servicePath: string = this.cb.services[index].form.value.servicePath;
        const header: string = service + (service && servicePath &&
            this.cb.services[index].form.get('servicePath').valid ? servicePath : '');
        this.cb.services[index].header = header && !/^\s+$/.test(service) ? header :
            this.configDashboardService.serviceHeaderWhenEmpty;
    }

    public onSelectedEntitiesChange(selectedEntities: TreeNode[], index: number): void {
        this.cb.services[index].selectedEntities = selectedEntities;
        this.selectedEntitiesChange.emit();
    }

    public onFavChange(): void {
        this.favChange.emit();
    }

    public onChooseEntities(index: number): void {
        const url: string = this.cb.form.value.url;
        const service: string = this.cb.services[index].form.value.service;
        const servicePath: string = this.cb.services[index].form.value.servicePath;

        this.configDashboardService.getEntitiesFromService(url, service, servicePath).pipe(takeUntil(this.destroy$)).subscribe(
            entities => {
                entities.length > 0 ? this.onChooseEntitiesSuccess(entities, index) : this.onChooseEntitiesFail(index);
            },
            err => {
                this.onChooseEntitiesFail(index);
            });
    }

    public onClickSubscriptions(i: number): void {
        this.configDashboardService.getSubscriptions(this.cb.form.get('url').value,
            this.cb.services[i].form.get('service').value,
            this.cb.services[i].form.get('servicePath').value,
        ).pipe(takeUntil(this.destroy$)).subscribe(
            subs => {
                if (subs.length > 0) {
                    this.onClickSubscriptionsSuccess(subs);
                } else {
                    this.onClickSubscriptionsFail();
                }
            },
            err => {
                this.onClickSubscriptionsFail();
            },
        );
    }

    /*****************************************************************************
     Button visibility functions
    *****************************************************************************/

    public shouldChooseButtonBeDisabled(index: number): boolean {
        return this.cb.form.get('url').invalid ||
            this.cb.services[index].form.get('service').invalid ||
            this.cb.services[index].form.get('servicePath').invalid;
    }

    public shouldSubsButtonBeDisabled(index: number): boolean {
        return this.shouldChooseButtonBeDisabled(index);
    }

    /*****************************************************************************
     Choose entities functions
    *****************************************************************************/

    private onChooseEntitiesSuccess(entities: EntityDto[], index: number): void {
        this.chooseWarningVisible = false;
        this.cb.services[index].entities = this.entityTreeNodeService.getEntities(entities);
        this.cb.services[index].selectedEntities = this.treeNodeService.getAllSelected(this.cb.services[index].entities);
        this.selectedEntitiesChange.emit();
    }

    private onChooseEntitiesFail(index: number): void {
        this.chooseWarningVisible = true;
        this.cb.services[index].entities = [];
        this.cb.services[index].selectedEntities = [];
    }

    /*****************************************************************************
     Subscriptions functions
    *****************************************************************************/

    private onClickSubscriptionsSuccess(subs: any[]): void {
        this.subsWarningVisible = false;
        this.subscriptionDialog.updateContent(subs);
        this.displaySubs = true;
    }

    private onClickSubscriptionsFail(): void {
        this.subsWarningVisible = true;
    }

    /*****************************************************************************
     Accordion functions
    *****************************************************************************/

    private closeAccordionTabs(): void {
        setTimeout(() => {
            if (this.accordionTabs && this.accordionTabs.length > 0) {
                this.accordionTabs.forEach(a => a.selected = false);
            }
        });
    }

}
