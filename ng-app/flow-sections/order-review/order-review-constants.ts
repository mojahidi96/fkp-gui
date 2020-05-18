import {OrderReviewService} from './order-review.service';

export class OrderReviewConstants {
  public static eligibleSummaryCalls(orderReviewService: OrderReviewService, orderType: string) {
    if (orderType === 'PROLONG_SUBSCRIBER') {
      return [
        orderReviewService.getTariffSummary(),
        orderReviewService.getExistingTariffSubCount(),
        orderReviewService.getDEPDetailsForHandy(),
        orderReviewService.getHandySummary(),
        orderReviewService.getSocSummary()
      ];
    }
    if (orderType === 'ACTIVATE_SUBSCRIBER') {
      return [
        orderReviewService.getTariffSummary(),
        orderReviewService.getExistingTariffSubCount(),
        orderReviewService.getDEPDetailsForHandy(),
        orderReviewService.getHandySummary(),
        orderReviewService.getSocSummary(),
        orderReviewService.getBANSummary(),
        orderReviewService.getSubsSummary(),
      ];
    }
    if (orderType === 'MA_CHANGE_TARIFF') {
      return [
        orderReviewService.getTariffSummary(),
        orderReviewService.getExistingTariffSubCount()
      ];
    }
  }
}
