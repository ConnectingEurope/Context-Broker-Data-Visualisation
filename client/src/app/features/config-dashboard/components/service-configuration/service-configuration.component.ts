import { Component, Input, ViewChild, Output, EventEmitter, ViewChildren, QueryList, OnInit, AfterViewInit } from '@angular/core';
import { ConfigDashboardService } from '../../services/config-dashboard-service/config-dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { LayerService } from 'src/app/features/map-dashboard/services/layer-service/layer-service';
import { ContextBrokerForm } from '../../models/context-broker-form';
import { EntityDto } from '../../models/entity-dto';
import { ScrollPanel } from 'primeng/scrollpanel/public_api';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { ConfirmationService } from 'primeng/api';
import { InputWithValidationComponent } from 'src/app/shared/templates/input-with-validation/input-with-validation.component';
import { AccordionTab } from 'primeng/accordion/accordion';

@Component({
    selector: 'app-service-configuration',
    templateUrl: './service-configuration.component.html',
    styleUrls: ['./service-configuration.component.scss'],
})
export class ServiceConfigurationComponent extends BaseComponent implements OnInit {

    @Input() public cb: ContextBrokerForm;
    @Output() public removeServiceEvent: EventEmitter<number> = new EventEmitter<number>();
    @Output() public selectedEntitiesChange: EventEmitter<void> = new EventEmitter<void>();

    protected chooseWarningVisible: boolean;

    @ViewChild('entitiesScroll', { static: false }) private entitiesScroll: ScrollPanel;
    @ViewChildren('accordionTab') private accordionTabs: QueryList<AccordionTab>;

    constructor(
        private configDashboardService: ConfigDashboardService,
        private layerService: LayerService,
        private confirmationService: ConfirmationService,
    ) {
        super();
    }

    public ngOnInit(): void {
        if (this.cb.services.length === 0) {
            this.onAddService();
        } else {
            setTimeout(() => {
                if (this.accordionTabs && this.accordionTabs.length > 0) {
                    this.accordionTabs.forEach(a => a.selected = false);
                }
            });
        }
    }

    public onContextBrokerUrlChange(): void {
        this.chooseWarningVisible = false;
    }

    protected onAddService(): void {
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

    protected onRemoveService(index: number): void {
        this.confirmationService.confirm({
            icon: 'pi pi-info',
            header: 'Are you sure you want to delete this service?',
            message: 'The configuration of the service "' + this.cb.services[index].header +
                '" will be deleted. Note that this change will only be confirmed when applying the configuration',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            accept: (): void => {
                this.removeService(index);
            },
        });
    }

    protected onServiceConfigChange(index: number): void {
        this.chooseWarningVisible = false;
        const service: string = this.cb.services[index].form.value.service;
        const servicePath: string = this.cb.services[index].form.value.servicePath;
        const header: string = service + (service && servicePath &&
            this.cb.services[index].form.get('servicePath').valid ? servicePath : '');
        this.cb.services[index].header = header && !/^\s+$/.test(service) ? header :
            this.configDashboardService.serviceHeaderWhenEmpty;
    }

    protected onNodeChange(): void {
        this.selectedEntitiesChange.emit();
    }

    protected refreshScroll(): void {
        setTimeout(() => {
            this.entitiesScroll.refresh();
        });
    }

    protected isDisabledChooseButton(index: number): boolean {
        return this.cb.form.get('url').invalid ||
            this.cb.services[index].form.get('service').invalid ||
            this.cb.services[index].form.get('servicePath').invalid;
    }

    protected onChooseEntities(index: number): void {
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

    private removeService(index: number): void {
        this.removeServiceEvent.emit(index);
        this.cb.services.splice(index, 1);
    }

    private onChooseEntitiesSuccess(entities: EntityDto[], index: number): void {
        this.chooseWarningVisible = false;
        this.cb.services[index].entities = this.layerService.getEntities(entities);
        this.cb.services[index].selectedEntities = this.layerService.getAllSelected(this.cb.services[index].entities);
        this.selectedEntitiesChange.emit();
    }

    private onChooseEntitiesFail(index: number): void {
        this.cb.services[index].entities = [];
        this.chooseWarningVisible = true;
    }

}
