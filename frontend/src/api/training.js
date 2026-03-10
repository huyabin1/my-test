import request from '@/utils/request'

export function getTrainingTasks(params) {
  return request({
    url: '/api/training/tasks',
    method: 'get',
    params
  })
}

export function getTrainingTaskDetail(id) {
  return request({
    url: `/api/training/tasks/${id}`,
    method: 'get'
  })
}

export function createTrainingTask(data) {
  return request({
    url: '/api/training/tasks',
    method: 'post',
    data
  })
}

export function pauseTraining(taskId) {
  return request({
    url: `/api/training/tasks/${taskId}/pause`,
    method: 'post'
  })
}

export function resumeTraining(taskId) {
  return request({
    url: `/api/training/tasks/${taskId}/resume`,
    method: 'post'
  })
}

export function stopTraining(taskId) {
  return request({
    url: `/api/training/tasks/${taskId}/stop`,
    method: 'post'
  })
}

export function getTrainingLogs(taskId)({
    url: {
  return request `/api/training/tasks/${taskId}/logs`,
    method: 'get'
  })
}

export function getTrainingMetrics(taskId) {
  return request({
    url: `/api/training/tasks/${taskId}/metrics`,
    method: 'get'
  })
}
