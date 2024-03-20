import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listInfo(query) {
  return request({
    url: '/huasheng/gameinfo/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getInfo(gameId) {
  return request({
    url: '/huasheng/gameinfo/' + gameId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addInfo(data) {
  return request({
    url: '/huasheng/gameinfo',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateInfo(data) {
  return request({
    url: '/huasheng/gameinfo',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delInfo(gameId) {
  return request({
    url: '/huasheng/gameinfo/' + gameId,
    method: 'delete'
  })
}
