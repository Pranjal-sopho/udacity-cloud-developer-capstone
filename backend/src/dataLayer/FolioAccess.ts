import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { createLogger } from '../utils/logger'
import { FolioItem } from '../models/FolioItem'

//let XAWS

const  XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('folio-access')

export class FolioAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly folioTable = process.env.FOLIO_TABLE,
    //private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly indexName = process.env.FOLIO_TABLE_IDX
  ) {
    //
  }

  async getAllFolios(userId: string): Promise<FolioItem[]> {
    logger.info('Getting all items in portfolio..')

    const result = await this.docClient
      .query({
        TableName: this.folioTable,
        IndexName: this.indexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      })
      .promise()

    const items = result.Items

    return items as FolioItem[]
  }

  async createFolio(folio: FolioItem): Promise<FolioItem> {
    logger.info(`Creating a folio with ID ${folio.folioId}`)

    //const newItem = {
    //  ...folio,
    //  attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${folio.folioId}`
    //}

    await this.docClient
      .put({
        TableName: this.folioTable,
        Item: folio
      })
      .promise()

    return folio
  }
  /*
  async updatefolio(folio: FolioItem): Promise<FolioItem> {
    logger.info(`Updating a folio with ID ${folio.folioId}`)

    const updateExpression = 'set #n = :name, dueDate = :dueDate, done = :done'

    await this.docClient
      .update({
        TableName: this.foliosTable,
        Key: {
          userId: folio.userId,
          folioId: folio.folioId
        },
        UpdateExpression: updateExpression,
        ConditionExpression: 'folioId = :folioId',
        ExpressionAttributeValues: {
          ':name': folio.name,
          ':dueDate': folio.dueDate,
          ':done': folio.done,
          ':folioId': folio.folioId
        },
        ExpressionAttributeNames: {
          '#n': 'name'
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()

    return folio
  }
  */
  async deletefolio(folioId: string, userId: string): Promise<string> {
    logger.info(`Deleting a folio with ID ${folioId}`)

    await this.docClient
      .delete({
        TableName: this.folioTable,
        Key: {
          userId,
          folioId
        },
        ConditionExpression: 'folioId = :folioId',
        ExpressionAttributeValues: {
          ':folioId': folioId
        }
      })
      .promise()

    return userId
  }
  /*
  async generateUploadUrl(folioId: string): Promise<string> {
    logger.info('Generating upload Url')

    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: folioId,
      Expires: this.urlExpiration
    })
  }*/
}

const createDynamoDBClient = () => {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')

    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  } else {
    return new XAWS.DynamoDB.DocumentClient()
  }
}
/*
const createS3Client = () => {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local S3 instance')

    return new AWS.S3({
      s3ForcePathStyle: true,
      // endpoint: new AWS.Endpoint('http://localhost:8200'),
      endpoint: 'http://localhost:8200',
      accessKeyId: 'S3RVER',
      secretAccessKey: 'S3RVER'
    })
  } else {
    return new XAWS.S3({ signatureVersion: 'v4' })
  }
}*/
