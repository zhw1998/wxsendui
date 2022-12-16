import request from '@/utils/request'


/**
 * 配置接口
 * @param data
 * @returns {AxiosPromise}
 */

//申请码查询配置
export function searchByApplyCode(applyCode) {
  return request({
    url: '/config/searchByApplyCode?applyCode='+applyCode,
    method: 'get',
  })
}
//保存
export function save(data){
  return request({
    url: '/config/save',
    method: 'post',
    data: JSON.stringify(data),
  })
}

//获取发送策略
export function getWay(){
  return request({
    url: '/config/getWay',
    method: 'get',
  })
}
