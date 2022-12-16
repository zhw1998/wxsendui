import request from '@/utils/request'


/**
 * 申请码接口
 * @param data
 * @returns {AxiosPromise}
 */

//查询
export function list() {
  return request({
    url: '/applyCode/list',
    method: 'get',
  })
}

//创建申请码
export function create(num){
  return request({
    url: '/applyCode/create?num=' + num,
    method: 'get',
  })
}

