import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, OnInit, ViewChild } from '@angular/core';
import { ConfigDashboardService } from '../../services/config-dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { ContextBrokerForm, ServiceForm } from '../../models/context-broker-form';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { AccordionTab } from 'primeng/accordion/accordion';
import { SubscriptionsDialogComponent, ContextSubscription } from '../subscriptions-dialog/subscriptions-dialog.component';
import { EntityTreeNodeService } from '../../services/entity-tree-node.service';
import { TreeNodeService } from 'src/app/shared/services/tree-node.service';
import { TypeContainerDto } from '../../models/type-container-dto';

@Component({
    selector: 'app-service-configuration',
    templateUrl: './service-configuration.component.html',
    styleUrls: ['./service-configuration.component.scss'],
})
export class ServiceConfigurationComponent extends BaseComponent implements OnInit {

    @Input() public cb: ContextBrokerForm;
    @Output() public removeServiceEvent: EventEmitter<void> = new EventEmitter<void>();
    @Output() public selectedEntitiesChange: EventEmitter<void> = new EventEmitter<void>();
    @Output() public favChange: EventEmitter<void> = new EventEmitter<void>();

    public chooseWarningVisible: boolean;
    public subsWarningVisible: boolean;
    public displaySubs: boolean;
    public displaySubsContent: ContextSubscription[];
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

    public onRemoveService(s: ServiceForm, index: number): void {
        this.confirmationService.confirm({
            icon: 'pi pi-info',
            header: 'Are you sure you want to delete this service?',
            message: 'The configuration of the service "' + s.header +
                '" will be deleted. Note that this change will only be confirmed when applying the configuration.',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            accept: (): void => {
                this.removeServiceEvent.emit();
                this.cb.services.splice(index, 1);
            },
        });
    }

    public onServiceConfigChange(s: ServiceForm): void {
        this.chooseWarningVisible = false;
        this.subsWarningVisible = false;
        s.entities = [];
        s.selectedEntities = [];
        const service: string = s.form.value.service;
        const servicePath: string = s.form.value.servicePath;
        const header: string = service + (service && servicePath &&
            s.form.get('servicePath').valid ? servicePath : '');
        s.header = header && !/^\s+$/.test(service) ? header :
            this.configDashboardService.serviceHeaderWhenEmpty;
    }

    public onSelectedEntitiesChange(selectedEntities: TreeNode[], s: ServiceForm): void {
        s.selectedEntities = selectedEntities;
        this.selectedEntitiesChange.emit();
    }

    public onFavChange(): void {
        this.favChange.emit();
    }

    public onChooseEntities(s: ServiceForm): void {
        const url: string = this.cb.form.value.url;
        const service: string = s.form.value.service;
        const servicePath: string = s.form.value.servicePath;

        this.configDashboardService.getEntitiesFromService(url, service, servicePath).pipe(takeUntil(this.destroy$)).subscribe(
            types => {
                types.length > 0 ? this.onChooseEntitiesSuccess(types, s) : this.onChooseEntitiesFail(s);
            },
            err => {
                this.onChooseEntitiesFail(s);
            });
    }

    public onClickSubscriptions(s: ServiceForm): void {
        this.configDashboardService.getSubscriptions(this.cb.form.get('url').value,
            s.form.get('service').value,
            s.form.get('servicePath').value,
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

    public shouldChooseButtonBeDisabled(s: ServiceForm): boolean {
        return this.cb.form.get('url').invalid ||
            s.form.get('service').invalid ||
            s.form.get('servicePath').invalid;
    }

    public shouldSubsButtonBeDisabled(s: ServiceForm): boolean {
        return this.shouldChooseButtonBeDisabled(s);
    }

    /*****************************************************************************
     Choose entities functions
    *****************************************************************************/

    private onChooseEntitiesSuccess(types: TypeContainerDto[], s: ServiceForm): void {
        this.chooseWarningVisible = false;
        s.entities = this.entityTreeNodeService.convertEntitiesToNodes(types);
        s.selectedEntities = this.treeNodeService.getAllSelected(s.entities);
        this.selectedEntitiesChange.emit();
    }

    private onChooseEntitiesFail(s: ServiceForm): void {
        this.chooseWarningVisible = true;
        s.entities = [];
        s.selectedEntities = [];
    }

    /*****************************************************************************
     Subscriptions functions
    *****************************************************************************/

    private onClickSubscriptionsSuccess(subs: ContextSubscription[]): void {
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
