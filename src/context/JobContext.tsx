import React, { createContext, useContext, useState, useEffect } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const JobContext = createContext<any>(null);

export const JobProvider = ({ children }: any) => {
  const [jobs, setJobs] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://empllo.com/api/v1');
      const json = await response.json();
      
      // LOG THE DATA: Check your terminal/metro bundler to see what the API is actually sending
      console.log("API Response:", JSON.stringify(json).substring(0, 500));

      // 1. Try to find the array of jobs automatically
      let rawJobs = [];
      if (Array.isArray(json)) {
        rawJobs = json;
      } else if (json.data && Array.isArray(json.data)) {
        rawJobs = json.data;
      } else if (json.jobs && Array.isArray(json.jobs)) {
        rawJobs = json.jobs;
      } else {
        // Fallback: search for any key that contains an array
        const possibleKey = Object.keys(json).find(key => Array.isArray(json[key]));
        rawJobs = possibleKey ? json[possibleKey] : [];
      }

      // 2. Map fields strictly to ensure no 'undefined' crashes
      const jobsWithIds = rawJobs.map((job: any) => ({
        ...job,
        id: job.guid || job.id || job.job_id || uuidv4(),
        title: job.title || job.job_title || job.role_name || 'Untitled Role',
        companyName: job.companyName || job.company_name || job.company || 'Unknown Company',
        location: job.locations ? job.locations[0] : (job.location || 'Remote'),
        type: job.jobType || job.job_type || job.type || 'Full time',
        description: job.description || job.job_description || job.body || '',
      }));
      
      setJobs(jobsWithIds as any);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <JobContext.Provider value={{ jobs, isDarkMode, setIsDarkMode, fetchJobs, isLoading }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);