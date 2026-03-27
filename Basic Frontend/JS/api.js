const API_BASE = 'https://localhost:5001';

export const TokenStore = {
  set(token, username, role) {
    localStorage.setItem('qm_token', token);
    localStorage.setItem('qm_user', username);
    localStorage.setItem('qm_role', role);
  },
  get() {
    return localStorage.getItem('qm_token');
  },
  clear() {
    localStorage.clear();
  }
};

async function apiFetch(path, options = {}) {
  const token = TokenStore.get();

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid API response");
  }

  if (!res.ok) throw new Error(data.message || 'Error');

  return data;
}

// ================= AUTH =================
export const AuthApi = {
  async login(username, password) {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    TokenStore.set(data.token, data.username, data.role);
    return data;
  },

  async register(username, password, role = 'User') {
    return apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, role })
    });
  }
};

// ================= QUANTITY =================
export const QuantityApi = {
  convert(value, fromUnit, toUnit) {
    return apiFetch('/api/v1/quantities/convert', {
      method: 'POST',
      body: JSON.stringify({
        source: {
          value: value,
          unit: fromUnit,
          category: "LENGTH"
        },
        targetUnit: toUnit
      })
    });
  },

  getHistory() {
    return apiFetch('/api/v1/quantities/history');
  }
};