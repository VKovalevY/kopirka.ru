export interface jobInfo {
  jobId: string;
  jobName: string;
  jobType: 'Copy'
      | 'Print'
      | 'WorkflowScanning'
      | 'IncomingFax'
      | 'FaxSend'
      | 'Email'
      | 'InternetFaxReceive'
      | 'InternetFaxSend'
      | 'ReportJob'
      | 'FaxSendFromPc'
      | 'EmbeddedFaxReceive'
      | 'EmbeddedFaxSend'
      | 'SecurePrint'
      | 'PrintFiles'
      | 'WorkflowJob',
  jobState: 'Pending' | 'PendingHeld' | 'Processing' | 'Paused' | 'ProcessingStopped' | 'Canceled' | 'Aborted' | 'Completed',
  jobStateReasons: string[],
  dateTimeAtCompleted: Date,
  dateTimeAtCreation: Date
}
