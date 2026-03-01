import React, { createContext, useContext, useState, useEffect } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const JobContext = createContext<any>(null);

export const JobProvider = ({ children }: any) => {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('https://api.empllo.com/jobs');
      const data = await response.json();
      const jobsWithIds = data.map((job: any) => ({
        ...job,
        id: job.id || uuidv4(),
      }));
      setJobs(jobsWithIds);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const toggleSaveJob = (job: any) => {
    const isSaved = savedJobs.find((j: any) => j.id === job.id);
    if (isSaved) {
      setSavedJobs(savedJobs.filter((j: any) => j.id !== job.id));
    } else {
      setSavedJobs([...savedJobs, job] as any);
    }
  };

  return (
    <JobContext.Provider value={{ jobs, savedJobs, toggleSaveJob, isDarkMode, setIsDarkMode }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);