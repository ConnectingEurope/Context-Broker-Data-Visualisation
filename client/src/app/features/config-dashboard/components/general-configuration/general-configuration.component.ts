import { Component, Input, OnDestroy, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ConfigDashboardService } from '../../services/config-dashboard-service/config-dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { LayerService } from 'src/app/features/map-dashboard/services/layer-service/layer-service';
import { ContextBrokerForm } from '../../models/context-broker-form';
import { EntityDto } from '../../models/entity-dto';
import { ScrollPanel } from 'primeng/scrollpanel';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { InputWithValidationComponent } from 'src/app/shared/templates/input-with-validation/input-with-validation.component';

@Component({
    selector: 'app-general-configuration',
    templateUrl: './general-configuration.component.html',
    styleUrls: ['./general-configuration.component.scss'],
})
export class GeneralConfigurationComponent extends BaseComponent implements OnDestroy {

    @Input() public cb: ContextBrokerForm;
    @Output() public selectedEntitiesChange: EventEmitter<void> = new EventEmitter<void>();
    @Output() public urlChange: EventEmitter<void> = new EventEmitter<void>();

    protected chooseWarningVisible: boolean;

    @ViewChild('entitiesScroll', { static: false }) private entitiesScroll: ScrollPanel;
    @ViewChild('urlInput', { static: false }) private urlInput: InputWithValidationComponent;

    constructor(
        private configDashboardService: ConfigDashboardService,
        private appMessageService: AppMessageService,
        private layerService: LayerService,
    ) {
        super();
    }

    protected onNameChange(): void {
        const header: string = this.cb.form.value.name;
        this.cb.header = header && !/^\s+$/.test(header) ? header : this.configDashboardService.contextHeaderWhenEmpty;
    }

    protected onUrlChange(): void {
        this.chooseWarningVisible = false;
        this.urlChange.emit();
    }

    protected onNodeChange(): void {
        this.selectedEntitiesChange.emit();
    }

    protected refreshScroll(): void {
        setTimeout(() => {
            this.entitiesScroll.refresh();
        });
    }

    protected onCheckContextBroker(): void {
        const url: string = this.cb.form.value.url;

        this.configDashboardService.checkBrokerHealth(url).pipe(takeUntil(this.destroy$)).subscribe(
            isLive => {
                isLive ? this.onCheckContextBrokerSuccess() : this.onCheckContextBrokerFail();
            },
            err => {
                this.onCheckContextBrokerFail();
            });
    }

    protected isDisabledChooseButton(): boolean {
        return this.cb.form.get('url').invalid;
    }

    protected onChooseEntities(): void {
        const url: string = this.cb.form.value.url;

        this.configDashboardService.getEntitiesFromService(url).pipe(takeUntil(this.destroy$)).subscribe(
            entities => {
                entities.length > 0 ? this.onChooseEntitiesSuccess(entities) : this.onChooseEntitiesFail();
            },
            err => {
                this.onChooseEntitiesFail();
            });
    }

    private onCheckContextBrokerSuccess(): void {
        this.urlInput.showInfo();
    }

    private onCheckContextBrokerFail(): void {
        this.urlInput.showWarning();
    }

    private onChooseEntitiesSuccess(entities: EntityDto[]): void {
        this.chooseWarningVisible = false;
        this.cb.entities = this.layerService.getEntities(entities);
        this.cb.selectedEntities = this.layerService.getAllSelected(this.cb.entities);
        this.selectedEntitiesChange.emit();
    }

    private onChooseEntitiesFail(): void {
        this.cb.entities = [];
        this.cb.selectedEntities = [];
        this.chooseWarningVisible = true;
    }

}
