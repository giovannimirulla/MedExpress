import { OrderResponse } from './OrderResponse';

export interface OrderSocket extends OrderResponse {
    updatedAtString: string;
  }