const session = AuthDB.getSession();

if (session) {
    const username = document.getElementById('username');
    const profileName = document.getElementById('profile-name');

    if (username) username.textContent = session.firstname;
    if (profileName) profileName.textContent = session.firstname + ' ' + session.lastname;
}

const upload = document.getElementById("avatar-upload");
const fallback = document.querySelector(".avatar-fallback");

if (upload) {
    upload.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (fallback) fallback.style.display = "none";
                var img = document.getElementById("profile-avatar");
                if (!img) {
                    img = document.createElement("img");
                    img.id = "profile-avatar";
                    document.querySelector(".profile-avatar").prepend(img);
                }
                img.src = e.target.result;
                img.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });
}