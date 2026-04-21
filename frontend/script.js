// Utility functions
function showRegister() {
  document.getElementById('registerForm').classList.remove('hidden');
  document.getElementById('loginForm').classList.add('hidden');
}

function showLogin() {
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
}

// Check if user is logged in
function checkAuth() {
  const user = localStorage.getItem('user');
  if (user) {
    window.location.href = 'idcard.html';
  }
}

// Register form
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      body: formData // Multipart for file upload
    });

    const data = await res.json();
    
    if (res.ok) {
      alert('Registered successfully! Please login.');
      showLogin();
      e.target.reset();
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Register error:', error);
    alert('Registration failed. Is backend running?');
  }
});

// Login form (existing + error handling)
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'idcard.html';
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Is backend running on port 5000?');
  }
});

// Init - check if already logged in
checkAuth();

