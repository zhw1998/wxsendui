import request from '@/utils/request'


/**
 * 模板接口
 * @param data
 * @returns {AxiosPromise}
 */

export function save(data) {
  return request({
    url: '/model/save',
    method: 'post',
    data:  data
  })
}

export function searchByName(name) {
  return request({
    url: '/model/searchByName?name=' + name,
    method: 'get',
  })
}

export function list(){
  return request({
    url: '/model/list',
    method: 'get',
  })
}

export function deleteModel(id){
  return request({
    url: '/model/delete?id=' + id,
    method: 'get',
  })
}


export function listFiled(){
  return request({
    url: '/model/listFiled',
    method: 'get',
  })
}
