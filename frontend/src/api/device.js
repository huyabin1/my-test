import request from '@/utils/request'

export function getDevices(params) {
  return request({ url: '/api/devices', method: 'get', params })
}

export function getDeviceDetail(id) {
  return request({ url: `/api/devices/${id}`, method: 'get' })
}

export function addDevice(data) {
  return request({ url: '/api/devices', method: 'post', data })
}

export function updateDevice(id, data) {
  return request({ url: `/api/devices/${id}`, method: 'put', data })
}

export function deleteDevice(id) {
  return request({ url: `/api/devices/${id}`, method: 'delete' })
}

export function deployModel(data) {
  return request({ url: '/api/devices/deploy', method: 'post', data })
}

export function getDeviceStatus(id) {
  return request({ url: `/api/devices/${id}/status`, method: 'get' })
}
