const API_BASE = "/api";

const api = {
    getToken() {
        return localStorage.getItem("access_token");
    },

    getRefreshToken() {
        return localStorage.getItem("refresh_token");
    },

    saveTokens(access, refresh) {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
    },

    clearTokens() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    getUser() {
        const u = localStorage.getItem("user");
        return u ? JSON.parse(u) : null;
    },

    saveUser(user) {
        localStorage.setItem("user", JSON.stringify(user));
    },

    async refreshToken() {
        const refresh = this.getRefreshToken();
        if (!refresh) return false;
        try {
            const resp = await fetch(`${API_BASE}/auth/token/refresh/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh }),
            });
            if (!resp.ok) return false;
            const data = await resp.json();
            this.saveTokens(data.access, refresh);
            return true;
        } catch {
            return false;
        }
    },

    async request(path, options = {}) {
        const token = this.getToken();
        const headers = { "Content-Type": "application/json", ...options.headers };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        let resp = await fetch(`${API_BASE}${path}`, { ...options, headers });

        if (resp.status === 401 && this.getRefreshToken()) {
            const refreshed = await this.refreshToken();
            if (refreshed) {
                headers["Authorization"] = `Bearer ${this.getToken()}`;
                resp = await fetch(`${API_BASE}${path}`, { ...options, headers });
            }
        }
        return resp;
    },

    async get(path) {
        return this.request(path);
    },

    async post(path, data) {
        return this.request(path, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async put(path, data) {
        return this.request(path, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    async del(path) {
        return this.request(path, { method: "DELETE" });
    },
};
