import request from '@/utils/request'


//微信公众号消息发送接口
export function get(data) {
  return request({
    url: '/api/guest/bbs',
    method: 'post',
    data
  })
}
