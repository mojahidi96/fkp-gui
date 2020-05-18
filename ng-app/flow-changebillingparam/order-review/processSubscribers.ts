export class SubscriberReqType {
    type: string;
    voId: string;
    clientOrderId: string;
    orderType: string;
    subActions: Array<SubsDetails>;

}

export class SubsDetails {
    subNumber: string;
    callDetailType: string;
    digitMasked: string;
    oldCallDetailType: string;
    oldDigitMasked: string;
    ban: string;
}

export enum columnEnum {
    ban = 1,
    callDetailType = 41,
    digitMasked = 42,
    subscriberNo = 2,
    subAddress = 12,
    subName = 9
}
