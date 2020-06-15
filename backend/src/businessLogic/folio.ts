import * as uuid from 'uuid'

import { FolioItem } from '../models/FolioItem'
import { FolioAccess } from '../dataLayer/FolioAccess'
import { CreateFolioRequest } from '../requests/CreateFolioRequest'
//import { UpdatefolioRequest } from '../requests/UpdatefolioRequest'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'

const logger = createLogger('folios')

const folioAccess = new FolioAccess()

export const getAllfolios = async (jwtToken: string): Promise<FolioItem[]> => {
  const userId = parseUserId(jwtToken)

  return await folioAccess.getAllFolios(userId)
}

export const createFolio = async (
  createFolioRequest: CreateFolioRequest,
  jwtToken: string
): Promise<FolioItem> => {
  logger.info('In createfolio() function')

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await folioAccess.createFolio({
    folioId: itemId,
    userId,
    name: createFolioRequest.name,
    buyDate: createFolioRequest.buyDate,
    volume: createFolioRequest.volume,
    price: createFolioRequest.price
  })
}
/*
export const updatefolio = async (
  folioId: string,
  updatefolioRequest: UpdatefolioRequest,
  jwtToken: string
): Promise<FolioItem> => {
  logger.info('In updatefolio() function')

  const userId = parseUserId(jwtToken)
  logger.info('User Id: ' + userId)

  return await folioAccess.updatefolio({
    folioId,
    userId,
    name: updatefolioRequest.name,
    buyDate: updatefolioRequest.buyDate,
    done: updatefolioRequest.done,
    createdAt: new Date().toISOString()
  })
}
*/
export const deleteFolio = async (
  folioId: string,
  jwtToken: string
): Promise<string> => {
  logger.info('In deletefolio() function')

  const userId = parseUserId(jwtToken)
  logger.info('User Id: ' + userId)

  return await folioAccess.deletefolio(folioId, userId)
}
/*
export const generateUploadUrl = async (folioId: string): Promise<string> => {
  logger.info('In generateUploadUrl() function')

  return await folioAccess.generateUploadUrl(folioId)
} */
