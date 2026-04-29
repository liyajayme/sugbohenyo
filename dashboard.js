const session = AuthDB.getSession();
if (session) {
    const username = document.getElementById('username');
    const profileName = document.getElementById('profile-name');
    if (username) username.textContent = session.firstname;
    if (profileName) profileName.textContent = session.firstname + ' ' + session.lastname;
}