import { save } from '@/api/model'

const model = {
  state: {},
  actions: {
    // user login
    save({commit}, modeldata) {
      return new Promise((resolve, reject) => {
        save(modeldata).then(res => {
          console.log('res', res)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

  }
}

export default model
