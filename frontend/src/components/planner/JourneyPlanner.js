import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Calendar, Bus, Search, Loader2 } from 'lucide-react';
import StationAutocomplete from './StationAutocomplete';
import ModernInput from './ModernInput';
import '../../styles/JourneyPlanner.css';

const JourneyPlanner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    busType: 'AC'
  });
  const [loading, setLoading] = useState(false);
  const [reachableDestinations, setReachableDestinations] = useState([]);

  React.useEffect(() => {
    if (formData.from) {
      const fetchDestinations = async () => {
        try {
          const res = await api.get(`/stations/reachable-destinations?from=${formData.from}`);
          setReachableDestinations(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchDestinations();
    } else {
      setReachableDestinations([]);
    }
  }, [formData.from, formData.to]);

  const handleSwap = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!formData.from || !formData.to) {
      alert("Please select both source and destination");
      return;
    }
    if (formData.from === formData.to) {
      alert("Source and destination cannot be the same");
      return;
    }

    setLoading(true);
    // Simulate premium transition
    setTimeout(() => {
      navigate(`/search?source=${formData.from}&destination=${formData.to}&date=${formData.date}&type=${formData.busType}`);
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="journey-planner-card glass-morphism"
    >
      <form onSubmit={handleSearch}>
        <div className="planner-fields">
          <div className="input-group location-group">
            <StationAutocomplete
              label="From"
              value={formData.from}
              onChange={(val) => setFormData(prev => ({ ...prev, from: val }))}
            />
            
            <button 
              type="button"
              className="swap-btn"
              onClick={handleSwap}
              aria-label="Swap Locations"
            >
              <ArrowLeftRight size={20} />
            </button>

            <StationAutocomplete
              label="To"
              value={formData.to}
              onChange={(val) => setFormData(prev => ({ ...prev, to: val }))}
              restrictedTo={reachableDestinations}
            />
          </div>

          <div className="input-row secondary-fields" style={{ gridTemplateColumns: '1fr' }}>
            <ModernInput
              label="Travel Date"
              type="date"
              icon={Calendar}
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="search-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="spinner" />
            ) : (
              <>
                <Search size={20} />
                <span>Check Availability</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default JourneyPlanner;
