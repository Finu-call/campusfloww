export const AuthViews = {
    renderLogin() {
        return `
            <div class="view-container flex items-center justify-center" style="min-height: 100vh; background-color: var(--bg-primary);">
                <div class="card" style="width: 100%; max-width: 400px; padding: 2.5rem;">
                    <div class="text-center mb-8">
                        <h1 class="mb-2" style="font-size: 1.75rem;">Welcome back</h1>
                        <p class="text-muted">Log in to CampusFlow</p>
                    </div>

                    <form onsubmit="window.App.handleLogin(event)">
                        <div class="form-group mb-4">
                            <label class="form-label">Email</label>
                            <input type="email" id="login-email" class="form-input" required>
                        </div>
                        <div class="form-group mb-2">
                            <label class="form-label">Password</label>
                            <input type="password" id="login-password" class="form-input" required>
                        </div>
                        <div class="text-right mb-6">
                            <a href="#forgot-password" class="text-sm" style="color: var(--accent-primary);">Forgot password?</a>
                        </div>
                        <button type="submit" class="btn btn-primary w-full mb-6 py-3">Login</button>
                        <div class="text-center text-sm text-muted">
                            Don't have an account? <a href="#signup" style="color: var(--accent-primary); font-weight: 500;">Create Host Account</a>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    renderSignup() {
        return `
            <div class="view-container flex items-center justify-center" style="min-height: 100vh; background-color: var(--bg-primary);">
                <div class="card" style="width: 100%; max-width: 400px; padding: 2.5rem;">
                    <div class="text-center mb-8">
                        <h1 class="mb-2" style="font-size: 1.75rem;">CampusFlow</h1>
                        <p class="text-muted">Create your Host Account</p>
                    </div>

                    <form onsubmit="window.App.handleSignup(event)">
                        <div class="form-group mb-4">
                            <label class="form-label">Full Name</label>
                            <input type="text" id="signup-name" class="form-input" required>
                        </div>
                        <div class="form-group mb-4">
                            <label class="form-label">Email</label>
                            <input type="email" id="signup-email" class="form-input" required>
                        </div>
                        <div class="form-group mb-4">
                            <label class="form-label">Password</label>
                            <input type="password" id="signup-password" class="form-input" required>
                        </div>
                        <div class="form-group mb-6">
                            <label class="form-label">Confirm Password</label>
                            <input type="password" id="signup-confirm" class="form-input" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-full mb-6 py-3">Create Host Account</button>
                        <div class="text-center text-sm text-muted">
                            Already have an account? <a href="#login" style="color: var(--accent-primary); font-weight: 500;">Log in</a>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    renderForgotPassword() {
        return `
            <div class="view-container flex items-center justify-center" style="min-height: 100vh; background-color: var(--bg-primary);">
                <div class="card" style="width: 100%; max-width: 400px; padding: 2.5rem;">
                    <div class="text-center mb-8">
                        <h1 class="mb-2" style="font-size: 1.75rem;">Reset your password</h1>
                        <p class="text-muted">Enter your account email</p>
                    </div>

                    <form onsubmit="window.App.handleForgotPassword(event)">
                        <div class="form-group mb-6">
                            <label class="form-label">Email</label>
                            <input type="email" id="forgot-email" class="form-input" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-full mb-6 py-3">Send Reset Link</button>
                        <div class="text-center text-sm text-muted">
                            Remember your password? <a href="#login" style="color: var(--accent-primary); font-weight: 500;">Back to Login</a>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    renderResetPassword() {
        return `
            <div class="view-container flex items-center justify-center" style="min-height: 100vh; background-color: var(--bg-primary);">
                <div class="card" style="width: 100%; max-width: 400px; padding: 2.5rem;">
                    <div class="text-center mb-8">
                        <h1 class="mb-2" style="font-size: 1.75rem;">Create a New Password</h1>
                    </div>

                    <div class="mb-6 text-sm text-muted">
                        <p class="mb-1">Password requirements:</p>
                        <p class="mb-1">✓ At least 8 characters</p>
                        <p>✓ Passwords match</p>
                    </div>

                    <form onsubmit="window.App.handleResetPasswordSubmit(event)">
                        <div class="form-group mb-4">
                            <label class="form-label">New Password</label>
                            <input type="password" id="reset-pass" class="form-input" minlength="8" required>
                        </div>
                        <div class="form-group mb-6">
                            <label class="form-label">Confirm New Password</label>
                            <input type="password" id="reset-confirm" class="form-input" minlength="8" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-full mb-6 py-3">Update Password</button>
                    </form>
                </div>
            </div>
        `;
    }
};
