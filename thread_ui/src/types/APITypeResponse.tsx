interface RegisterAPIResponse {
  message: string;
  statusCode?: number;
}

interface LoginAPIResponse {
  id: number;
  message?: string;
  statusCode?: number;
  accessToken: string;
  refreshToken: string;
  needMoreInfoUser: boolean;
  username: string;
}

interface AddInformationAPIResponse extends RegisterAPIResponse {}

export type {
  RegisterAPIResponse,
  LoginAPIResponse,
  AddInformationAPIResponse,
};
