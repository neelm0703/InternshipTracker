import { useState } from 'react'
import { JobsProvider } from '../context/JobsContext'
import Navbar from '../components/Navbar'
import JobKanban from '../components/JobKanban'
import JobList from '../components/JobList'
import JobCalendar from '../components/JobCalendar'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('kanban')

  return (
    <JobsProvider>
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        background: '#14191f', overflow: 'hidden',
      }}>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'kanban'   && <JobKanban />}
        {activeTab === 'list'     && <JobList />}
        {activeTab === 'calendar' && <JobCalendar />}
      </div>
    </JobsProvider>
  )
}