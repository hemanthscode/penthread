// src/hooks/useActivity.js
import { useState, useEffect } from 'react';
import * as activityService from '../services/activityService';

export const useActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await activityService.fetchActivityLogs();
      setActivities(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return { activities, loading, fetchActivities };
};
