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
 
  export function download(data) {
    return request({
      url: '/huasheng/game/downLoadPicture',
      method: 'post',
      responseType: 'blob',
      data: data
    }).then(response => {  
      // 如果需要，可以在这里检查HTTP状态码  
      if (!response.ok) {  
        throw new Error('HTTP error ' + response.status);  
      }  
      return response.data; // 返回blob数据供后续使用  
    });  
  }