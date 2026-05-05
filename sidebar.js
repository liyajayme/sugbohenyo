fetch('/sugbohenyo/sidebar.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('sidebar').innerHTML = data;

    const currentPage =
      window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('#sidebar a').forEach(link => {
      const href = link.getAttribute('href');

      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  });

document.addEventListener('click', async (e) => {
  if (e.target.closest('#logout-btn')) {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.ok) {
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
});