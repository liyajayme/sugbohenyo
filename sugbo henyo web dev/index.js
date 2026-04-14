fetch('sidebar.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('sidebar').innerHTML = data;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.links ul li a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    });

const session = AuthDB.getSession();
if (session) {
    const username = document.getElementById('username');
    const profileName = document.getElementById('profile-name');
    if (username) username.textContent = session.firstname;
    if (profileName) profileName.textContent = session.firstname + ' ' + session.lastname;
}

document.addEventListener('click', (e) => {
    if (e.target.closest('#logout-btn')) {
        AuthDB.logout();
        window.location.href = 'login.html';
    }
});