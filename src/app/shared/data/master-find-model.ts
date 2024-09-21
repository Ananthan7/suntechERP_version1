export interface MasterSearchModel {
    PAGENO?: number,
    RECORDS?: number,
    LOOKUPID?: number,
    SEARCH_HEADING?: string;
    ORDER_TYPE?: number,
    WHERECONDITION?: string,
    SEARCH_FIELD?: string;
    SEARCH_VALUE?: string;
    VIEW_ICON?: boolean;
    VIEW_INPUT?: boolean;
    VIEW_TABLE?: boolean;
    LOAD_ONCLICK?: boolean;
    API_VALUE?: string;
    FRONTENDFILTER?: boolean;
}