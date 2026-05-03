fetch('sidebar.html')
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

document.addEventListener('click', (e) => {
  if (e.target.closest('#logout-btn')) {
    AuthDB.logout();
    window.location.href = 'login.html';
  }
});