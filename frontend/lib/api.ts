const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const api = {
  // AUTH
  register: async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  // USERS
  getMe: async (token: string) => {
    const res = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  updateMe: async (token: string, data: object) => {
    const res = await fetch(`${API_URL}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getMatches: async (token: string) => {
    const res = await fetch(`${API_URL}/users/matches`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  searchUsers: async (token: string, skill: string) => {
    const res = await fetch(`${API_URL}/users/search?skill=${skill}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  getUserById: async (token: string, id: string) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // SWAPS
  sendSwapRequest: async (token: string, data: object) => {
    const res = await fetch(`${API_URL}/swaps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  

  getSwaps: async (token: string) => {
    const res = await fetch(`${API_URL}/swaps`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  acceptSwap: async (token: string, id: string) => {
    const res = await fetch(`${API_URL}/swaps/${id}/accept`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  getMessages: async (token: string, swapId: string) => {
  const res = await fetch(`${API_URL}/messages/${swapId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
},

getNotifications: async (token: string) => {
  const res = await fetch(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
},

createNotification: async (token: string, data: object) => {
  const res = await fetch(`${API_URL}/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
},

markNotificationsRead: async (token: string) => {
  const res = await fetch(`${API_URL}/notifications/read-all`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
},

sendMessage: async (token: string, swapId: string, content: string) => {
  const res = await fetch(`${API_URL}/messages/${swapId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  })
  return res.json()
},

  declineSwap: async (token: string, id: string) => {
    const res = await fetch(`${API_URL}/swaps/${id}/decline`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};



// Save token to localStorage
export const saveToken = (token: string) => {
  localStorage.setItem("skillswap_token", token);
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("skillswap_token");
};

// Remove token (logout)
export const removeToken = () => {
  localStorage.removeItem("skillswap_token");
};

