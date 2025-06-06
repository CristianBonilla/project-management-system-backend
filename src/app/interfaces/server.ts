export interface ServerError {
  status: number;
  message: string;
}

export type ServerMessageHandler = (error: any, success: string | null) => void;
