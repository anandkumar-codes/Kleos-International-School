const startOfToday = () => new Date(new Date().toDateString());

export const upcomingEvents = (events) =>
  events.filter((e) => new Date(e.date) >= startOfToday()).sort((a, b) => new Date(a.date) - new Date(b.date));

export const pastEvents = (events) =>
  events.filter((e) => new Date(e.date) < startOfToday()).sort((a, b) => new Date(b.date) - new Date(a.date));

export const sortedNotices = (list) =>
  [...list].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || new Date(b.date) - new Date(a.date));
