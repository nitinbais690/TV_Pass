export interface EntitlementResponse {
    message: string;
    ovatToken: string;
    AccountServiceMessage: Entitlement[];
}

export interface Entitlement {
    isContent: boolean;
    serviceName: string;
    serviceID: string;
    startDate: number;
    validityTill: number;
    description: string;
    validityEndDate: string;
    status: string;
    name: string;
    isUpgradeAllowed: boolean;
    isRenewal: boolean;
}
