import { useEffect, useState } from "react";
import { Sun, Moon, X, Mail, Calendar, MapPin, Sparkles } from "lucide-react";
import { toast } from 'react-toastify';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedEventLink, setSelectedEventLink] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  
  const link = "https://www.timeout.com/sydney/things-to-do";
 
  useEffect(() => {
    fetch("http://localhost:5000/getAllEvents")
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(data => {
        console.log(data);
        setIsLoading(true);
        setTimeout(() => {
          setEvents(data);
          setIsLoading(false);
        }, 1000);
    });
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  const handleGetTickets = (eventLink) => {
    setSelectedEventLink(eventLink);
    setShowEmailPopup(true);
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
        const response = await fetch("http://localhost:5000/subscribeUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      toast.success("Subscribed successfully!");

      setShowEmailPopup(false);
      setEmail("");
      setTimeout(() => {
        window.open(link, "_blank");
      }, 2000);
      
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setShowEmailPopup(false);
    setEmail("");
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-sky-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Header with Theme Toggle */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2 mt-5">
          <Sparkles className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-blue-600'}`} />
          <h1 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Sydney Events
          </h1>
        </div>
        
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all duration-300 hover:scale-110 mt-5 ${
            isDarkMode 
              ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900' 
              : 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
          }`}
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && !showEmailPopup && (
        <div className="flex justify-center items-center h-64">
          <div className={`animate-spin rounded-full h-16 w-16 border-4 ${
            isDarkMode ? 'border-purple-400 border-t-transparent' : 'border-blue-600 border-t-transparent'
          }`}></div>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 mt-5">
        {events.slice(0, visibleCount).map((event, idx) => (
          <div
            key={event.id || idx}
            className={`group relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 mb-5 ${
              isDarkMode 
                ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl shadow-cyan-100' 
                : 'bg-white/80 backdrop-blur-sm border border-white/20'
            }`}
            style={{
              animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both, float${idx % 2 === 0 ? 'Up' : 'Down'} 3s ease-in-out infinite ${idx * 0.5}s`
            }}
          >
            {/* Card Glow Effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              isDarkMode ? 'bg-purple-500/10' : 'bg-blue-500/10'
            } blur-xl`}></div>
            
            {/* Image Container */}
            <div className="relative overflow-hidden">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Content */}
            <div className="p-6 relative z-10">
              <h3 className={`text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300 ${
                isDarkMode 
                  ? 'text-white group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400' 
                  : 'text-gray-800 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600'
              }`}>
                {event.title}
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{event.date}</span>
                </div>
              </div>
              
              <p className={`text-sm mb-6 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {event.description}
              </p>
              
              <button
                onClick={() => handleGetTickets(link)}
                className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>GET TICKETS</span>
                  <Sparkles className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {events.length > 12 && (
        <div className="flex justify-center gap-2 md:gap-6 pt-12 pb-16">
          {visibleCount < events.length && (
            <button
              onClick={() => setVisibleCount(prev => prev + 12)}
              className={`group relative overflow-hidden px-4 py-3 rounded-3xl font-bold text-base transition-all duration-500 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border border-purple-500/30' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border border-blue-300/30'
              }`}>

              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                isDarkMode ? 'bg-purple-500/20' : 'bg-blue-500/20'
              } blur-xl`}></div>
              
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>Load More Events</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </button>
          )}
          
          {visibleCount > 12 && (
            <button
              onClick={() => setVisibleCount(12)}
              className={`group relative overflow-hidden px-4 py-3 rounded-3xl font-bold text-base transition-all duration-500 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl backdrop-blur-sm ${
                isDarkMode 
                  ? 'bg-gray-800/80 text-gray-200 hover:bg-gray-700/90 border border-gray-300/50 hover:border-gray-200/70' 
                  : 'bg-white/80 text-gray-700 hover:bg-gray-50/90 border border-gray-400/50 hover:border-gray-500/70'
              }`}>

              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                isDarkMode ? 'bg-gray-600/10' : 'bg-gray-400/10'
              } blur-xl`}></div>
              
              <div className={`absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
                isDarkMode ? 'bg-white/10' : 'bg-gray-200/30'
              }`}></div>
              
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>Show Less</span>
              </span>
            </button>
          )}
        </div>
      )}

      {/* Email Popup */}
      {showEmailPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closePopup}
            style={{ animation: 'fadeIn 0.3s ease-out' }}
          ></div>
          
          {/* Popup */}
          <div 
            className={`relative w-full max-w-md rounded-3xl shadow-2xl p-8 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}
            style={{ animation: 'slideInFromTop 0.4s ease-out' }}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Content */}
            <div className="text-center mb-6">
              <div className={`inline-flex p-4 rounded-full mb-4 ${
                isDarkMode ? 'bg-purple-500/20' : 'bg-blue-500/20'
              }`}>
                <Mail className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-blue-600'}`} />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Subscribe for Tickets
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter your email to get tickets and stay updated with events
              </p>
            </div>
            
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`w-full px-4 py-3 rounded-2xl border transition-colors focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-500'
                }`}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
              />
              
              <button
                onClick={handleEmailSubmit}
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span>Subscribing...</span>
                 </div>
               ) : (
                 'Subscribe & Get Tickets'
               )}
             </button>
           </div>
         </div>
       </div>
     )}
   </div>
 );
}