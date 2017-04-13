'use strict'

const pathJoin = require('path').join
const fileExists = require('file-exists').sync
const exec = require('child_process').exec

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    if (!options) {
      throw Error('Missing required input: options')
    }
    if (!options.script) {
      throw Error('Missing required input: options.script')
    }
    const scriptsPath = pathJoin(__dirname, '../scripts/')
    const filePath = scriptsPath + options.script.split(' ')[0]
    if (!fileExists(filePath)) {
      throw Error(`File: ${filePath} does not exist`)
    }
    const env = {}
    for (let e in process.env) {
      env[e] = process.env[e]
    }
    env['DOCKER_HUB_TAG'] = options.tag
    env['DOCKER_HUB_REPO_NAME'] = options.repo_name
    exec(scriptsPath + options.script, {env: env}, (err, stdout, stderr) => {
      if (err || stderr) {
        options.state = 'error'
      }
      const result = stderr || stdout
      options.description = result ? result.substring(0, 200) : 'Empty result'
      return resolve(options)
    })
  })
}
