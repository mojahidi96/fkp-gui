export class CommentsHistoryConstants {

  public static cols = {MASTER_TXT: [
    {title: 'COMMENTS-COL-DATE', field: 'timestamp', type: 'date', show: true, sortable: false, filter: false},
    {title: 'COMMENTS-COL-COMMENT', field: 'transComment', show: true, sortable: false, filter: false}
  ],
    FREE_TXT: [
      {title: 'COMMENTS-COL-DATE', field: 'createdTs', type: 'date', show: true, sortable: false, filter: false},
      {title: 'COMMENTS-COL-COMMENT', field: 'comments', show: true, sortable: false, filter: false}
    ]};
  public static get_urls = {MASTER_TXT: 'getmasterfreetext', FREE_TXT: 'getinternalcomments'};
  public static post_urls = {MASTER_TXT: 'savemasterfreetext', FREE_TXT: 'saveinternalcomments'};

}
