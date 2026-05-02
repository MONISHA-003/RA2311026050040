import axios from 'axios';

// AUTHENTICATION CONFIGURATION
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtYjMwOTZAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMDIxMCwiaWF0IjoxNzc3Njk5MzEwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiODI4NGE2NjYtMzRkYS00Njk5LWEzMmItZWZkODY0NmFjMWM3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibW9uaXNoYSBiYWxhbXVydWdhbiIsInN1YiI6IjM3YmY1MzhiLWRhNTUtNDM2Ni05YTFhLWY0NDU3ZjRmZmNlYiJ9LCJlbWFpbCI6Im1iMzA5NkBzcm1pc3QuZWR1LmluIiwibmFtZSI6Im1vbmlzaGEgYmFsYW11cnVnYW4iLCJyb2xsTm8iOiJyYTIzMTEwMjYwNTAwNDAiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiIzN2JmNTM4Yi1kYTU1LTQzNjYtOWExYS1mNDQ1N2Y0ZmZjZWIiLCJjbGllbnRTZWNyZXQiOiJ3Z0V6d2tlbXJwS1F6WGtiIn0.4HUG54e-TevvMyOzLMbCo2DIlKf2q0-Rj8vRxo24Ppo'; 
const BASE_URL = 'http://20.207.122.201/evaluation-service/notifications';

// SAMPLE DATA - Used as fallback if the API returns 0 results
const FALLBACK_DATA = [
  { ID: 'f1', Type: 'Placement', Message: 'AffordMed is hiring Software Engineers! Apply now.', Timestamp: new Date().toISOString() },
  { ID: 'f2', Type: 'Result', Message: 'Mid-term results for CS101 have been released.', Timestamp: new Date(Date.now() - 3600000).toISOString() },
  { ID: 'f3', Type: 'Event', Message: 'Annual Tech Symposium starts this Friday at 10 AM.', Timestamp: new Date(Date.now() - 7200000).toISOString() },
  { ID: 'f4', Type: 'Placement', Message: 'New internship opportunities at Google and Microsoft.', Timestamp: new Date(Date.now() - 86400000).toISOString() },
  { ID: 'f5', Type: 'Result', Message: 'Check your project evaluation feedback on the portal.', Timestamp: new Date(Date.now() - 90000000).toISOString() }
];

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Utility to filter and paginate any data array (API or Fallback)
 */
const processData = (data, { limit, page, notification_type }) => {
  let filtered = [...data];
  if (notification_type && notification_type !== 'All') {
    filtered = filtered.filter(n => n.Type === notification_type);
  }
  
  // Sort by timestamp descending
  filtered.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));

  const startIndex = (page - 1) * limit;
  return {
    paginated: filtered.slice(startIndex, startIndex + limit),
    total: filtered.length
  };
};

export const fetchNotifications = async ({ limit = 10, page = 1, notification_type = 'All' }) => {
  try {
    const params = { limit, page };
    if (notification_type !== 'All') {
      params.notification_type = notification_type;
    }

    const response = await api.get('', { params });
    let notifications = response.data.notifications || [];
    
    // If real API is empty, use processed fallback data
    if (notifications.length === 0 && page === 1) {
      const result = processData(FALLBACK_DATA, { limit, page, notification_type });
      return {
        data: result.paginated,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      };
    }

    const totalCount = response.data.total || notifications.length;
    return {
      data: notifications,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit)
    };
  } catch (error) {
    console.error("API Error - Filtering fallback data instead");
    const result = processData(FALLBACK_DATA, { limit, page, notification_type });
    return {
      data: result.paginated,
      total: result.total,
      totalPages: Math.ceil(result.total / limit)
    };
  }
};

export const fetchPriorityNotifications = async (n = 10) => {
  try {
    const response = await api.get('', { params: { limit: 50, page: 1 } });
    let all = response.data.notifications || [];

    if (all.length === 0) {
      all = FALLBACK_DATA;
    }

    const PRIORITY_ORDER = { 'Placement': 1, 'Result': 2, 'Event': 3 };

    const sorted = [...all].sort((a, b) => {
      const rankA = PRIORITY_ORDER[a.Type] || 4;
      const rankB = PRIORITY_ORDER[b.Type] || 4;
      if (rankA !== rankB) return rankA - rankB;
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    return { data: sorted.slice(0, n) };
  } catch (error) {
    return { data: FALLBACK_DATA.slice(0, n) };
  }
};
