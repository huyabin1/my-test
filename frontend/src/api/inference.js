import request from '@/utils/request'

export function getModels(params) {
  return request({ url: '/api/models', method: 'get', params })
}

export function realtimeInference(data) {
  return request({ url: '/api/inference/realtime', method: 'post', data })
}

export function getInferenceTasks(params) {
  return request({ url: '/api/inference/tasks', method: 'get', params })
}

export function createInferenceTask(data) {
  return request({ url: '/api/inference/tasks', method: 'post', data })
}
