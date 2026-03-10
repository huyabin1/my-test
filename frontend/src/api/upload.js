import request from '@/utils/request'

export const uploadUrl = process.env.VUE_APP_BASE_API + '/api/upload/image'

export function uploadImage(data) {
  return request({
    url: '/api/upload/image',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function importDataset(data) {
  return request({
    url: '/api/datasets/import',
    method: 'post',
    data
  })
}

export function startCameraCapture(data) {
  return request({
    url: '/api/camera/start',
    method: 'post',
    data
  })
}

export function stopCameraCapture(data) {
  return request({
    url: '/api/camera/stop',
    method: 'post',
    data
  })
}
