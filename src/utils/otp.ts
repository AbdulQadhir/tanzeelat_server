import { ServerResponse } from "http";

export function sendOTP(mobile: string, otp: string) {
  
  const https = require('https')

  const options = {
    hostname: 'smartsmsgateway.com',
    port: 443,
    path: `/api/api_json.php?username=Tanzeelat&password=${process.env.SMS_PASSWORD}&senderid=${process.env.SMS_SENDERID}&to=${mobile}&text=${otp}&type=text`,
    method: 'GET'
  }
  
  const req = https.request(options, (res: ServerResponse) => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      console.error(d)
    })
  })
  
  req.on('error', (error: any) => {
    console.error(error)
  })
  
  req.end()
}
