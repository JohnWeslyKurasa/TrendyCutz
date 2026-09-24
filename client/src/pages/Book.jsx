import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCheck, FiCalendar, FiClock, FiUser, FiScissors, FiArrowRight, FiArrowLeft, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import { DEMO_SERVICES, DEMO_WORKERS } from '../services/demoData';
import { useAuth } from '../context/AuthContext';
import { format, addDays } from 'date-fns';

const STEPS = ['Service', 'Worker', 'Date & Time', 'Details', 'Confirm'];

function StepIndicator({ current }) {
  const pct = Math.round(((current + 1) / STEPS.length) * 100);
  return (
    <>
      {/* Desktop Stepper */}
      <div className="booking-stepper">
        {STEPS.map((label, i) => (
          <div key={i} className="step-item">
            <div className="step-inner">
              <div className={`step-circle ${i < current ? 'done' : i === current ? 'active' : ''}`}>
                {i < current ? <FiCheck size={14} /> : i + 1}
              </div>
              <div className={`step-label ${i < current ? 'done' : i === current ? 'active' : ''}`}>{label}</div>
            </div>
            {i < STEPS.length - 1 && <div className={`step-connector${i < current ? ' done' : ''}`} style={{ margin: '0 0.5rem', marginBottom: 18 }} />}
          </div>
        ))}
      </div>

      {/* Mobile Phone Progress Bar */}
      <div className="booking-mobile-progress">
        <div className="booking-mobile-progress-header">
          <div>
            <div className="booking-mobile-step-tag">Step {current + 1} of {STEPS.length}</div>
            <div className="booking-mobile-step-name">{STEPS[current]}</div>
          </div>
          <div className="booking-mobile-step-count">{pct}% Completed</div>
        </div>
        <div className="booking-progress-track">
          <div className="booking-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </>
  );
}

export default function Book() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [slotFilter, setSlotFilter] = useState('all'); // 'all' | 'morning' | 'afternoon' | 'evening'

  const [selected, setSelected] = useState({
    service: null,
    worker: null,
    date: addDays(new Date(), 1),
    time: null,
    notes: ''
  });

  useEffect(() => {
    document.title = 'Book Appointment | Trendy Cutz';
    api.get('/services')
      .then(r => {
        if (r.data?.services?.length > 0) setServices(r.data.services);
        else setServices(DEMO_SERVICES);
      })
      .catch(() => setServices(DEMO_SERVICES));

    api.get('/workers')
      .then(r => {
        const workerList = r.data?.workers?.length > 0 ? r.data.workers : DEMO_WORKERS;
        setWorkers(workerList);
        const wId = searchParams.get('worker');
        if (wId) {
          const w = workerList.find(x => x._id === wId || x.name === wId);
          if (w) setSelected(s => ({ ...s, worker: w }));
        }
      })
      .catch(() => {
        setWorkers(DEMO_WORKERS);
        const wId = searchParams.get('worker');
        if (wId) {
          const w = DEMO_WORKERS.find(x => x._id === wId || x.name === wId);
          if (w) setSelected(s => ({ ...s, worker: w }));
        }
      });

    const sId = searchParams.get('service');
    if (sId) {
      api.get(`/services/${sId}`)
        .then(r => setSelected(s => ({ ...s, service: r.data.service })))
        .catch(() => {
          const s = DEMO_SERVICES.find(x => x._id === sId || x.name === sId);
          if (s) setSelected(prev => ({ ...prev, service: s }));
        });
    }
  }, []);

  const formatSlotTime = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    const p = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${String(m).padStart(2, '0')} ${p}`;
  };

  const normalizeSlots = (rawSlots) => {
    return rawSlots.map(s => {
      if (typeof s === 'string') {
        return { time: s, display: formatSlotTime(s), isBooked: false };
      }
      return {
        ...s,
        display: s.display || formatSlotTime(s.time)
      };
    });
  };

  const fetchSlots = async (workerId, date) => {
    setLoadingSlots(true);
    setSlots([]);
    const defaultRaw = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:30', '15:00', '15:30', '16:00', '17:00', '18:00', '19:00', '20:00'];
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const r = await api.get(`/appointments/available-slots?workerId=${workerId}&date=${dateStr}`);
      if (r.data?.slots?.length > 0) {
        setSlots(normalizeSlots(r.data.slots));
      } else {
        setSlots(normalizeSlots(defaultRaw));
      }
    } catch {
      setSlots(normalizeSlots(defaultRaw));
    }
    setLoadingSlots(false);
  };

  const handleServiceSelect = (s) => {
    setSelected(prev => ({ ...prev, service: s, worker: null }));
    setStep(1);
  };

  const handleWorkerSelect = (w) => {
    setSelected(prev => ({ ...prev, worker: w, time: null }));
    fetchSlots(w._id, selected.date);
    setStep(2);
  };

  const handleDateChange = (date) => {
    setSelected(prev => ({ ...prev, date, time: null }));
    if (selected.worker) fetchSlots(selected.worker._id, date);
  };

  const handleTimeSelect = (slot) => {
    if (slot.isBooked) return;
    setSelected(prev => ({ ...prev, time: slot.time }));
  };

  const handleNext = () => {
    if (step === 2 && !selected.time) { toast.error('Please select a time slot'); return; }
    if (step === 3) {
      if (!user) { toast('Please login to confirm booking'); navigate('/login?redirect=/book'); return; }
    }
    setStep(s => Math.min(s + 1, 4));
  };

  // Filter slots by morning, afternoon, evening
  const filteredSlots = slots.filter(slot => {
    if (slotFilter === 'all') return true;
    const hour = parseInt(slot.time.split(':')[0], 10);
    if (slotFilter === 'morning') return hour < 12;
    if (slotFilter === 'afternoon') return hour >= 12 && hour < 17;
    if (slotFilter === 'evening') return hour >= 17;
    return true;
  });

  const morningCount = slots.filter(s => parseInt(s.time.split(':')[0], 10) < 12 && !s.isBooked).length;
  const afternoonCount = slots.filter(s => { const h = parseInt(s.time.split(':')[0], 10); return h >= 12 && h < 17 && !s.isBooked; }).length;
  const eveningCount = slots.filter(s => parseInt(s.time.split(':')[0], 10) >= 17 && !s.isBooked).length;

  const availableWorkers = selected.service
    ? workers.filter(w => {
        if (w.isActive === false) return false;
        const sWorkers = selected.service.availableWorkers;
        if (!sWorkers || sWorkers.length === 0) return true;
        return sWorkers.some(sw => (sw?._id || sw) === w._id);
      })
    : workers.filter(w => w.isActive !== false);

  const handleConfirm = async () => {
    if (!user) { navigate('/login?redirect=/book'); return; }
    setBooking(true);
    try {
      const { data } = await api.post('/appointments', {
        serviceId: selected.service._id,
        workerId: selected.worker._id,
        date: format(selected.date, 'yyyy-MM-dd'),
        time: selected.time,
        notes: selected.notes
      });
      setConfirmed(data.appointment);
      toast.success('Appointment booked!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
    setBooking(false);
  };

  if (confirmed) {
    const d = new Date(confirmed.date + 'T00:00:00');
    const formatTime = (t) => {
      const [h, m] = t.split(':').map(Number);
      const p = h >= 12 ? 'PM' : 'AM';
      return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${p}`;
    };
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: 'var(--bg)' }}>
        <div className="confirmation-card animate-slide-up">
          <div className="confirmation-header">
            <div className="confirmation-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiCheck size={36} color="white" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Appointment Confirmed!</h2>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>We'll see you soon at Trendy Cutz</p>
          </div>
          <div className="confirmation-body">
            <div style={{ background: 'var(--accent-light)', border: '1px solid rgba(199,167,108,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginBottom: 4 }}>Appointment ID</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{confirmed.appointmentId}</div>
            </div>
            {[
              ['Customer', user?.fullName],
              ['Service', confirmed.service?.name],
              ['Specialist', confirmed.worker?.name],
              ['Date', d.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })],
              ['Time', formatTime(confirmed.time)],
              ['Status', <span key="s" className="badge badge-pending">Pending Confirmation</span>]
            ].map(([label, val]) => (
              <div key={label} className="appointment-detail-row">
                <span className="appointment-detail-label">{label}</span>
                <span className="appointment-detail-value">{val}</span>
              </div>
            ))}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
              <Link to="/dashboard" className="btn btn-primary w-full">View My Appointments</Link>
              <Link to="/" className="btn btn-ghost w-full">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '80px' }}>
      {/* Header */}
      <div style={{ background: 'var(--primary)', padding: '2.5rem 1.5rem', textAlign: 'center', color: 'white' }}>
        <span className="section-label" style={{ color: 'var(--accent)' }}>Schedule Your Visit</span>
        <h1 className="heading-md font-serif" style={{ color: 'white' }}>Book Appointment</h1>
      </div>

      <div className="container" style={{ maxWidth: 860, padding: '2.5rem 1rem' }}>
        <StepIndicator current={step} />

        {/* STEP 0: Choose Service */}
        {step === 0 && (
          <div className="animate-slide-up">
            <h2 className="heading-sm font-serif" style={{ marginBottom: '0.5rem' }}>Choose a Service</h2>
            <p style={{ color: 'var(--secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Select the salon experience you'd like to book</p>
            {services.length === 0 ? (
              <div className="spinner" />
            ) : (
              <div className="booking-services-grid">
                {services.map(s => {
                  const isSelected = selected.service?._id === s._id;
                  return (
                    <button
                      key={s._id}
                      onClick={() => handleServiceSelect(s)}
                      className={`card ${isSelected ? 'selected' : ''}`}
                      style={{
                        cursor: 'pointer',
                        textAlign: 'left',
                        padding: '1.25rem',
                        border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                        background: isSelected ? 'var(--accent-light)' : 'white',
                        boxShadow: isSelected ? 'var(--shadow-accent)' : undefined,
                        position: 'relative'
                      }}
                    >
                      {isSelected && (
                        <div style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiCheck size={13} />
                        </div>
                      )}
                      <div style={{ color: 'var(--accent-dark)', marginBottom: '0.625rem', display: 'flex', alignItems: 'center' }}>
                        <FiScissors size={24} />
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', marginBottom: '0.25rem', paddingRight: isSelected ? 24 : 0 }}>{s.name}</h3>
                      <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiClock size={12} /> {s.duration} min session
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--accent-dark)', fontSize: '1.1rem' }}>₹{s.price}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 1: Choose Worker */}
        {step === 1 && (
          <div className="animate-slide-up">
            <h2 className="heading-sm font-serif" style={{ marginBottom: '0.35rem' }}>Choose a Specialist</h2>
            {selected.service && <p style={{ color: 'var(--secondary)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>Selected Service: <strong style={{ color: 'var(--primary)' }}>{selected.service.name}</strong> (₹{selected.service.price})</p>}
            <div className="booking-workers-grid">
              {availableWorkers.map(w => {
                const isSelected = selected.worker?._id === w._id;
                return (
                  <button
                    key={w._id}
                    onClick={() => handleWorkerSelect(w)}
                    className="card"
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      padding: '1.25rem 0.875rem',
                      border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--accent-light)' : 'white',
                      boxShadow: isSelected ? 'var(--shadow-accent)' : undefined,
                      position: 'relative'
                    }}
                  >
                    {isSelected && (
                      <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiCheck size={12} />
                      </div>
                    )}
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.625rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-dark)', fontFamily: 'var(--font-serif)', border: '2px solid var(--accent)' }}>
                      {w.name.charAt(0)}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>{w.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-dark)', fontWeight: 600, marginBottom: 4 }}>{w.role}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--secondary)', background: 'var(--bg-alt)', padding: '2px 8px', borderRadius: 'var(--radius-full)', display: 'inline-block' }}>{w.experience}y exp.</div>
                  </button>
                );
              })}
            </div>
            <div className="booking-actions-bar">
              <button onClick={() => setStep(0)} className="btn btn-ghost">
                <FiArrowLeft size={15} /> Back
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Date & Time */}
        {step === 2 && (
          <div className="animate-slide-up">
            <h2 className="heading-sm font-serif" style={{ marginBottom: '0.35rem' }}>Choose Date & Time</h2>
            <p style={{ color: 'var(--secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Stylist: <strong style={{ color: 'var(--primary)' }}>{selected.worker?.name}</strong> · Service: <strong>{selected.service?.name}</strong>
            </p>

            <div className="booking-datetime-grid">
              {/* Date Column */}
              <div className="booking-calendar-card">
                <div style={{ width: '100%', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiCalendar size={16} color="var(--accent)" />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>Select Date</span>
                </div>
                <DatePicker
                  selected={selected.date}
                  onChange={handleDateChange}
                  minDate={addDays(new Date(), 1)}
                  maxDate={addDays(new Date(), 30)}
                  inline
                  calendarClassName="tc-calendar"
                />
              </div>

              {/* Time Slots Column */}
              <div className="booking-slots-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiClock size={16} color="var(--accent)" />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>Available Slots</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600 }}>
                    {format(selected.date, 'EEE, dd MMM')}
                  </span>
                </div>

                {/* Time of Day Tabs */}
                <div className="slot-filter-tabs">
                  {[
                    { id: 'all', label: `All (${slots.filter(s => !s.isBooked).length})` },
                    { id: 'morning', label: `Morning (${morningCount})` },
                    { id: 'afternoon', label: `Afternoon (${afternoonCount})` },
                    { id: 'evening', label: `Evening (${eveningCount})` },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSlotFilter(tab.id)}
                      className={`slot-filter-pill${slotFilter === tab.id ? ' active' : ''}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {loadingSlots ? (
                  <div style={{ padding: '2.5rem', textAlign: 'center' }}><div className="spinner" /></div>
                ) : filteredSlots.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}><FiClock size={36} /></div>
                    <p style={{ fontSize: '0.85rem' }}>No slots available in this time period. Please try another period or date.</p>
                  </div>
                ) : (
                  <div className="time-slots">
                    {filteredSlots.map(slot => {
                      const isSelected = selected.time === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => handleTimeSelect(slot)}
                          className={`time-slot${slot.isBooked ? ' booked' : isSelected ? ' selected' : ''}`}
                          disabled={slot.isBooked}
                        >
                          <span>{slot.display}</span>
                          {slot.isBooked && <span className="booked-tag">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Selected Slot Confirmation Banner */}
                {selected.time && (
                  <div className="selected-slot-banner">
                    <div className="selected-slot-info">
                      <div className="selected-slot-icon">
                        <FiCheck size={18} />
                      </div>
                      <div className="selected-slot-details">
                        <strong>{formatSlotTime(selected.time)} · {format(selected.date, 'EEEE, dd MMM')}</strong>
                        <span>Specialist: {selected.worker?.name}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="booking-actions-bar">
              <button onClick={() => setStep(1)} className="btn btn-ghost">
                <FiArrowLeft size={15} /> Back
              </button>
              <button onClick={handleNext} className="btn btn-primary" disabled={!selected.time}>
                Continue <FiArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Details */}
        {step === 3 && (
          <div className="animate-slide-up" style={{ maxWidth: 540, margin: '0 auto' }}>
            <h2 className="heading-sm font-serif" style={{ marginBottom: '1.25rem' }}>Your Details</h2>
            {!user ? (
              <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
                <span>Please <Link to="/login?redirect=/book" style={{ fontWeight: 700, textDecoration: 'underline' }}>login</Link> to complete your booking.</span>
              </div>
            ) : (
              <div className="card">
                <div className="card-body">
                  <div className="form-group">
                    <div className="form-label">Customer Name</div>
                    <div className="form-control" style={{ background: 'var(--bg-alt)', cursor: 'default', fontWeight: 600 }}>{user.fullName}</div>
                  </div>
                  <div className="form-group">
                    <div className="form-label">Phone Number</div>
                    <div className="form-control" style={{ background: 'var(--bg-alt)', cursor: 'default', fontWeight: 600 }}>{user.phone}</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Special Requests (Optional)</label>
                    <textarea
                      className="form-control"
                      placeholder="Any specific hairstyle, preference, or notes for your stylist..."
                      value={selected.notes}
                      onChange={e => setSelected(s => ({ ...s, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="booking-actions-bar">
              <button onClick={() => setStep(2)} className="btn btn-ghost"><FiArrowLeft size={15} /> Back</button>
              <button onClick={handleNext} className="btn btn-primary">
                Review Booking <FiArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Confirm */}
        {step === 4 && (
          <div className="animate-slide-up" style={{ maxWidth: 540, margin: '0 auto' }}>
            <h2 className="heading-sm font-serif" style={{ marginBottom: '1.25rem' }}>Confirm Appointment</h2>
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    ['Service', selected.service?.name],
                    ['Specialist', selected.worker?.name],
                    ['Date', format(selected.date, 'EEEE, dd MMMM yyyy')],
                    ['Time', selected.time ? formatSlotTime(selected.time) : '—'],
                    ['Price', `₹${selected.service?.price}`],
                    ['Duration', `${selected.service?.duration} min`],
                  ].map(([label, val]) => (
                    <div key={label} className="appointment-detail-row">
                      <span className="appointment-detail-label">{label}</span>
                      <span className="appointment-detail-value">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ background: 'var(--accent-light)', border: '1px solid rgba(199,167,108,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.8125rem', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiInfo size={16} style={{ flexShrink: 0 }} /> Your appointment will be confirmed by the salon. You'll receive instant updates.
            </div>
            <div className="booking-actions-bar">
              <button onClick={() => setStep(3)} className="btn btn-ghost"><FiArrowLeft size={15} /> Back</button>
              <button onClick={handleConfirm} className="btn btn-accent" disabled={booking} style={{ flex: 1.5 }}>
                {booking ? <><div className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> Booking...</> : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
