import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const RouteBooking = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const navigate = useNavigate();
  
  const [sourceStopId, setSourceStopId] = useState('');
  const [destinationStopId, setDestinationStopId] = useState('');
  
  const [fareData, setFareData] = useState(null);
  const [buses, setBuses] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await api.get('/routes');
      setRoutes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRouteSelect = async (e) => {
    const rId = e.target.value;
    if (!rId) {
      setSelectedRoute(null);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(`/routes/${rId}`);
      setSelectedRoute(res.data);
      setSourceStopId('');
      setDestinationStopId('');
      setFareData(null);
      setBuses([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sourceStopId && destinationStopId && selectedRoute) {
      calculateFareAndFetchBuses();
    } else {
      setFareData(null);
      setBuses([]);
    }
  }, [sourceStopId, destinationStopId]);

  const calculateFareAndFetchBuses = async () => {
    setError(null);
    setLoading(true);
    try {
      // Fetch Fare
      const fareRes = await api.post('/fare/calculate', {
        routeId: selectedRoute.id,
        sourceStopId: parseInt(sourceStopId),
        destinationStopId: parseInt(destinationStopId)
      });
      setFareData(fareRes.data);

      // Fetch Buses
      const busRes = await api.get(`/routes/${selectedRoute.id}/buses`, {
        params: {
          sourceStopId: parseInt(sourceStopId),
          destinationStopId: parseInt(destinationStopId)
        }
      });
      setBuses(busRes.data);
    } catch (err) {
      setError(err.response?.data || "Error calculating fare. Please ensure destination is after source.");
      setFareData(null);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter destinations to only show stops that come AFTER the selected source stop
  const getAvailableDestinations = () => {
    if (!selectedRoute || !selectedRoute.stops) return [];
    if (!sourceStopId) return selectedRoute.stops;
    
    const sourceStop = selectedRoute.stops.find(s => s.id === parseInt(sourceStopId));
    if (!sourceStop) return [];

    return selectedRoute.stops.filter(s => s.distanceFromStart > sourceStop.distanceFromStart);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Book Your Ticket</h1>
          <p className="text-gray-500">Fast, dynamic route selection with real-time fare calculation</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
          <div className="bg-orange-500 p-6">
            <h2 className="text-white text-xl font-semibold flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
              Plan Your Journey
            </h2>
          </div>
          
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">1. Select Route</label>
              <select onChange={handleRouteSelect} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition outline-none text-gray-700 font-medium">
                <option value="">-- Choose a Route --</option>
                {routes.map(r => (
                  <option key={r.id} value={r.id}>{r.routeName} ({r.source} to {r.destination})</option>
                ))}
              </select>
            </div>

            {selectedRoute && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">2. Boarding Point (Source)</label>
                  <select value={sourceStopId} onChange={(e) => setSourceStopId(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition outline-none text-gray-700">
                    <option value="">-- Select Source Stop --</option>
                    {selectedRoute.stops.map(s => (
                      <option key={s.id} value={s.id}>{s.stopName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">3. Dropping Point (Destination)</label>
                  <select disabled={!sourceStopId} value={destinationStopId} onChange={(e) => setDestinationStopId(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition outline-none text-gray-700 disabled:bg-gray-100 disabled:opacity-70">
                    <option value="">-- Select Destination Stop --</option>
                    {getAvailableDestinations().map(s => (
                      <option key={s.id} value={s.id}>{s.stopName}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                {error}
              </div>
            )}

            {loading && !error && (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            )}
          </div>
        </div>

        {fareData && !loading && !error && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl shadow-lg border border-orange-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-6 animate-fadeIn">
            <div>
              <p className="text-sm text-orange-600 font-bold uppercase tracking-wider mb-1">Journey Summary</p>
              <h3 className="text-2xl font-bold text-gray-800">Total Distance: {fareData.distance.toFixed(1)} KM</h3>
            </div>
            <div className="bg-white px-8 py-4 rounded-xl shadow-sm border border-orange-100 text-center">
              <p className="text-sm text-gray-500 font-medium mb-1">Calculated Fare</p>
              <p className="text-4xl font-black text-orange-600">₹{fareData.fare}</p>
            </div>
          </div>
        )}

        {buses.length > 0 && !loading && !error && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              Available Buses
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buses.map(bus => (
                <div key={bus.busId} className="bg-white rounded-xl shadow hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col">
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{bus.busName}</h4>
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium mt-1">{bus.busType || 'STANDARD'}</span>
                      </div>
                      <span className="bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-lg text-sm">{bus.busNumber}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-xs uppercase text-gray-400 font-bold mb-1">Departure</p>
                        <p className="font-bold text-gray-800 text-lg">{bus.sourceArrivalTime}</p>
                      </div>
                      <div className="flex-1 flex items-center justify-center px-4">
                        <div className="h-px bg-gray-300 w-full relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2 text-xs text-gray-400 font-medium">to</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs uppercase text-gray-400 font-bold mb-1">Arrival</p>
                        <p className="font-bold text-gray-800 text-lg">{bus.destinationArrivalTime}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${bus.availableSeats > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium text-gray-700">{bus.availableSeats} seats left</span>
                    </div>
                    <button 
                      onClick={() => {
                        const srcStop = selectedRoute.stops.find(s => s.id === parseInt(sourceStopId));
                        const destStop = selectedRoute.stops.find(s => s.id === parseInt(destinationStopId));
                        navigate(`/seats/${bus.scheduleId}?source=${srcStop.stopName}&destination=${destStop.stopName}`);
                      }}
                      className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-gray-800 transition"
                    >
                      Select Seats
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {fareData && buses.length === 0 && !loading && !error && (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 className="text-lg font-bold text-gray-700 mb-1">No Buses Available</h3>
            <p className="text-gray-500">There are no buses operating on this route at the selected time. Try a different route.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteBooking;
