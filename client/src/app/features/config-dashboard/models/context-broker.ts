export interface ContextBrokerEntity {
    name: string;
    selected: boolean;
    attrs: {
        name: string;
        selected: boolean;
    }[];
}

export interface ContextBrokerService {
    service: string;
    servicePath: string;
    entities: ContextBrokerEntity[];
}

export interface ContextBroker {
    name: string;
    url: string;
    cygnus: string;
    comet: string;
    services: ContextBrokerService[];
}

export interface Configuration {
    contextBrokers: ContextBroker[];
}
