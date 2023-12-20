import { isAxiosError } from "axios";

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

  setInProgress() {
    this.status = "inProgress";
  }

  setFailureFromError(error: any, errorMessages: Array<{ statusCode: number; details: string; message: string }>) {
    if (isAxiosError(error) && error.response) {
      for (const errMsg of errorMessages) {
        const detailsMatch =
          error.response.data.details && errMsg.details != "" ? error.response.data.details === errMsg.details : true;
        const codeMatch = error.response.status === errMsg.statusCode;
        if (detailsMatch && codeMatch) {
          this.setFailure(errMsg.message);
          return;
        }
      }
    } else {
      this.setFailure("Unexpected error has occurred.");
    }
  }
}
