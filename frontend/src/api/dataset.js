import request from '@/utils/request'

export function getDatasets(params) {
  return request({
    url: '/api/datasets',
    method: 'get',
    params
  })
}

export function getDatasetDetail(id) {
  return request({
    url: `/api/datasets/${id}`,
    method: 'get'
  })
}

export function createDataset(data) {
  return request({
    url: '/api/datasets',
    method: 'post',
    data
  })
}

export function updateDataset(id, data) {
  return request({
    url: `/api/datasets/${id}`,
    method: 'put',
    data
  })
}

export function deleteDataset(id) {
  return request({
    url: `/api/datasets/${id}`,
    method: 'delete'
  })
}

export function getDatasetImages(datasetId, params) {
  return request({
    url: `/api/datasets/${datasetId}/images`,
    method: 'get',
    params
  })
}

export function getDatasetStats(datasetId) {
  return request({
    url: `/api/datasets/${datasetId}/stats`,
    method: 'get'
  })
}
