import request from '@/utils/request'

// 查询游戏性能列表
export function listData(query) {
  return request({
    url: '/huasheng/game/list',
    method: 'get',
    params: query
  })
}

// 查询游戏性能详细
export function getData(id) {
  return request({
    url: '/huasheng/game/' + id,
    method: 'get'
  })
}

// 新增游戏性能
export function addData(data) {
  return request({
    url: '/huasheng/game',
    method: 'post',
    data: data
  })
}

// 修改游戏性能
export function updateData(data) {
  return request({
    url: '/huasheng/game',
    method: 'put',
    data: data
  })
}

// 删除游戏性能
export function delData(id) {
  return request({
    url: '/huasheng/game/' + id,
    method: 'delete'
  })
}

export function uploadImage(data) {
    return request({
      url: '/huasheng/game',
      method: 'post',
      data: data
    })
  }
 
  // 查询手机型号列表
export function queryMoblie(name) {
  return request({
    url: '/huasheng/comm/mobileInfo',
    method: 'get',
    params: { name: name } 
  })
}