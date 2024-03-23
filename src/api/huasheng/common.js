import request from '@/utils/request'

  // 查询手机型号列表
  export function queryMoblie(name) {
    return request({
      url: '/huasheng/comm/mobileInfo',
      method: 'get',
      params: { name: name } 
    })
  }


  export function queryGame(name) {
    return request({
      url: '/huasheng/comm/gameInfo',
      method: 'get',
      params: { name: name } 
    })
  }