const navHTML = `
<nav>
    <a href="../index.html">Home</a>
    <a href="../topics.html">Topics</a>
</nav>`;

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("header")?.insertAdjacentHTML("afterend", navHTML);
});
