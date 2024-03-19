import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listData(query) {
  return request({
    url: '/huasheng/mobilebasic/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getData(modelId) {
  return request({
    url: '/huasheng/mobilebasic' + modelId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addData(data) {
  return request({
    url: '/huasheng/mobilebasic',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateData(data) {
  return request({
    url: '/huasheng/mobilebasic',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delData(modelId) {
  return request({
    url: '/huasheng/mobilebasic/' + modelId,
    method: 'delete'
  })
}
