
'use strict'
const IPFS = require('ipfs');
const Libp2p = require('libp2p');

const WS = require('libp2p-websockets')
const WebRTCStar = require('libp2p-webrtc-star')
const WebSocketStar = require('libp2p-websocket-star')
const Multiplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const Bootstrap = require('libp2p-bootstrap')
const defaultsDeep = require('@nodeutils/defaults-deep')
const assert = require('assert')

/**
 * Options for the libp2p bundle
 * @typedef {Object} libp2pBundle~options
 * @property {PeerInfo} peerInfo - The PeerInfo of the IPFS node
 * @property {PeerBook} peerBook - The PeerBook of the IPFS node
 * @property {Object} config - The config of the IPFS node
 * @property {Object} options - The options given to the IPFS node
 */

/**
 * This is the bundle we will use to create our fully customized libp2p bundle.
 *
 * @param {libp2pBundle~options} opts The options to use when generating the libp2p node
 * @returns {Libp2p} Our new libp2p node
 */
const libp2pBundle = (opts) => {
  // Set convenience variables to clearly showcase some of the useful things that are available
  const peerInfo = opts.peerInfo
  const peerBook = opts.peerBook
  const bootstrapList = opts.config.Bootstrap

  // Create our WebSocketStar transport and give it our PeerId, straight from the ipfs node
  const wrtcstar = new WebRTCStar({ id: peerInfo.id })
  const wsstar = new WebSocketStar({ id: peerInfo.id })

  // Build and return our libp2p node
  return new Libp2p({
    peerInfo,
    peerBook,
    modules: {
      transport: [
        WS,
        wrtcstar,
        wsstar
      ],
      streamMuxer: [
        Multiplex
      ],
      connEncryption: [
        SECIO
      ],
      peerDiscovery: [
        wrtcstar.discovery,
        wsstar.discovery,
        Bootstrap
      ]
    },
    config: {
      peerDiscovery: {
        bootstrap: {
          enabled: true
        },
        webRTCStar: {
          enabled: true
        },
        websocketStar: {
          enabled: true
        }
      },
      EXPERIMENTAL: {
        dht: false,
        pubsub: true
      },
      relay: {
        enabled: false,
        hop: { enabled: false, active: false }
      }
    }
  })
}

const ipfsOptions = {
  libp2p: libp2pBundle,
  config: {
    Addresses: {
        Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/'],
        API: '',
        Gateway: ''
    },
    Discovery: {
      MDNS: {
        Enabled: false,
        Interval: 10
      },
      webRTCStar: {
        Enabled: false
      }
    },
    EXPERIMENTAL: {
      pubsub: true
    },
    relay: {
      enabled: false,
      hop: { enabled: false, active: false }
    }
  }
}

const IpfsBundle = () => new IPFS(ipfsOptions);

export { IpfsBundle };
