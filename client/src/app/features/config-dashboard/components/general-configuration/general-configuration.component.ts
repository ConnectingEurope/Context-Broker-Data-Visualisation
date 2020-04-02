import { Component, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfigDashboardService } from '../../services/config-dashboard-service/config-dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { LayerService } from 'src/app/features/map-dashboard/services/layer-service/layer-service';
import { ContextBrokerForm } from '../../models/context-broker-form';
import { EntityDto } from '../../models/entity-dto';
import { ScrollPanel } from 'primeng/scrollpanel';
import { AppMessageService } from 'src/app/shared/services/app-message-service';

@Component({
  selector: 'app-general-configuration',
  templateUrl: './general-configuration.component.html',
  styleUrls: ['./general-configuration.component.scss'],
})
export class GeneralConfigurationComponent extends BaseComponent implements OnDestroy {

  @Input() public cb: ContextBrokerForm;

  @ViewChild('entitiesScroll', { static: false }) private entitiesScroll: ScrollPanel;

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

  protected refreshEntitiesScroll(): void {
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
        entities.length > 0 ? this.onGetEntitiesSuccess(entities) : this.onGetEntitiesFail();
      },
      err => {
        this.onGetEntitiesFail();
      });
  }

  private onCheckContextBrokerSuccess(): void {
    this.appMessageService.add({ severity: 'success', summary: 'Connection succeded!' });
  }

  private onCheckContextBrokerFail(): void {
    this.appMessageService.add({ severity: 'error', summary: 'Cannot find Context Broker' });
  }

  private onGetEntitiesSuccess(entities: EntityDto[]): void {
    this.cb.entities = this.layerService.getEntities(entities);
    this.cb.selectedEntities = this.layerService.getAllSelected(this.cb.entities);
  }

  private onGetEntitiesFail(): void {
    this.cb.entities = [];
    this.cb.selectedEntities = [];
    this.appMessageService.add({ severity: 'warn', summary: 'Entities not found', detail: 'Maybe you have entities in specific services' });
  }

}
