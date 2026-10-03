import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

// School time (IST) regardless of the visitor's own timezone.
const TZ = 'Asia/Kolkata';
const fmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  weekday: 'long',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
});

function parts(now) {
  const p = Object.fromEntries(fmt.formatToParts(now).map((x) => [x.type, x.value]));
  return {
    date: `${p.day}-${p.month}-${p.year}`, // DD-MM-YYYY
    day: p.weekday,
    time: `${p.hour}:${p.minute}:${p.second} ${p.dayPeriod.toUpperCase()}`, // HH:MM:SS AM/PM
  };
}

export default function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer;
    // Align ticks to the start of each second so the seconds never skip.
    const tick = () => {
      setNow(new Date());
      timer = setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    timer = setTimeout(tick, 1000 - (Date.now() % 1000));
    return () => clearTimeout(timer);
  }, []);

  const { date, day, time } = parts(now);
  return (
    <div className="live-clock" title="India Standard Time (school time)">
      <Clock className="live-clock__icon" aria-hidden />
      <div>
        <span className="live-clock__date">
          {date} <span className="live-clock__sep">·</span> {day}
        </span>
        {/* Screen readers get the full value once rather than every second */}
        <time className="live-clock__time" dateTime={now.toISOString()} aria-live="off">
          {time}
        </time>
      </div>
    </div>
  );
}
