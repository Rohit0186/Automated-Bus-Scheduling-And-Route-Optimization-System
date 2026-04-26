import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('AC');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '/public/buses';
      let params = {};

      if (activeTab === 'LONG_ROUTE') {
        endpoint = '/public/routes';
        params.longRoute = true;
      } else if (activeTab === 'REGIONAL') {
        endpoint = '/public/routes';
        params.longRoute = false;
      } else if (activeTab === 'AC' || activeTab === 'SLEEPER') {
        params.type = activeTab;
      }

      const response = await api.get(endpoint, { params });
      setData(response.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch data from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const value = {
    activeModule,
    setActiveModule,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    data,
    loading,
    error,
    refreshData: fetchData
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
