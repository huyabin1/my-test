import request from '@/utils/request'

export function getModels(params) {
  return request({ url: '/api/models', method: 'get', params })
}

export function getModelDetail(id) {
  return request({ url: `/api/models/${id}`, method: 'get' })
}

export function deleteModel(id) {
  return request({ url: `/api/models/${id}`, method: 'delete' })
}

export function exportModel(data) {
  return request({ url: '/api/models/export', method: 'post', data })
}
