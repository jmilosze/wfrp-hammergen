export class SubmissionState {
  status: "notStarted" | "inProgress" | "success" | "failure";
  message: string;

  constructor() {
    this.status = "notStarted";
    this.message = "";
  }

  reset() {
    this.status = "notStarted";
    this.message = "";
  }

  setSuccess(message: string) {
    this.status = "success";
    this.message = message;
  }

  setFailure(message: string) {
    this.status = "failure";
    this.message = message;
  }
}
