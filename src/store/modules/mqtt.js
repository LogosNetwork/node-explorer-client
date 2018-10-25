import Mqtt from 'mqtt'
import mqttRegex from 'mqtt-regex'

let client = null

const state = {
  connected: false
}

const getters = {

}

const actions = {
  initalize ({ commit, state }, data) {
    if (!state.connected) {
      client = Mqtt.connect(data.url)
      client.on('close', () => {
        console.log('disconnected')
        commit('setConnectionStatus', false)
      })
      const accountMqttRegex = mqttRegex('account/+account').exec
      client.on('message', (topic, message) => {
        message = message.toString()
        // TODO Eventually validate the signatures of the blocks to be "trustless"
        if (topic === 'microEpoch') {
          // Type is Micro Epoch
          commit('chains/addMicroEpoch', { message: message }, { root: true })
        } else if (topic === 'epoch') {
          // Type is Epoch
          commit('chains/addEpoch', { message: message }, { root: true })
        } else if (topic === 'batchStateBlock') {
          // Type is BSB
          commit('chains/addBatchStateBlock', { message: message }, { root: true })
        } else {
          // Type is Transactional
          let params = accountMqttRegex(topic)
          if (params) {
            commit('account/addBlock', { account: params.account, message: message }, { root: true })
            commit('explorer/addBlock', { message: message }, { root: true })
          }
        }
      })
      client.on('connect', () => {
        console.log('connected')
        commit('setConnectionStatus', true)
        data.cb()
      })
    } else {
      data.cb()
    }
  },
  subscribe ({ state }, topic) {
    if (state.connected) {
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log(`subscribed to ${topic}`)
        } else {
          console.log(err)
        }
      })
    }
  },
  unsubscribe ({ state }, topic) {
    if (state.connected) {
      client.unsubscribe(topic, (err) => {
        if (!err) {
          console.log(`unsubscribed from ${topic}`)
        } else {
          console.log(err)
        }
      })
    }
  }
}

const mutations = {
  setConnectionStatus (state, status) {
    state.connected = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

/*
          {
            "timestamp": "1540484361943",
            "previous": "0000000000000000000000000000000000000000000000000000000000000000",
            "hash": "45AE92C2CF60D695A0F99A59289FA9779266413E4DA281154A68983528B6FBC3",
            "block_count": "1",
            "signature": "FD951C57E7DA23ABD640E8844F6CAA8D6F5C8BFBB3BB6F8BC11616791F993813",
            "blocks": [
              {
                "type": "state",
                "account": "xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpiij4txtdo",
                "previous": "88641EC4A06AA2A668AB7F4A5806B0F194FC83C1FC83FF69AC7E7BF27C7050C0",
                "representative": "xrb_1111111111111111111111111111111111111111111111111111hifc8npp",
                "amount": "1000000000000000000000000000000",
                "link": "6ED6FCD45B243BBC58A87F3F6288114F1FC63E1FB454518EFE6E3EACD44283D8",
                "link_as_account": "xrb_1uppzmc7pb3uqjecizszec634mrzrrz3zf4nc89hwujyomc671yr5s1ad39b",
                "signature": "D3985354C68FD33E2737988EBF03D9ED4A23436C882490C1F63DEBAD028EFB54A5A380B16EF0B2BDFDCEFE3737237341C3DED0FDB9171237ED809CA762A37D01",
                "work": "4afdcdc474c3cb1a",
                "timestamp": "1540484361942"
              }
            ]
          }
        */
/*
          {
            "timestamp": "1540485000228",
            "previous": "A7A36F5371E29D76FE019A9D15BFEE1A7B76631A8D11670C788D22E3183AB2B2",
            "hash": "745AE404F4A1855A4CA6F5A122595A71AD28B2DBA9C3247091812B16C4DC8A18",
            "delegate": "19D3D919475DEED4696B5D13018151D1AF88B2BD3BCFF048B45031C1F36D1858",
            "epoch_number": "3",
            "micro_block_number": "6",
            "last_micro_block": "0",
            "tips": [
              "45AE92C2CF60D695A0F99A59289FA9779266413E4DA281154A68983528B6FBC3",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000",
              "0000000000000000000000000000000000000000000000000000000000000000"
            ],
            "number_batch_blocks": "1",
            "signature": "D8521DFF1CBD617F60DC9708F8D12EACEC615FC23AAF43A33350F8A829A1B913"
          }
        */
