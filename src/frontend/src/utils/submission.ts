import { isAxiosError } from "axios";

export class SubmissionState {
  status: "notStarted" | "validationError" | "inProgress" | "success" | "failure";
  message: string;

  constructor() {
    this.status = "notStarted";
    this.message = "";
  }

  notStartedOrSubmitted(): boolean {
    return this.status == "notStarted" || this.status == "success" || this.status == "failure";
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
    this.message = "";
  }

  setValidationError() {
    this.status = "validationError";
    this.message = "";
  }

  setFailureFromError(error: any, errorMessages: { statusCode: number; details: string; message: string }[] = []) {
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
    }
    this.setFailure("Unexpected error has occurred.");
  }
}
