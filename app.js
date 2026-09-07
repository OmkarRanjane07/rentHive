/* ============================================
   RentHive – App JavaScript
   ============================================ */

// === SCREEN NAVIGATION ===
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  // Show target screen
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
  }

  // Update bottom nav
  const mainNav = document.getElementById('main-nav');
  if (mainNav) {
    // Hide nav on splash, login, product, and chat screens
    const hideNavScreens = ['splash-screen', 'login-screen', 'signup-screen', 'product-screen', 'chat-screen'];
    mainNav.style.display = hideNavScreens.includes(screenId) ? 'none' : 'flex';
    
    // Update active state
    mainNav.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.screen === screenId) {
        item.classList.add('active');
      }
    });
  }

  // Scroll to top
  window.scrollTo(0, 0);
  const scrollContent = target ? target.querySelector('.scroll-content') : null;
  if (scrollContent) {
    scrollContent.scrollTop = 0;
  }
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
  // Start with splash screen
  showScreen('splash-screen');

  // Setup all event listeners
  setupSplash();
  setupLogin();
  setupPasswordToggle();
  setupNavigation();
  setupBackButtons();
  setupCategoryClick();
  setupAdCardClick();
  setupWishlistHearts();
  setupChatInput();
  setupTabs();
  setupSellForm();
  setupProfileMenu();
  setupNotifications();
});

// === SPLASH SCREEN ===
function setupSplash() {
  const getStartedBtn = document.getElementById('get-started-btn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      showScreen('login-screen');
    });
  }
}

// === LOGIN ===
function setupLogin() {
  const loginForm = document.getElementById('login-form');
  const signupLink = document.getElementById('signup-link');
  const loginError = document.getElementById('login-error');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email-input').value.trim();
      const password = document.getElementById('password-input').value;
      const loginBtn = document.getElementById('login-btn');

      // Hide previous errors
      if (loginError) loginError.style.display = 'none';

      // Show loading state
      loginBtn.textContent = 'Logging in...';
      loginBtn.disabled = true;

      try {
        await login(email, password);
        showScreen('home-screen');
      } catch (err) {
        if (loginError) {
          loginError.textContent = err.message || 'Login failed. Please check your credentials.';
          loginError.style.display = 'block';
        }
      } finally {
        loginBtn.textContent = 'Login';
        loginBtn.disabled = false;
      }
    });
  }

  // Navigate to signup screen
  if (signupLink) {
    signupLink.addEventListener('click', (e) => {
      e.preventDefault();
      showScreen('signup-screen');
    });
  }

  // === SIGNUP ===
  const signupForm = document.getElementById('signup-form');
  const loginLink = document.getElementById('login-link');
  const signupError = document.getElementById('signup-error');
  const signupSuccess = document.getElementById('signup-success');

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const confirm = document.getElementById('signup-confirm').value;
      const signupBtn = document.getElementById('signup-btn');

      // Hide previous messages
      if (signupError) signupError.style.display = 'none';
      if (signupSuccess) signupSuccess.style.display = 'none';

      // Validate passwords match
      if (password !== confirm) {
        if (signupError) {
          signupError.textContent = 'Passwords do not match.';
          signupError.style.display = 'block';
        }
        return;
      }

      // Show loading state
      signupBtn.textContent = 'Creating account...';
      signupBtn.disabled = true;

      try {
        await signUp(email, password, fullName);
        if (signupSuccess) {
          signupSuccess.textContent = 'Account created successfully! You can now login.';
          signupSuccess.style.display = 'block';
        }
        signupForm.reset();
        // Auto-redirect to login after 2 seconds
        setTimeout(() => {
          showScreen('login-screen');
        }, 2000);
      } catch (err) {
        if (signupError) {
          signupError.textContent = err.message || 'Signup failed. Please try again.';
          signupError.style.display = 'block';
        }
      } finally {
        signupBtn.textContent = 'Sign Up';
        signupBtn.disabled = false;
      }
    });
  }

  // Navigate back to login screen
  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      showScreen('login-screen');
    });
  }

  // Signup password toggle
  const signupToggle = document.getElementById('signup-password-toggle');
  const signupPasswordInput = document.getElementById('signup-password');
  if (signupToggle && signupPasswordInput) {
    signupToggle.addEventListener('click', () => {
      const type = signupPasswordInput.type === 'password' ? 'text' : 'password';
      signupPasswordInput.type = type;
      signupToggle.innerHTML = type === 'password'
        ? '<i class="fas fa-eye"></i>'
        : '<i class="fas fa-eye-slash"></i>';
    });
  }
}

// === PASSWORD TOGGLE ===
function setupPasswordToggle() {
  const toggle = document.getElementById('password-toggle');
  const passwordInput = document.getElementById('password-input');
  if (toggle && passwordInput) {
    toggle.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      toggle.innerHTML = type === 'password'
        ? '<i class="fas fa-eye"></i>'
        : '<i class="fas fa-eye-slash"></i>';
    });
  }
}

// === BOTTOM NAV ===

function setupNavigation() {

  document.addEventListener('click', (e) => {

    const navItem = e.target.closest('.nav-item');

    if (!navItem) return;

    const screenId = navItem.dataset.screen;

    if (!screenId) return;

    e.preventDefault();
    e.stopPropagation();

    showScreen(screenId);

  });

}
// === BACK BUTTONS ===
function setupBackButtons() {
  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.back || 'home-screen';
      showScreen(target);
    });
  });
}

// === CATEGORY CLICKS ===
function setupCategoryClick() {
  document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
      item.style.transform = 'scale(0.92)';
      setTimeout(() => {
        item.style.transform = '';
      }, 150);
    });
  });
}

// === AD CARD CLICKS ===
function setupAdCardClick() {
  document.querySelectorAll('.ad-card').forEach(card => {
    card.addEventListener('click', () => {
      showScreen('product-screen');
    });
  });
}

// === WISHLIST HEARTS ===
function setupWishlistHearts() {
  document.querySelectorAll('.wishlist-heart').forEach(heart => {
    heart.addEventListener('click', (e) => {
      e.stopPropagation();
      heart.classList.toggle('liked');
      if (heart.classList.contains('liked')) {
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        heart.style.color = '#EF4444';
      } else {
        heart.innerHTML = '<i class="far fa-heart"></i>';
        heart.style.color = '#9CA3AF';
      }
    });
  });
}

// === CHAT INPUT ===
function setupChatInput() {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const messagesContainer = document.getElementById('chat-messages');

  function sendMessage() {
    if (!chatInput || !messagesContainer) return;
    const text = chatInput.value.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const msgDiv = document.createElement('div');
    msgDiv.className = 'message sent fade-in';
    msgDiv.innerHTML = `
      <div class="message-text">${escapeHtml(text)}</div>
      <div class="message-meta">
        <span class="message-time">${timeStr}</span>
        <span class="message-ticks">✓✓</span>
      </div>
    `;
    messagesContainer.appendChild(msgDiv);
    chatInput.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }
}

// === ESCAPE HTML ===
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// === TABS ===
function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabGroup = tab.closest('.tabs');
      if (tabGroup) {
        tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      }
    });
  });
}

// === SELL FORM ===
function setupSellForm() {
  // Condition radio buttons
  document.querySelectorAll('.condition-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.condition-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Post Ad button
  const postAdBtn = document.getElementById('post-ad-btn');
  if (postAdBtn) {
    postAdBtn.addEventListener('click', () => {
      alert('Ad posted successfully!');
      showScreen('home-screen');
    });
  }

  // Upload photo boxes
  document.querySelectorAll('.upload-box').forEach(box => {
    box.addEventListener('click', () => {
      box.classList.toggle('has-image');
      if (box.classList.contains('has-image')) {
        box.innerHTML = '<i class="fas fa-image" style="font-size:24px;color:#3478F6"></i>';
      } else {
        box.innerHTML = '<i class="fas fa-plus" style="font-size:20px;color:#9CA3AF"></i>';
      }
    });
  });
}

// === PROFILE MENU ===
function setupProfileMenu() {
  document.querySelectorAll('.profile-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.screen;
      if (target) {
        showScreen(target);
      }
    });
  });
}

// === NOTIFICATIONS ===
function setupNotifications() {
  document.querySelectorAll('.notification-bell').forEach(bell => {
    bell.addEventListener('click', () => {
      showScreen('admin-screen');
    });
  });
}
