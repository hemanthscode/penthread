// src/hooks/useDashboard.js
import { useState, useEffect } from 'react';
import * as dashboardService from '../services/dashboardService';

export const useAdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.fetchAdminSummary();
      setSummary(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.fetchAdminStats();
      setStats(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchStats();
  }, []);

  return { summary, stats, loading };
};

export const useAuthorDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.fetchAuthorSummary();
      setSummary(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.fetchAuthorStats();
      setStats(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchStats();
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
