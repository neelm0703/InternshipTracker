import api from './axios'

export async function getJobs(filters = {}) {
  const params = new URLSearchParams()
  if (filters.company) params.append('company', filters.company)
  if (filters.role) params.append('role', filters.role)
  if (filters.status) params.append('status', filters.status)
  const res = await api.get(`/jobs/?${params.toString()}`)
  return res.data
}

export async function createJob(data) {
  const res = await api.post('/jobs/', data)
  return res.data
}

export async function updateJob(jobId, data) {
  const res = await api.patch(`/jobs/${jobId}`, data)
  return res.data
}

export async function deleteJob(jobId) {
  const res = await api.delete(`/jobs/${jobId}`)
  return res.data
}