import { apiEndpoint } from '../config'
import { Folio } from '../types/Folio';
import { CreateFolioRequest } from '../types/CreateFolioRequest';
import Axios from 'axios'
//import { UpdateFolioRequest } from '../types/UpdateFolioRequest';

export async function getFolios(idToken: string): Promise<Folio[]> {
  console.log('Fetching Folios....')

  const response = await Axios.get(`${apiEndpoint}/folios`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('(response.data) Folios:', response.data.items)
  return response.data.items
}

export async function createFolio(
  idToken: string,
  newFolio: CreateFolioRequest
): Promise<Folio> {
  const response = await Axios.post(`${apiEndpoint}/folios`,  JSON.stringify(newFolio), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log("response after creation:", response)
  console.log("response.data:",response.data)
  console.log("response.data.result:",response.data.result)
  return response.data.newItem
}
/*
export async function patchFolio(
  idToken: string,
  FolioId: string,
  updatedFolio: UpdateFolioRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/Folios/${FolioId}`, JSON.stringify(updatedFolio), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}
*/
export async function deleteFolio(
  idToken: string,
  FolioId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/folios/${FolioId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

