import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import { getToken } from '../../auth/utils'

const logger = createLogger('auth')

const jwksUrl = process.env.JWKS_URL
const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJCibtA/Q9GjhoMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi16dXpiNnRxeC5hdXRoMC5jb20wHhcNMjAwNjA2MDUxODI3WhcNMzQw
MjEzMDUxODI3WjAhMR8wHQYDVQQDExZkZXYtenV6YjZ0cXguYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzS9E8DYgTBipgHUCnUv8U77N
DpdqHFaAMBhD4RjVO21ydUOoSPrmOBOr7WzNFr2oG/KdLvvCPaDdEnZFZvezDUyF
x3UeWBRIRJbiNz2ogNepA+8+69nXVbN503V7IDZ+vGVcT/2tR1v8a+Y83mdJaNLU
qIfaY/A1vixTvE7tBGXej+6RQEccXROsyEi7NscwkQmDNxXcTgsKFH7fvFmWEtaf
s2ICRBSfHFkMdLAanPJw4jwRNIDApdAQkN+D9fv4JRhMk4WoM8dbYQAT9FfA2rwX
bnejfNugjsaU5ebxRivXpTcwUC1ymLx/gqYjDOjhQJ7EXLC60o2fNxHmgM+HFQID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBT+l4CoFndOjFEV2gfF
R//JI8X/5DAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAFwkxQI0
LKMmsB7NXf1GdX1Qc3BpifPu38AFISQNua/Ev0ek2v4MxVpS6iF20wci1Ezp8IzM
rid36YAYvihfpz1E/c0xtDCYBriPKYYht+4VUtBRN37ipwpn92kWcy2eSX2O5Imv
REFwY5l6JycscimkZ/07uHq+1xBr4rg0D4tUqQhJcBXlhutrTPYRM+MR0PmejxDA
JQjSucqPhJCHjcylOWZQWS4J3fnKIRKcY4Y3/pXfxqM5Ywf7jX1BVGU8Y5A2syaG
3VuK7xmrp+PitCz83G1lA6l4T6VI7TGT/mf0b3q879Cm9sDyIU4jWjZZi/xlvcb3
lMkVjJdru9n3hFY=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)

  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    /*
    let sub = 'User'

    if (!process.env.IS_OFFLINE) {
      sub = jwtToken.sub
    }*/

    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

const verifyToken = async (authHeader: string): Promise<JwtPayload> => {
  const token = getToken(authHeader)

  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  if(!jwt){
    throw new Error("jwt do be!!")
  }

  const response = await Axios.get(jwksUrl)
  console.log(response)
 // const cert_key_id = response.data.keys[0].x5c[0]
  console.log("verifying jwt token.....")
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}
