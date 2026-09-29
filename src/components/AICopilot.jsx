import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Sparkles, ArrowUp, MessageSquare, BarChart3, AlertTriangle, FileText,
  X, Download, Bot, User, LoaderCircle
} from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

const suggestions = [
  { text: 'What needs my attention today?', icon: AlertTriangle },
  { text: 'Which block has the most complaints?', icon: MessageSquare },
  { text: 'Show high conflict risk rooms', icon: AlertTriangle },
  { text: 'Why did satisfaction decrease?', icon: BarChart3 },
  { text: "Generate this month's report", icon: FileText },
];

const money = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

function getBlock(room) {
  return String(room || '').match(/\b([A-Z])[- ]?\d{3}\b/i)?.[1]?.toUpperCase() || null;
}

function buildMonthlyReport(data) {
  const month = new Date(`${data.today}T00:00:00`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const occupancy = data.rooms.reduce((sum, room) => sum + Number(room.occupied || 0), 0);
  const capacity = data.rooms.reduce((sum, room) => sum + Number(room.capacity || 0), 0);
  const activeComplaints = data.complaints.filter((item) => item.status !== 'resolved');
  const unpaid = data.payments.filter((item) => item.status !== 'paid');
  const unpaidTotal = unpaid.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const pendingLeave = data.leaveRequests.filter((item) => item.status === 'pending');
  const overdueMaintenance = data.maintenance.filter((item) => item.status === 'overdue');
  const topCategory = Object.entries(activeComplaints.reduce((counts, item) => {
    counts[item.category || 'Other'] = (counts[item.category || 'Other'] || 0) + 1;
    return counts;
  }, {})).sort((a, b) => b[1] - a[1])[0];

  return [
    `MatchoMate hostel summary — ${month}`,
    '',
    `Students: ${data.students.length}`,
    `Room occupancy: ${occupancy}/${capacity}${capacity ? ` (${Math.round((occupancy / capacity) * 100)}%)` : ''}`,
    `Unresolved complaints: ${activeComplaints.length}${topCategory ? `; leading category: ${topCategory[0]} (${topCategory[1]})` : ''}`,
    `Pending leave requests: ${pendingLeave.length}`,
    `Overdue maintenance tasks: ${overdueMaintenance.length}`,
    `Unpaid payments: ${unpaid.length} totaling ${money(unpaidTotal)}`,
    `High conflict risk rooms: ${data.riskRooms.length}`,
    '',
    'Generated from the current MatchoMate workspace records.',
  ].join('\n');
}

function makeAnswer(question, data) {
  const q = question.toLowerCase();
  const activeComplaints = data.complaints.filter((item) => item.status !== 'resolved');
  const pendingLeave = data.leaveRequests.filter((item) => item.status === 'pending');
  const pendingVisitors = data.visitors.filter((item) => ['pending-approval', 'expected'].includes(item.status));
  const openMaintenance = data.maintenance.filter((item) => ['open', 'overdue'].includes(item.status));
  const overdueMaintenance = data.maintenance.filter((item) => item.status === 'overdue');
  const unpaid = data.payments.filter((item) => item.status !== 'paid');
  const unpaidTotal = unpaid.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  if (/report|monthly summary|month['’]?s summary/.test(q)) {
    return {
      text: 'I prepared a monthly summary from the current workspace records. You can download the report below.',
      report: buildMonthlyReport(data),
    };
  }

  if (/attention|urgent|priority|today|needs? my attention/.test(q)) {
    const points = [
      `${activeComplaints.length} unresolved complaints (${activeComplaints.filter((item) => item.priority === 'critical').length} critical).`,
      `${pendingLeave.length} leave requests are waiting for review.`,
      `${overdueMaintenance.length} maintenance tasks are overdue; ${openMaintenance.length} are open or overdue.`,
      `${unpaid.length} payments remain unpaid, totaling ${money(unpaidTotal)}.`,
      `${pendingVisitors.length} visitors are expected or awaiting approval.`,
    ];
    return { text: `Here are the current items that may need attention:\n\n${points.map((point) => `• ${point}`).join('\n')}\n\nThese counts come from the records currently loaded in MatchoMate.` };
  }

  if (/complaint/.test(q) && /block|where|most|highest/.test(q)) {
    const byBlock = activeComplaints.reduce((counts, item) => {
      const block = getBlock(item.room);
      if (block) counts[block] = (counts[block] || 0) + 1;
      return counts;
    }, {});
    const ranking = Object.entries(byBlock).sort((a, b) => b[1] - a[1]);
    if (!ranking.length) return { text: 'I can’t identify a leading block because the unresolved complaint records don’t include room numbers.' };
    const [block, count] = ranking[0];
    const tied = ranking.filter(([, total]) => total === count).map(([name]) => `Block ${name}`);
    return { text: `${tied.join(' and ')} have the most unresolved complaints, with ${count} each. I counted complaints whose status is open or in progress and grouped them by the block in the room number.` };
  }

  if (/conflict|risk|compatib/.test(q)) {
    if (!data.riskRooms.length) return { text: 'There are no rooms currently marked high conflict risk in the roommate intelligence data.' };
    const rows = data.riskRooms.map((room) => {
      const names = room.students?.length ? ` — ${room.students.join(' & ')}` : '';
      return `• Room ${room.room}${names}: ${room.score}% compatibility`;
    });
    return { text: `High conflict risk rooms in the current roommate intelligence data:\n\n${rows.join('\n')}` };
  }

  if (/satisfaction|experience|decreas|declin/.test(q)) {
    const breakdown = data.experienceData?.breakdown || [];
    const lowest = [...breakdown].sort((a, b) => a.value - b.value)[0];
    const score = data.experienceData?.overall ?? data.hostelHealth?.studentExperience;
    const lowText = lowest ? ` The lowest current category is ${lowest.label} at ${lowest.value}%.` : '';
    return { text: `The latest satisfaction snapshot is ${score ?? 'not available'}%.${lowText} The workspace only has a current snapshot, so it doesn’t contain enough history to confirm what caused a decrease over time.` };
  }

  if (/payment|fee|dues?|unpaid/.test(q)) {
    return { text: `${unpaid.length} payments are currently unpaid, totaling ${money(unpaidTotal)}. This includes any pending or overdue payments in the loaded records.` };
  }

  if (/attendance|absent|present|roll.?call/.test(q)) {
    const records = data.attendance.filter((record) => record.date === data.today);
    const present = records.filter((record) => ['present', 'late'].includes(record.status)).length;
    const absent = records.filter((record) => record.status === 'absent').length;
    const onLeave = records.filter((record) => record.status === 'leave').length;
    const unmarked = Math.max(0, data.students.length - records.length);
    return { text: `For ${data.today}, the records show ${present} present or late, ${absent} absent, ${onLeave} on leave, and ${unmarked} students without an attendance record (${data.students.length} students total).` };
  }

  if (/occupancy|vacant|beds?|rooms?/.test(q)) {
    const occupied = data.rooms.reduce((sum, room) => sum + Number(room.occupied || 0), 0);
    const capacity = data.rooms.reduce((sum, room) => sum + Number(room.capacity || 0), 0);
    const vacant = Math.max(0, capacity - occupied);
    const rate = capacity ? Math.round((occupied / capacity) * 100) : 0;
    return { text: `${occupied} of ${capacity} beds are occupied (${rate}%), leaving ${vacant} vacant beds across ${data.rooms.length} room records.` };
  }

  if (/visitor|guest/.test(q)) {
    return { text: `${pendingVisitors.length} visitors are expected or awaiting approval. There are ${data.visitors.filter((item) => item.status === 'checked-in').length} visitors currently checked in.` };
  }

  if (/maintenance|repair|work order/.test(q)) {
    const list = openMaintenance.slice(0, 5).map((task) => `• ${task.title} — ${task.status}${task.due ? ` (due ${task.due})` : ''}`);
    return { text: openMaintenance.length
      ? `${openMaintenance.length} maintenance tasks are open or overdue:\n\n${list.join('\n')}${openMaintenance.length > list.length ? `\n• And ${openMaintenance.length - list.length} more.` : ''}`
      : 'There are no open or overdue maintenance tasks in the current records.' };
  }

  if (/help|what can you|what do you/.test(q)) {
    return { text: 'I can summarize current complaints by block, pending actions, high-risk roommate matches, attendance, fees, visitors, maintenance, occupancy, and satisfaction. I can also prepare a downloadable monthly summary.' };
  }

  return { text: 'I can answer questions using the hostel data currently available. Try asking about complaints, pending actions, conflict risk rooms, satisfaction, attendance, fees, visitors, maintenance, occupancy, or a monthly summary.' };
}

export default function AICopilot({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);
  const { students, rooms, complaints, attendance, payments, leaveRequests, maintenance,
    visitors, recentActivity, complaintStats, kpi, hostelHealth, experienceData,
    roommateIntelligence, today } = useHostelStore();

  const context = useMemo(() => ({
    students, rooms, complaints, attendance, payments, leaveRequests, maintenance,
    visitors, recentActivity, complaintStats, kpi, hostelHealth, experienceData,
    riskRooms: roommateIntelligence?.allocations?.filter((room) => room.risk === 'high') || [],
    today,
  }), [students, rooms, complaints, attendance, payments, leaveRequests, maintenance,
    visitors, recentActivity, complaintStats, kpi, hostelHealth, experienceData, roommateIntelligence, today]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const frame = requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
    return () => cancelAnimationFrame(frame);
  }, [messages, isThinking, isOpen]);

  if (!isOpen) return null;

  const sendMessage = async (value = input) => {
    const question = value.trim();
    if (!question || isThinking) return;
    setInput('');
    setMessages((previous) => [...previous, { id: `user-${Date.now()}`, role: 'user', text: question }]);
    setIsThinking(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    const answer = makeAnswer(question, context);
    setMessages((previous) => [...previous, { id: `assistant-${Date.now()}`, role: 'assistant', ...answer }]);
    setIsThinking(false);
  };

  const downloadReport = (report) => {
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `matchomate-monthly-summary-${today}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="command-overlay copilot-overlay" onClick={onClose}>
      <section
        className="command-palette copilot-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Ask MatchoMate"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="copilot-header">
          <div className="copilot-brand-icon"><Sparkles size={18} /></div>
          <div className="copilot-heading">
            <strong>Ask MatchoMate</strong>
            <span>Hostel insights from your current workspace data</span>
          </div>
          <button type="button" className="topbar__action-btn" onClick={onClose} aria-label="Close assistant">
            <X size={18} />
          </button>
        </header>

        <div className="copilot-messages" ref={scrollRef} aria-live="polite">
          {messages.length === 0 && (
            <div className="copilot-welcome">
              <Sparkles size={26} />
              <h2>How can I help?</h2>
              <p>Ask about hostel operations, students, or trends. I’ll use the records currently loaded in MatchoMate.</p>
              <div className="copilot-suggestions">
                {suggestions.map(({ text, icon: Icon }) => (
                  <button type="button" className="copilot-suggestion" key={text} onClick={() => sendMessage(text)}>
                    <Icon size={16} />
                    <span>{text}</span>
                    <ArrowUp size={14} />
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((message) => (
            <article className={`copilot-message copilot-message--${message.role}`} key={message.id}>
              <div className="copilot-message__avatar">
                {message.role === 'assistant' ? <Sparkles size={15} /> : <User size={15} />}
              </div>
              <div className="copilot-message__content">
                <span className="copilot-message__author">{message.role === 'assistant' ? 'MatchoMate' : 'You'}</span>
                <p>{message.text}</p>
                {message.report && (
                  <button type="button" className="copilot-download" onClick={() => downloadReport(message.report)}>
                    <Download size={15} /> Download monthly report
                  </button>
                )}
              </div>
            </article>
          ))}
          {isThinking && (
            <div className="copilot-thinking" role="status">
              <LoaderCircle size={16} className="copilot-spinner" /> Looking through current records…
            </div>
          )}
        </div>

        <form className="copilot-composer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
          <textarea
            aria-label="Ask MatchoMate a question"
            placeholder="Ask about complaints, attendance, payments…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
          />
          <button type="submit" className="copilot-send" disabled={!input.trim() || isThinking} aria-label="Send question">
            <ArrowUp size={17} />
          </button>
          <span className="copilot-composer-hint">Enter to send · Shift+Enter for a new line</span>
        </form>
        <footer className="copilot-footer"><Bot size={13} /> Answers reflect the latest data loaded in this workspace</footer>
      </section>
    </div>
  );
}
