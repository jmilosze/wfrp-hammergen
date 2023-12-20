export type SubmissionState = {
  status: "notStarted" | "inProgress" | "success" | "failure";
  message: string;
};
