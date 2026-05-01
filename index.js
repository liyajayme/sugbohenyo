document.addEventListener("DOMContentLoaded", () => {

    const title = document.querySelector(".title");

    setInterval(() => {
        title.style.opacity = (Math.random() > 0.9) ? "0.8" : "1";
    }, 200);

    document.querySelectorAll(".btn").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.style.transform = "scale(0.95)";
            setTimeout(() => {
                btn.style.transform = "scale(1)";
            }, 100);
        });
    });

});