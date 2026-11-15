const footerHTML = `
<footer>
    <p>Created by Brijanya Sharma</p>
    <p><strong>Some features may use the browsers memory. In case
    you delete yours browsers memory all the data will be reset.
    </strong></p>
</footer>`;

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("main")?.insertAdjacentHTML("afterend", footerHTML);
});