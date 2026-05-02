import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  TrendingUp,
  Target,
  Award,
  X,
  Trash2,
  Check
} from 'lucide-react';
import { database } from './firebase';
import { ref, onValue, set, remove } from 'firebase/database';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', questions: '' });

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Sync with Firebase
  useEffect(() => {
    const dataRef = ref(database, 'accountability');
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const firebaseData = snapshot.val();
      setData(firebaseData || {});
    });

    return () => unsubscribe();
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isOtherMonth: true,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        month,
        year,
        isOtherMonth: false,
      });
    }

    // Next month days
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isOtherMonth: true,
      });
    }

    return days;
  };

  const getDateKey = (day, month, year) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isToday = (day, month, year) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const canEditDate = (dateKey) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateObj = new Date(dateKey);
    selectedDateObj.setHours(0, 0, 0, 0);

    // Only allow editing today's date
    return selectedDateObj.getTime() === today.getTime();
  };

  const getMonthStats = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    let totalQuestions = 0;
    let daysActive = 0;
    const userStats = { Anannya: 0, Harshita: 0 };

    Object.keys(data).forEach((dateKey) => {
      const date = new Date(dateKey);
      if (date.getFullYear() === year && date.getMonth() === month) {
        daysActive++;
        data[dateKey].forEach((entry) => {
          totalQuestions += entry.questions;
          if (userStats[entry.name] !== undefined) {
            userStats[entry.name] += entry.questions;
          }
        });
      }
    });

    const avgQuestions = daysActive > 0 ? (totalQuestions / daysActive).toFixed(1) : 0;

    return { totalQuestions, daysActive, avgQuestions, userStats };
  };

  const openModal = (dateKey) => {
    if (!canEditDate(dateKey)) {
      return; // Don't open modal for past or future dates
    }
    setSelectedDate(dateKey);
    setFormData({ name: '', questions: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setFormData({ name: '', questions: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.questions < 0) return;

    const newEntry = {
      name: formData.name,
      questions: parseInt(formData.questions),
      timestamp: new Date().toISOString(),
    };

    const dateRef = ref(database, `accountability/${selectedDate}`);
    const currentEntries = data[selectedDate] || [];
    const updatedEntries = [...currentEntries, newEntry];

    await set(dateRef, updatedEntries);
    closeModal();
  };

  const deleteEntry = async (index) => {
    const dateRef = ref(database, `accountability/${selectedDate}`);
    const currentEntries = [...data[selectedDate]];
    currentEntries.splice(index, 1);

    if (currentEntries.length === 0) {
      await remove(dateRef);
    } else {
      await set(dateRef, currentEntries);
    }
  };

  const days = getDaysInMonth(currentDate);
  const stats = getMonthStats();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="glass-effect card-shadow rounded-3xl p-8 mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Target className="w-10 h-10 text-primary-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-display">
              DSA Practice Tracker
            </h1>
          </div>
          <p className="text-gray-600 text-lg text-center">Track your daily coding progress together</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-effect card-shadow rounded-2xl p-6 bg-gradient-to-br from-green-500 to-green-600 text-white"
          >
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-sm text-green-100 mb-4">Total Questions</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Anannya</span>
                <span className="text-3xl font-bold">{stats.userStats.Anannya}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Harshita</span>
                <span className="text-3xl font-bold">{stats.userStats.Harshita}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-effect card-shadow rounded-2xl p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <CalendarIcon className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-4xl font-bold mb-1">{stats.daysActive}</div>
            <div className="text-purple-100 text-sm">Active Days</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-effect card-shadow rounded-2xl p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-4xl font-bold mb-1">{stats.avgQuestions}</div>
            <div className="text-pink-100 text-sm">Avg Per Day</div>
          </motion.div>
        </div>

        {/* Calendar */}
        <div className="glass-effect card-shadow rounded-3xl p-6 md:p-8">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Previous</span>
            </motion.button>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayHeaders.map((day) => (
              <div key={day} className="text-center font-semibold text-primary-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((dayInfo, index) => {
              const dateKey = getDateKey(dayInfo.day, dayInfo.month, dayInfo.year);
              const dayData = data[dateKey] || [];
              const isTodayDate = isToday(dayInfo.day, dayInfo.month, dayInfo.year);
              const isEditable = canEditDate(dateKey);
              const isPast = new Date(dateKey) < new Date(new Date().setHours(0, 0, 0, 0));
              const isFuture = new Date(dateKey) > new Date(new Date().setHours(0, 0, 0, 0));

              return (
                <motion.div
                  key={index}
                  whileHover={!dayInfo.isOtherMonth && isEditable ? { scale: 1.05 } : {}}
                  whileTap={!dayInfo.isOtherMonth && isEditable ? { scale: 0.98 } : {}}
                  onClick={() => !dayInfo.isOtherMonth && openModal(dateKey)}
                  className={`
                    relative min-h-[100px] md:min-h-[120px] p-3 rounded-xl transition-all
                    ${dayInfo.isOtherMonth
                      ? 'bg-gray-100/50 opacity-40 cursor-default'
                      : isTodayDate
                      ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg cursor-pointer'
                      : isPast
                      ? 'bg-white cursor-default'
                      : isFuture
                      ? 'bg-white cursor-default opacity-50'
                      : 'bg-white hover:shadow-lg cursor-pointer'
                    }
                    ${dayData.length > 0 && !isTodayDate && !isFuture ? 'border-2 border-primary-300' : 'border border-gray-200'}
                  `}
                >
                  <div className={`font-semibold mb-2 ${isTodayDate ? 'text-white' : 'text-gray-700'}`}>
                    {dayInfo.day}
                  </div>

                  <div className="space-y-1">
                    {dayData.map((entry, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between text-xs p-1.5 rounded-lg ${
                          isTodayDate ? 'bg-white/20' : 'bg-primary-50'
                        }`}
                      >
                        <span className={`font-medium truncate ${isTodayDate ? 'text-white' : 'text-primary-700'}`}>
                          {entry.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          isTodayDate ? 'bg-white/30 text-white' : 'bg-primary-600 text-white'
                        }`}>
                          {entry.questions}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full card-shadow"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Check In
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <select
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    required
                  >
                    <option value="">Select your name</option>
                    <option value="Anannya">Anannya</option>
                    <option value="Harshita">Harshita</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Questions Completed
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.questions}
                    onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="0"
                    required
                  />
                </div>

                {data[selectedDate] && data[selectedDate].length > 0 && (
                  <div className="border-t-2 border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-700 mb-3">Today's Check-ins:</h4>
                    <div className="space-y-2">
                      {data[selectedDate].map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                        >
                          <div>
                            <span className="font-semibold text-gray-800">{entry.name}</span>
                            <span className="text-gray-600"> - {entry.questions} questions</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteEntry(idx)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
