import { Component, Input, OnDestroy } from '@angular/core';
import { ConfigDashboardService } from '../../services/config-dashboard-service/config-dashboard.service';
import { MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { LayerService } from 'src/app/features/map-dashboard/services/layer-service/layer-service';
import { ContextBrokerConfiguration } from '../../models/context-broker-configuration';
import { EntityDto } from '../../models/entity-dto';

@Component({
  selector: 'app-general-configuration',
  templateUrl: './general-configuration.component.html',
  styleUrls: ['./general-configuration.component.scss'],
})
export class GeneralConfigurationComponent extends BaseComponent implements OnDestroy {

  @Input() public cb: ContextBrokerConfiguration;

  constructor(
    private configDashboardService: ConfigDashboardService,
    private messageService: MessageService,
    private layerService: LayerService,
  ) {
    super();
  }

  protected onNameChange(): void {
    this.cb.header = this.cb.form.value.name;
  }

  protected onCheckContextBroker(): void {
    const url: string = this.cb.form.value.url;

    this.configDashboardService.checkBrokerHealth(url).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res && res.statusCode === 200 && res.body && res.body.orion) {
        this.onCheckContextBrokerSuccess();
      } else {
        this.onCheckContextBrokerFail();
      }
    }, err => {
      this.onCheckContextBrokerFail();
    });
  }

  protected onChooseEntities(): void {
    const url: string = this.cb.form.value.url;

    this.configDashboardService.getEntitiesFromService(url).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res && res.statusCode === 200 && res.body && res.body.length > 0) {
        this.onGetEntitiesSuccess(res.body);
      } else {
        this.onGetEntitiesFail();
      }
    }, err => {
      this.onGetEntitiesFail();
    });
  }

  private onCheckContextBrokerSuccess(): void {
    this.messageService.clear();
    this.messageService.add({ severity: 'success', summary: 'Context Broker is live!' });
  }

  private onCheckContextBrokerFail(): void {
    this.messageService.clear();
    this.messageService.add({ severity: 'error', summary: 'Cannot find Context Broker' });
  }

  private onGetEntitiesSuccess(entities: EntityDto[]): void {
    this.cb.entities = this.layerService.getEntities(entities);
    this.cb.selectedEntities = this.layerService.getAllLayers(this.cb.entities);
  }

  private onGetEntitiesFail(): void {
    this.messageService.clear();
    this.messageService.add({ severity: 'warn', summary: 'Entities not found', detail: 'Maybe you have entities in specific services' });
  }

}
