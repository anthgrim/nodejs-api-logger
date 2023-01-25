import { appendFileSync } from 'fs'

// Create logs.json file on install
const createJSON = () => {
  const options = {
    encoding: 'utf8',
    mode: 438
  }
  const jsonData =
    '{"logDir": "./logs", "dateFormat": ""en-US", "levels": {"info": {"value": "INFO", "color": "34", "writeToFile": true},"database": {"value": "DATABASE", "color": "32", "writeToFile": true},"debug": {"value": "DEBUG", "color": "36", "writeToFile": true},"access": {"value": "ACCESS", "color": "35", "writeToFile": true},"error": {"value": "ERROR", "color": "31", "writeToFile": true},"fatal": {"value": "FATAL", "color": "31;1", "writeToFile": true}}}'
  appendFileSync('./logs.json', jsonData, options)
  console.log('logs.json file created in root folder')
}

createJSON()
