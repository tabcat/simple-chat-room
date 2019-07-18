
import { IpfsBundle } from './ipfsBundle'
const OrbitDB = require('orbit-db')
import { UnnamedNet } from './uNet'

const unet = new UnnamedNet(IpfsBundle, OrbitDB)
unet.on('ready', () => {
  console.log(unet)
})

export { unet }
