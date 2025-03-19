export enum ErrorCode {
	UserReject = 4001
}

export interface ErrorMessage {
	code: ErrorCode;
	message: string;
}
