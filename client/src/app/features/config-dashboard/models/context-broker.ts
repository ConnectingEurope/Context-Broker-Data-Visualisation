export interface ContextBrokerEntity {
    type: string;
    attrs: string[];
}

export interface ContextBrokerService {
    service: string;
    servicePath: string;
    entities: ContextBrokerEntity[];
}

export interface ContextBroker {
    url: string;
    cygnus: string;
    comet: string;
    services: ContextBrokerService[];
}

export interface Configuration {
    contextBrokers: ContextBroker[];
}
