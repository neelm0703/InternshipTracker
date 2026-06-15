import { createContext, useContext, useEffect, useState } from 'react'
import { getJobs, updateJob, deleteJob } from '../api/jobs'

const JobsContext = createContext()

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ company: '', role: '', status: '' })

  useEffect(() => { fetchJobs() }, [filters])

  async function fetchJobs() {
    try {
      setLoading(true)
      const data = await getJobs(filters)
      setJobs(data)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  async function patchJob(jobId, updates) {
    await updateJob(jobId, updates)
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...updates } : j))
  }

  async function removeJob(jobId) {
    await deleteJob(jobId)
    setJobs(prev => prev.filter(j => j.id !== jobId))
  }

  return (
    <JobsContext.Provider value={{ jobs, loading, error, filters, setFilters, patchJob, removeJob, fetchJobs }}>
      {children}
    </JobsContext.Provider>
  )
}

export function useJobs() {
  return useContext(JobsContext)
}