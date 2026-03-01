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

  const formatSalary = (min: number, max: number, currency: string) => {
    if (!min && !max) return "Salary Negotiable";
    const symbol = currency === "USD" ? "$" : (currency || "");
    const formatNum = (num: number) => num >= 1000 ? `${(num / 1000).toFixed(0)}k` : num;
    
    if (min && max) return `${symbol}${formatNum(min)} - ${symbol}${formatNum(max)}`;
    return min ? `${symbol}${formatNum(min)}` : `${symbol}${formatNum(max)}`;
  };

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://empllo.com/api/v1');
      const json = await response.json();
      
      const rawJobs = json.jobs || [];

      const jobsWithIds = rawJobs.map((job: any) => ({
        ...job,
        id: job.guid || uuidv4(),
        title: job.title || 'Untitled Role',
        companyName: job.companyName || 'Unknown Company',
        companyLogo: job.companyLogo || null,
        location: job.locations ? job.locations[0] : 'Remote',
        type: job.jobType || 'Full time',
        // New salary logic based on your sample data
        salary: formatSalary(job.minSalary, job.maxSalary, job.currency),
        description: job.description || '',
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