const { exec } = require('promisify-child-process')
const filesize = require('filesize')
const escapeQuotes = require('escape-quotes')
const ps = require('ps-node')

const DEBUG = false
const startStopProperties = ['ExecStopPost', 'ExecStop', 'ExecStartPost', 'ExecStart', 'ExecStartPre']

const getSystemd = async (name) => {
  try {
    const output = await exec(`systemctl show '${escapeQuotes(name)}'`)
    const status = {}
    for (const property of `${output.stdout}`.split('\n')) {
      const line = property.split('=')
      const name = line[0]; const value = line[1]
      if (startStopProperties.includes(name)) {
        line.splice(0, 1)
        status[name] = line
      }
      if (line.length !== 2) continue
      status[name] = name === 'MemoryCurrent' ? filesize(parseInt(value)) : value
    }
    if (status.LoadError) {
      throw new Error('Unable to load service')
    }
    return status
  } catch (error) {
    throw new Error(error)
  }
}

const getProcesses = (name, psArgs) => new Promise((resolve, reject) => {
  ps.lookup({ command: name, psargs: psArgs }, (err, results) => {
    if (err) {
      console.error(err)
      return reject(err)
    }
    return resolve(results)
  })
})

const getService = async (psName, serviceName = null, psArgs = 'aux') => {
  if (!serviceName) serviceName = psName
  let processes = []
  let service = null
  try {
    processes = await getProcesses(psName, psArgs)
  } catch (error) {
    if (DEBUG) console.error(error)
  }
  try {
    service = await getSystemd(serviceName)
  } catch (error) {
    if (DEBUG) console.error(error)
  }
  return { processes, service }
}

module.exports = { getService }
