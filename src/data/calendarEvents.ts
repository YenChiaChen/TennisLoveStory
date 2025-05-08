import type { CalendarEvent } from '../types';

export const CALENDAR_EVENTS_DATA: CalendarEvent[] = [
  { id: 'ev001', day: 1, timeOfDay: 'any', title: "加入網球隊", description: "第一次參加網球隊", locationId: 'tennis_court_day', isMajorEvent: true },
  { id: 'ev002', day: 2, timeOfDay: 'any', title: "網球隊迎新唱K", isMajorEvent: true },
  { id: 'ev003', day: 15, timeOfDay: 'any', title: "大專盃", isMajorEvent: true },
  // Add more events...
];

// Helper to get events for a specific day or range (optional)
export const getEventsForDay = (day: number): CalendarEvent[] => {
    return CALENDAR_EVENTS_DATA.filter(event => event.day === day);
};

export const getUpcomingEvents = (currentDay: number, lookahead: number = 7): CalendarEvent[] => {
    return CALENDAR_EVENTS_DATA
        .filter(event => event.day >= currentDay && event.day < currentDay + lookahead)
        .sort((a, b) => a.day - b.day); // Sort by day
};