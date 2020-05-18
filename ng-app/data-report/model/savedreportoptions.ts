export class FKPReportReqDTO {
  shopId: string;
  userId: string;
  skeletonContractNo: string;
  reportType?: string;
  shopName?: string;
}

export class SavedReportOptions extends FKPReportReqDTO {
  reportName: string;
  searchOptions: string;
  columnFilterOptions: string;
  columnSortOptions: string;
}