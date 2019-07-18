
'use strict'
const EventEmitter = require('events').EventEmitter
const OrbitDB = require('orbit-db')
const Identities = require('orbit-db-identity-provider')
window.OrbitDB = OrbitDB
window.Identities = Identities
var levelup = require('levelup')
var leveljs = require('level-js')
var db = (name, options) => levelup(leveljs(name, options))
window.db = db

var pull = require('pull-stream/pull')
var toPull = require('stream-to-pull-stream')
window.pull = pull
window.toPull = toPull


class UnnamedNet extends EventEmitter {
  constructor(ipfs, orbit){
    super()
    this.initialized = this.init(ipfs, orbit)
    this.orbits = {}
  }

  init(ipfs, orbit) {
    return new Promise((resolve, reject) => {
      const ipfsNode = ipfs()
      ipfsNode.on('error', (e) => console.error(e))
      ipfsNode.on('ready', async () => {
        this.ipfs = ipfsNode
        window.ipfs = this.ipfs
        await this.addOrbitInstance()
        this.emit('ready')
        resolve('success')
      })
    })
  }

  addOrbitInstance = async (userName = null) => {
    const tunedName = userName === null
      ? 'local-id'
      : this.userNameWithPrefix(userName)
    const orbitId = await Identities.createIdentity({ id: tunedName })
    const options = { identity:orbitId, directory:tunedName }
    this.orbits[tunedName] = await OrbitDB.createInstance(this.ipfs, options)
    return this.orbits[tunedName]
  }

  removeOrbitInstance = async (userName) => {
    delete this.orbits[this.userNameWithPrefix(userName)]
  }

  getOrbitInstance = async (userName = null) => {
    await this.initialized
    return !!this.orbits[this.userNameWithPrefix(userName)]
      ? this.orbits[this.userNameWithPrefix(userName)]
      : await this.addOrbitInstance(userName)
  }

  userNameWithPrefix = (userName) =>  userName === null
    ? 'local-id'
    :`${userName}@unet`

  getLocalDb = async (userName, dbAddr) => {
    const orbit = await getOrbitInstance(userName)
    return await orbit.open(dbAddr, { localOnly:true })
  }

  connectDb = async (userName, dbConfig) => {
    await this.initializied
    const { name, type, options } = dbConfig
    const orbit = await this.getOrbitInstance(userName)
    try {
      return await orbit.create(name, type, options)
      console.log('try block completed, a new db was created')
    } catch (e) {
      console.log('catch block executed, db exists')
      const db = await orbit.open(
        e.message.split(`'`)[1],
        { type, ...options, localOnly:true, create:true, }
      )
      await db.load()
      return db
    }
  }

  namedDb = async (userName, dbConfig) => {
    await this.initialized
    const orbit = await this.getOrbitInstance(userName)

    if (!!userName) {

    } else {
      return { err: 'userName property required' }
    }

    if(!dbConfig.name){
      if(typeof dbConfig !== 'object'){
        return { err: 'parameter must be an object' }
      }
      return { err: 'no store name specified' }
    }
    let dbAddrs = Object.keys(orbit.stores).map((addr, index) => addr)
    // match name to dbname
    let dbKey = dbAddrs.filter((dbAddr, index) => dbAddr.split(`/`)[3] === dbConfig.name)[0]
    if (dbKey === null || dbKey === undefined) {
      if (!dbConfig.type && !dbConfig.options) {
        return {err: 'need db type and options to create new db'}
      }
      return await this.connectDb(userName, dbConfig)
    }
    return orbit.stores[dbKey]
  }

}

export { UnnamedNet }


// ipfsNode.on('error', (e) => console.error(e))
// ipfsNode.on('ready', async () => {
//   // window.orbitdb = new OrbitDB(ipfsNode)
//   // window.node = orbitdb._ipfs
//   // window.db0Options = {
//   //   write: ['*']
//   // }
//   window.ipfsNode = ipfsNode
//   window.Orbit = OrbitDB
//   window.orbitdb = new OrbitDB(ipfsNode)
//   window.p2p = new UnnamedNet(orbitdb)
//   window.node = p2p._ipfs
//   window.orbit = p2p._orbitdb
//
//   window.store0Options = {
//     name: 'store0',
//     type: 'feed',
//     options: {
//       write: ['*']
//     }
//   }
// })

// const UnnamedNet = new

// ipfsNode.on('error', (e) => console.error(e))
// ipfsNode.on('ready', async () => {
//
//
//
//
//   // window.orbitdb = new OrbitDB(ipfsNode)
//   // window.node = orbitdb._ipfs
//   // window.db0Options = {
//   // 	write: ['*']
//   // }
//   try {
//     window.db0 = await orbitdb.create('test0', 'feed', db0Options)
//   } catch (e) {
//     console.log('catch block executed, db exists')
//     window.db0 = await orbitdb.open(
//       e.split(`'`)[1],
//       { type:'feed', ...options }
//     )
//   }
//   //
//   // db0.events.on('replicated', (address) => console.log(db0.iterator({ limit: 1 }).collect()[0].payload.value))
//
// })
