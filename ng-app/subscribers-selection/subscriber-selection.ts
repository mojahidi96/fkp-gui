import {Column} from '../sncr-components/sncr-datatable/column';

export class SubscriberType extends Column {
    active? = false;
    name: string;
    url: string;
}