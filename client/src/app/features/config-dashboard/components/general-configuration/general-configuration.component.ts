import { Component, Input, OnDestroy } from '@angular/core';
import { ConfigDashboardService } from '../../services/config-dashboard-service/config-dashboard.service';
import { MessageService } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';

@Component({
  selector: 'app-general-configuration',
  templateUrl: './general-configuration.component.html',
  styleUrls: ['./general-configuration.component.scss'],
})
export class GeneralConfigurationComponent extends BaseComponent implements OnDestroy {

  @Input() public cb: any;

  constructor(
    private configDashboardService: ConfigDashboardService,
    private messageService: MessageService,
  ) {
    super();
  }

  protected onGeneralConfigChange(): void {
    const name: string = this.cb.form.value.name;
    const url: string = this.cb.form.value.url;
    const port: string = this.cb.form.value.port;

    this.cb.header = name + (name && url ? ' - ' + url : '') + (name && url && port ? ':' + port : '');
  }

  protected onCheckContextBroker(): void {
    const url: string = this.cb.form.value.url;
    const port: string = this.cb.form.value.port;

    this.configDashboardService.checkContextBrokerHealth(url, port).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res && res.statusCode === 200 && res.body && res.body.orion) {
        this.onCheckContextBrokerSuccess();
      } else {
        this.onCheckContextBrokerSuccess();
      }
    }, err => {
      this.onCheckContextBrokerFail();
    });
  }

  private onCheckContextBrokerSuccess(): void {
    this.messageService.clear();
    this.messageService.add({ severity: 'success', summary: 'Context Broker is live!' });
  }

  private onCheckContextBrokerFail(): void {
    this.messageService.clear();
    this.messageService.add({ severity: 'error', summary: 'Cannot find the Context Broker' });
  }

}
