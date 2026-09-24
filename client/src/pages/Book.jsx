import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCheck, FiCalendar, FiClock, FiUser, FiScissors, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format, addDays } from 'date-fns';

const STEPS = ['Service', 'Worker', 'Date & Time', 'Details', 'Confirm'];

function StepIndicator({ current }) {
  return (
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

  const [selected, setSelected] = useState({
    service: null,
    worker: null,
    date: addDays(new Date(), 1),
    time: null,
    notes: ''
  });

  useEffect(() => {
    document.title = 'Book Appointment | Trendy Cutz';
    api.get('/services').then(r => setServices(r.data.services));
    api.get('/workers').then(r => {
      setWorkers(r.data.workers);
      const wId = searchParams.get('worker');
      if (wId) {
        const w = r.data.workers.find(x => x._id === wId);
        if (w) setSelected(s => ({ ...s, worker: w }));
      }
    });
    const sId = searchParams.get('service');
    if (sId) {
      api.get(`/services/${sId}`).then(r => setSelected(s => ({ ...s, service: r.data.service })));
    }
  }, []);

  const fetchSlots = async (workerId, date) => {
    setLoadingSlots(true);
    setSlots([]);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const r = await api.get(`/appointments/available-slots?workerId=${workerId}&date=${dateStr}`);
      setSlots(r.data.slots || []);
      if (r.data.message) toast(r.data.message, { icon: 'ℹ️' });
    } catch {
      toast.error('Failed to load slots');
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
      if (!user) { toast('Please login to confirm booking', { icon: '🔒' }); navigate('/login?redirect=/book'); return; }
    }
    setStep(s => Math.min(s + 1, 4));
  };

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

  const availableWorkers = selected.service
    ? workers.filter(w => {
        if (!w.isActive) return false;
        const sWorkers = selected.service.availableWorkers;
        if (!sWorkers || sWorkers.length === 0) return true;
        return sWorkers.some(sw => (sw._id || sw) === w._id);
      })
    : workers.filter(w => w.isActive);

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
            <div className="confirmation-icon">🎉</div>
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
            <h2 className="heading-sm font-serif" style={{ marginBottom: '1.5rem' }}>Choose a Service</h2>
            {services.length === 0 ? (
              <div className="spinner" />
            ) : (
              <div className="grid-3" style={{ gap: '1rem' }}>
                {services.map(s => (
                  <button
                    key={s._id}
                    onClick={() => handleServiceSelect(s)}
                    className={`card ${selected.service?._id === s._id ? 'selected' : ''}`}
                    style={{
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: '1.25rem',
                      border: selected.service?._id === s._id ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: selected.service?._id === s._id ? 'var(--accent-light)' : 'white',
                      boxShadow: selected.service?._id === s._id ? 'var(--shadow-accent)' : undefined
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.625rem' }}>
                      {{Hair:'✂️',Beard:'🪒',Beauty:'💆',Spa:'🧴',Other:'⭐'}[s.category]}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', marginBottom: '0.25rem' }}>{s.name}</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>{s.duration} min</div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-dark)' }}>₹{s.price}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 1: Choose Worker */}
        {step === 1 && (
          <div className="animate-slide-up">
            <h2 className="heading-sm font-serif" style={{ marginBottom: '0.5rem' }}>Choose a Specialist</h2>
            {selected.service && <p style={{ color: 'var(--secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>For: <strong>{selected.service.name}</strong></p>}
            <div className="grid-4" style={{ gap: '1rem' }}>
              {availableWorkers.map(w => (
                <button
                  key={w._id}
                  onClick={() => handleWorkerSelect(w)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    padding: '1.5rem 1rem',
                    border: selected.worker?._id === w._id ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: selected.worker?._id === w._id ? 'var(--accent-light)' : 'white'
                  }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-dark)', fontFamily: 'var(--font-serif)' }}>
                    {w.name.charAt(0)}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{w.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, marginBottom: 4 }}>{w.role}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{w.experience}y exp.</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="btn btn-ghost" style={{ marginTop: '1.5rem' }}>
              <FiArrowLeft size={15} /> Back
            </button>
          </div>
        )}

        {/* STEP 2: Date & Time */}
        {step === 2 && (
          <div className="animate-slide-up">
            <h2 className="heading-sm font-serif" style={{ marginBottom: '1.5rem' }}>Choose Date & Time</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <div className="form-label">Select Date</div>
                <DatePicker
                  selected={selected.date}
                  onChange={handleDateChange}
                  minDate={addDays(new Date(), 1)}
                  maxDate={addDays(new Date(), 30)}
                  inline
                  calendarClassName="tc-calendar"
                />
              </div>
              <div>
                <div className="form-label">Available Time Slots</div>
                {loadingSlots ? (
                  <div style={{ padding: '2rem', textAlign: 'center' }}><div className="spinner" /></div>
                ) : slots.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                    <div style={{ fontSize: '2rem' }}>📅</div>
                    <p>No slots available for this date. Please try another date.</p>
                  </div>
                ) : (
                  <div className="time-slots">
                    {slots.map(slot => (
                      <button
                        key={slot.time}
                        onClick={() => handleTimeSelect(slot)}
                        className={`time-slot${slot.isBooked ? ' booked' : selected.time === slot.time ? ' selected' : ''}`}
                        disabled={slot.isBooked}
                      >
                        {slot.display}
                        {slot.isBooked && <div style={{ fontSize: '0.6rem', marginTop: 2 }}>Booked</div>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={() => setStep(1)} className="btn btn-ghost"><FiArrowLeft size={15} /> Back</button>
              <button onClick={handleNext} className="btn btn-primary" disabled={!selected.time}>
                Continue <FiArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Details */}
        {step === 3 && (
          <div className="animate-slide-up" style={{ maxWidth: 500 }}>
            <h2 className="heading-sm font-serif" style={{ marginBottom: '1.5rem' }}>Your Details</h2>
            {!user ? (
              <div className="alert alert-info">
                <span>Please <Link to="/login?redirect=/book" style={{ fontWeight: 700, textDecoration: 'underline' }}>login</Link> to complete your booking.</span>
              </div>
            ) : (
              <div className="card">
                <div className="card-body">
                  <div className="form-group">
                    <div className="form-label">Name</div>
                    <div className="form-control" style={{ background: 'var(--bg-alt)', cursor: 'default' }}>{user.fullName}</div>
                  </div>
                  <div className="form-group">
                    <div className="form-label">Phone</div>
                    <div className="form-control" style={{ background: 'var(--bg-alt)', cursor: 'default' }}>{user.phone}</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Special Requests (Optional)</label>
                    <textarea
                      className="form-control"
                      placeholder="Any special requests or notes for your stylist..."
                      value={selected.notes}
                      onChange={e => setSelected(s => ({ ...s, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={() => setStep(2)} className="btn btn-ghost"><FiArrowLeft size={15} /> Back</button>
              <button onClick={handleNext} className="btn btn-primary">
                Review Booking <FiArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Confirm */}
        {step === 4 && (
          <div className="animate-slide-up" style={{ maxWidth: 520 }}>
            <h2 className="heading-sm font-serif" style={{ marginBottom: '1.5rem' }}>Confirm Appointment</h2>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    ['Service', selected.service?.name],
                    ['Specialist', selected.worker?.name],
                    ['Date', format(selected.date, 'EEEE, dd MMMM yyyy')],
                    ['Time', (() => { const [h,m] = selected.time.split(':').map(Number); const p = h>=12?'PM':'AM'; return `${h%12||12}:${String(m).padStart(2,'0')} ${p}`; })()],
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
            <div style={{ background: 'var(--accent-light)', border: '1px solid rgba(199,167,108,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.8125rem', color: 'var(--accent-dark)' }}>
              ℹ️ Your appointment will be confirmed by the salon. You'll be notified.
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setStep(3)} className="btn btn-ghost"><FiArrowLeft size={15} /> Back</button>
              <button onClick={handleConfirm} className="btn btn-accent" disabled={booking} style={{ flex: 1 }}>
                {booking ? <><div className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> Booking...</> : <>🎉 Confirm Booking</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
