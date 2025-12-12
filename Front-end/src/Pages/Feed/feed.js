/* ------------------ BANCO LOCAL ------------------ */
let db = JSON.parse(localStorage.getItem("postsDB")) || {};

function saveDB() {
    localStorage.setItem("postsDB", JSON.stringify(db));
}

function initPost(id) {
    if (!db[id]) {
        db[id] = {
            likes: 0,
            favorited: false,
            comments: []
        };
    }
}

/* ------------------ FEED ------------------ */
document.querySelectorAll(".post-feed").forEach(post => {
    const id = post.dataset.id;
    initPost(id);

    const likeBtn = post.querySelector(".like-btn-feed");
    const likeCount = post.querySelector(".like-count-feed");
    const favBtn = post.querySelector(".fav-btn-feed");
    const commentBtn = post.querySelector(".comment-btn-feed");
    const commentInput = post.querySelector(".comment-input-feed");
    const sendBtn = post.querySelector(".send-comment-feed");
    const commentList = post.querySelector(".comment-list-feed");
    const commentCount = post.querySelector(".comment-count-feed");
    const linkBtn = post.querySelector(".link-btn-feed");
    const reportBtn = post.querySelector(".report-btn-feed");

    likeCount.textContent = db[id].likes;
    commentCount.textContent = db[id].comments.length;

    if (db[id].favorited) favBtn.style.color = "gold";

    function renderComments() {
        commentList.innerHTML = "";
        db[id].comments.forEach(text => {
            const div = document.createElement("div");
            div.className = "comment-item-feed";
            div.textContent = text;
            commentList.appendChild(div);
        });
    }

    renderComments();

    likeBtn.addEventListener("click", () => {
        likeBtn.classList.add("like-animate-feed");
        setTimeout(() => likeBtn.classList.remove("like-animate-feed"), 300);

        db[id].likes++;
        likeCount.textContent = db[id].likes;

        likeBtn.style.color = "red";
        saveDB();
    });

    favBtn.addEventListener("click", () => {
        db[id].favorited = !db[id].favorited;
        favBtn.style.color = db[id].favorited ? "gold" : "black";
        saveDB();
    });

    sendBtn.addEventListener("click", () => {
        const text = commentInput.value.trim();
        if (text === "") return;

        db[id].comments.push(text);
        commentInput.value = "";
        commentCount.textContent = db[id].comments.length;

        renderComments();
        saveDB();
    });

    linkBtn.addEventListener("click", () => {
        const fakeLink = `https://seusite.com/post/${id}`;
        navigator.clipboard.writeText(fakeLink).then(() => {
            alert("Link copiado:\n" + fakeLink);
        });
    });

    reportBtn.addEventListener("click", () => openReportModal(id));
});

/* ------------------ MODAL DE DENÚNCIA ------------------ */
const modal = document.querySelector(".modal-overlay-feed");

function openReportModal() {
    modal.classList.add("active");

    const textarea = modal.querySelector(".modal-textarea-feed");
    textarea.value = "";

    modal.querySelector(".cancel-feed").onclick = () => {
        modal.classList.remove("active");
    };

    modal.querySelector(".ok-feed").onclick = () => {
        if (textarea.value.trim() === "") return;

        alert("Problema enviado:\n\n" + textarea.value);
        modal.classList.remove("active");
    };
}
// O código de busca e menu foi removido e agora é controlado pelo base/base.html