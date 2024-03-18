import request from '@/utils/request'

// 查询耗电数据列表
export function listPost(query) {
  return request({
    url: '/huasheng/endurance/list',
    method: 'get',
    params: query
  })
}

// 查询耗电数据详细
export function getPost(id) {
  return request({
    url: '/huasheng/endurance' + id,
    method: 'get'
  })
}

// 新增耗电数据
export function addPost(data) {
  return request({
    url: '/huasheng/endurance',
    method: 'post',
    data: data
  })
}

// 修改耗电数据
export function updatePost(data) {
  return request({
    url: '/huasheng/endurance',
    method: 'put',
    data: data
  })
}

// 删除耗电数据
export function delPost(id) {
  return request({
    url: '/huasheng/endurance' + id,
    method: 'delete'
  })
}
