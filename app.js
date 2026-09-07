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
    const hideNavScreens = ['splash-screen', 'login-screen', 'product-screen', 'chat-screen'];
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

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showScreen('home-screen');
    });
  }

  if (signupLink) {
    signupLink.addEventListener('click', (e) => {
      e.preventDefault();
      showScreen('home-screen');
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
