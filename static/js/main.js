function showAlert(message, type = "success") {
    const container = document.getElementById("alert-container");
    if (!container) return;
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    container.appendChild(alert);
    setTimeout(() => alert.remove(), 4000);
}

function updateAuthUI() {
    const loginItem = document.getElementById("nav-login");
    const registerItem = document.getElementById("nav-register");
    const userMenu = document.getElementById("nav-user");
    const emailSpan = document.getElementById("user-email");
    const adminLink = document.getElementById("nav-admin-link");

    if (api.isAuthenticated()) {
        loginItem?.classList.add("d-none");
        registerItem?.classList.add("d-none");
        userMenu?.classList.remove("d-none");
        const user = api.getUser();
        if (emailSpan && user) emailSpan.textContent = user.email || "User";
        if (adminLink && user?.is_staff) adminLink.classList.remove("d-none");
    } else {
        loginItem?.classList.remove("d-none");
        registerItem?.classList.remove("d-none");
        userMenu?.classList.add("d-none");
    }
}

async function handleLogin(email, password) {
    const resp = await api.post("/auth/login/", { email, password });
    const data = await resp.json();
    if (!resp.ok) {
        showAlert(data.detail || "Login failed", "danger");
        return false;
    }
    api.saveTokens(data.access, data.refresh);

    const profileResp = await api.get("/auth/profile/");
    if (profileResp.ok) {
        const user = await profileResp.json();
        api.saveUser(user);
    }
    updateAuthUI();
    showAlert("Logged in successfully!");
    window.location.href = "/dashboard/";
    return true;
}

async function handleRegister(data) {
    const resp = await api.post("/auth/register/", data);
    const result = await resp.json();
    if (!resp.ok) {
        const msg = Object.values(result).flat().join(", ") || "Registration failed";
        showAlert(msg, "danger");
        return false;
    }
    showAlert("Registration successful! Please log in.");
    window.location.href = "/login/";
    return true;
}

function handleLogout() {
    api.clearTokens();
    updateAuthUI();
    showAlert("Logged out.");
    window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", () => {
    const container = document.createElement("div");
    container.id = "alert-container";
    container.className = "alert-container";
    document.body.prepend(container);

    updateAuthUI();

    document.getElementById("logout-btn")?.addEventListener("click", (e) => {
        e.preventDefault();
        handleLogout();
    });
});
