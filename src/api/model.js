import request from '@/utils/request'



export function save(data) {
  return request({
    url: '/model/save',
    method: 'post',
    data: JSON.stringify(data)
  })
}
