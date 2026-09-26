import { useMemo, useState } from 'react';
import { UtensilsCrossed, Star } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';
import { DetailDrawer, EmptyState, FilterSelect, LoadingTable, MetaGrid, SearchFilterBar, StudentChip, SummaryCards } from '../components/ops/OpsShared';

const skipClass = {
  pending: 'badge--warning',
  approved: 'badge--success',
  rejected: 'badge--danger',
};

export default function AdminMessPage() {
  const {
    hydrating, messMenu, messSkips, messFeedback, studentById,
    toggleMenuAvailability, reviewMessSkip, acknowledgeFeedback,
  } = useHostelStore();
  const [tab, setTab] = useState('skips');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedSkip, setSelectedSkip] = useState(null);
  const [selectedFb, setSelectedFb] = useState(null);

  const skips = useMemo(() => messSkips.filter((s) => {
    if (status !== 'all' && s.status !== status) return false;
    const student = studentById(s.studentId);
    if (!search) return true;
    const q = search.toLowerCase();
    return student?.name.toLowerCase().includes(q) || s.meal.toLowerCase().includes(q) || s.reason.toLowerCase().includes(q);
  }), [messSkips, status, search, studentById]);

  const avgRating = messFeedback.length
    ? (messFeedback.reduce((s, f) => s + f.rating, 0) / messFeedback.length).toFixed(1)
    : '—';

  if (hydrating) {
    return (
      <div className="page-content">
        <div className="page-header"><h1 className="page-header__greeting">Mess</h1></div>
        <LoadingTable />
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'fadeInUp 400ms ease' }}>
        <h1 className="page-header__greeting">Mess</h1>
        <p className="page-header__subtitle">Weekend menu, meal skips, and kitchen feedback for ABC Residency.</p>
      </div>

      <SummaryCards items={[
        { label: 'Menu items live', value: messMenu.filter((m) => m.available).length, color: 'var(--success-600)' },
        { label: 'Skip pending', value: messSkips.filter((s) => s.status === 'pending').length, color: 'var(--warning-600)' },
        { label: 'Approved skips', value: messSkips.filter((s) => s.status === 'approved').length, color: 'var(--accent-600)' },
        { label: 'Avg rating', value: avgRating, color: 'var(--text-primary)', hint: `${messFeedback.length} reviews` },
      ]} />

      <div className="tabs" style={{ marginBottom: 16 }}>
        {['menu', 'skips', 'feedback'].map((t) => (
          <button key={t} type="button" className={`tab ${tab === t ? 'tab--active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'menu' && (
        <div className="data-table-wrapper" style={{ animation: 'fadeInUp 500ms ease' }}>
          <div className="data-table-toolbar">
            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>Saturday–Sunday kitchen board</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Meal</th>
                <th>Items</th>
                <th>Time</th>
                <th>Available</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {messMenu.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.day}</td>
                  <td>{m.meal}</td>
                  <td>{m.items}</td>
                  <td>{m.time}</td>
                  <td><span className={`badge ${m.available ? 'badge--success' : 'badge--danger'}`}>{m.available ? 'Serving' : 'Stopped'}</span></td>
                  <td>
                    <button type="button" className="btn btn--secondary btn--sm" onClick={() => toggleMenuAvailability(m.id)}>
                      {m.available ? 'Stop serving' : 'Resume'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'skips' && (
        <div className="data-table-wrapper" style={{ animation: 'fadeInUp 500ms ease' }}>
          <SearchFilterBar search={search} onSearch={setSearch} placeholder="Search student or meal..." countLabel={`${skips.length} skip requests`}>
            <FilterSelect
              value={status}
              onChange={setStatus}
              options={[
                { value: 'all', label: 'All statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
            />
          </SearchFilterBar>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Date</th>
                <th>Meal</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skips.length === 0 ? (
                <tr>
                  <td colSpan="6"><EmptyState icon={UtensilsCrossed} title="No skip requests match." /></td>
                </tr>
              ) : skips.map((s) => (
                <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedSkip(s.id)}>
                  <td><StudentChip student={studentById(s.studentId)} /></td>
                  <td>{s.date}</td>
                  <td>{s.meal}</td>
                  <td style={{ maxWidth: 280 }}>{s.reason}</td>
                  <td><span className={`badge ${skipClass[s.status]}`}>{s.status}</span></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {s.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" className="btn btn--primary btn--sm" onClick={() => reviewMessSkip(s.id, 'approved')}>Approve</button>
                        <button type="button" className="btn btn--ghost btn--sm" onClick={() => reviewMessSkip(s.id, 'rejected')}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'feedback' && (
        <div className="data-table-wrapper" style={{ animation: 'fadeInUp 500ms ease' }}>
          <div className="data-table-toolbar">
            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>{messFeedback.length} kitchen reviews</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Meal</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {messFeedback.map((f) => (
                <tr key={f.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedFb(f.id)}>
                  <td><StudentChip student={studentById(f.studentId)} /></td>
                  <td>{f.meal}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                      <Star size={13} /> {f.rating}/5
                    </span>
                  </td>
                  <td style={{ maxWidth: 320 }}>{f.comment}</td>
                  <td><span className={`badge ${f.status === 'open' ? 'badge--warning' : 'badge--success'}`}>{f.status}</span></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {f.status === 'open' && (
                      <button type="button" className="btn btn--secondary btn--sm" onClick={() => acknowledgeFeedback(f.id)}>Acknowledge</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedSkip && messSkips.find((s) => s.id === selectedSkip) && (
        <DetailDrawer
          title="Meal skip"
          onClose={() => setSelectedSkip(null)}
          footer={messSkips.find((s) => s.id === selectedSkip).status === 'pending' ? (
            <>
              <button type="button" className="btn btn--primary" onClick={() => reviewMessSkip(selectedSkip, 'approved')}>Approve skip</button>
              <button type="button" className="btn btn--ghost" onClick={() => reviewMessSkip(selectedSkip, 'rejected')}>Reject</button>
            </>
          ) : null}
        >
          {(() => {
            const s = messSkips.find((x) => x.id === selectedSkip);
            return (
              <>
                <StudentChip student={studentById(s.studentId)} />
                <div style={{ height: 16 }} />
                <MetaGrid items={[
                  { label: 'Meal', value: s.meal },
                  { label: 'Date', value: s.date },
                  { label: 'Status', value: s.status },
                  { label: 'Student payment', value: studentById(s.studentId)?.payment },
                ]} />
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{s.reason}</p>
              </>
            );
          })()}
        </DetailDrawer>
      )}

      {selectedFb && messFeedback.find((f) => f.id === selectedFb) && (
        <DetailDrawer
          title="Kitchen feedback"
          onClose={() => setSelectedFb(null)}
          footer={messFeedback.find((f) => f.id === selectedFb).status === 'open' ? (
            <button type="button" className="btn btn--primary" onClick={() => acknowledgeFeedback(selectedFb)}>Acknowledge & notify kitchen</button>
          ) : (
            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-tertiary)' }}>Kitchen already notified.</span>
          )}
        >
          {(() => {
            const f = messFeedback.find((x) => x.id === selectedFb);
            return (
              <>
                <StudentChip student={studentById(f.studentId)} />
                <div style={{ height: 16 }} />
                <MetaGrid items={[
                  { label: 'Meal', value: f.meal },
                  { label: 'Date', value: f.date },
                  { label: 'Rating', value: `${f.rating} / 5` },
                  { label: 'Status', value: f.status },
                ]} />
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{f.comment}</p>
              </>
            );
          })()}
        </DetailDrawer>
      )}
    </div>
  );
}
