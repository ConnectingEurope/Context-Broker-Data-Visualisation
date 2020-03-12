import { browser, by, element, promise } from 'protractor';

export class AppPage {

  public navigateTo(): promise.Promise<any> {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  public getTitleText(): Promise<string> {
    return element(by.css('app-root .content span')).getText() as Promise<string>;
  }

}
