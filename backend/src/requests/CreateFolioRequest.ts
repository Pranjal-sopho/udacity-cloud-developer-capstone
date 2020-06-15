import { integer } from "aws-sdk/clients/cloudfront";

/**
 * Fields in a request to create a single Diary item.
 */
export interface CreateFolioRequest {
  name: string
  buyDate: string
  volume: integer
  price: number
}
