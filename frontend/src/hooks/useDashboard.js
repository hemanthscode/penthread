// src/hooks/useDashboard.js
import { useState, useEffect } from 'react';
import * as dashboardService from '../services/dashboardService';

export const useAdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSummary, resStats] = await Promise.all([
        dashboardService.fetchAdminSummary(),
        dashboardService.fetchAdminStats(),
      ]);
      setSummary(resSummary.data);
      setStats(resStats.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { summary, stats, loading };
};

export const useAuthorDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSummary, resStats] = await Promise.all([
        dashboardService.fetchAuthorSummary(),
        dashboardService.fetchAuthorStats(),
      ]);
      setSummary(resSummary.data);
      setStats(resStats.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { summary, stats, loading };
};

export const useUserDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.fetchUserSummary();
      setSummary(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return { summary, loading };
};
