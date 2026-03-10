import request from '@/utils/request'

// 标注任务
export function getTasks(params) {
  return request({
    url: '/api/annotation/tasks',
    method: 'get',
    params
  })
}

export function createTask(data) {
  return request({
    url: '/api/annotation/tasks',
    method: 'post',
    data
  })
}

export function getTaskDetail(id) {
  return request({
    url: `/api/annotation/tasks/${id}`,
    method: 'get'
  })
}

export function updateTask(id, data) {
  return request({
    url: `/api/annotation/tasks/${id}`,
    method: 'put',
    data
  })
}

export function deleteTask(id) {
  return request({
    url: `/api/annotation/tasks/${id}`,
    method: 'delete'
  })
}

export function distributeTask(taskId) {
  return request({
    url: `/api/annotation/tasks/${taskId}/distribute`,
    method: 'post'
  })
}

// 我的任务
export function getMyTasks(params) {
  return request({
    url: '/api/annotation/my-tasks',
    method: 'get',
    params
  })
}

export function claimTask(taskId) {
  return request({
    url: `/api/annotation/my-tasks/${taskId}/claim`,
    method: 'post'
  })
}

// 标注工作台
export function getTaskImages(taskId, params) {
  return request({
    url: `/api/annotation/tasks/${taskId}/images`,
    method: 'get',
    params
  })
}

export function getAnnotations(imageId) {
  return request({
    url: `/api/annotation/images/${imageId}/annotations`,
    method: 'get'
  })
}

export function saveAnnotation(imageId, data) {
  return request({
    url: `/api/annotation/images/${imageId}/annotations`,
    method: 'post',
    data
  })
}

// 审核
export function getReviewList(params) {
  return request({
    url: '/api/annotation/review',
    method: 'get',
    params
  })
}

export function approveAnnotation(annotationId) {
  return request({
    url: `/api/annotation/review/${annotationId}/approve`,
    method: 'post'
  })
}

export function rejectAnnotation(annotationId, data) {
  return request({
    url: `/api/annotation/review/${annotationId}/reject`,
    method: 'post',
    data
  })
}
