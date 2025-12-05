const articlesData = [
    {
        id: 1,
        title: "CSS Grid 布局完全指南",
        summary:
            "CSS Grid 是一个强大的二维布局系统，它可以同时处理行和列，使得复杂的网页布局变得简单直观。本文将带你深入了解 CSS Grid 的核心概念和实际应用。",
        tag: "前端",
        date: "2025年1月15日",
    },
    {
        id: 2,
        title: "JavaScript 异步编程深入解析",
        summary:
            "从回调函数到 Promise，再到 async/await，本文将带你全面理解 JavaScript 异步编程的演进历程和最佳实践。",
        tag: "前端",
        date: "2025年1月10日",
    },
    {
        id: 3,
        title: "Node.js 性能优化实战",
        summary:
            "探索 Node.js 应用的性能瓶颈，学习如何通过代码优化、缓存策略和集群部署来提升应用性能。",
        tag: "后端",
        date: "2025年1月5日",
    },
];

// DOM 加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNavbar();
    initSlider();
    initArticles();
    initSearch();
    initComments();
    initContactForm();
    initContactPageForm(); // 新增联系页面表单初始化
});

// 主题切换功能
function initTheme() {
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("theme") || "light";

    document.documentElement.setAttribute("data-theme", savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme =
                document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";

            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }
}

// 导航栏功能
function initNavbar() {
    const navbar = document.getElementById("navbar");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    // 滚动渐变效果
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 汉堡菜单切换
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        // 点击导航链接后关闭菜单
        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }
}

// 轮播图功能
function initSlider() {
    const sliderContainer = document.getElementById("sliderContainer");
    const sliderDots = document.getElementById("sliderDots");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (!sliderContainer) return;

    const slides = sliderContainer.querySelectorAll(".slide");
    let currentSlide = 0;
    let autoSlideInterval;

    // 创建指示点
    slides.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(index));
        sliderDots.appendChild(dot);
    });

    const dots = sliderDots.querySelectorAll(".dot");

    function goToSlide(index) {
        slides[currentSlide].classList.remove("active");
        dots[currentSlide].classList.remove("active");

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // 自动播放
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // 事件监听
    if (prevBtn)
        prevBtn.addEventListener("click", () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    if (nextBtn)
        nextBtn.addEventListener("click", () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });

    // 鼠标悬停暂停自动播放
    sliderContainer.addEventListener("mouseenter", stopAutoSlide);
    sliderContainer.addEventListener("mouseleave", startAutoSlide);

    startAutoSlide();
}

// 文章渲染功能
function initArticles() {
    const articlesGrid = document.getElementById("articlesGrid");
    const filterTags = document.getElementById("filterTags");

    if (!articlesGrid) return;

    function renderArticles(articles) {
        if (articles.length === 0) {
            articlesGrid.innerHTML = `
        <div class="no-articles">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <p>没有找到相关文章</p>
        </div>
      `;
            return;
        }

        articlesGrid.innerHTML = articles
            .map(
                (article) => `
      <article class="article-card" onclick="viewArticle(${article.id})">
        <img src="${article.image}" alt="${article.title}">
        <div class="card-content">
          <h3>${article.title}</h3>
          <p>${article.summary}</p>
          <div class="card-meta">
            <span class="tag">${article.tag}</span>
            <span class="date">${article.date}</span>
          </div>
        </div>
      </article>
    `
            )
            .join("");
    }

    renderArticles(articlesData);

    // 标签过滤
    if (filterTags) {
        filterTags.addEventListener("click", (e) => {
            if (e.target.classList.contains("tag-btn")) {
                filterTags
                    .querySelectorAll(".tag-btn")
                    .forEach((btn) => btn.classList.remove("active"));
                e.target.classList.add("active");

                const tag = e.target.dataset.tag;
                const filtered =
                    tag === "all"
                        ? articlesData
                        : articlesData.filter((article) => article.tag === tag);

                renderArticles(filtered);
            }
        });
    }
}

// 搜索功能
function initSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const articlesGrid = document.getElementById("articlesGrid");
    const filterTags = document.getElementById("filterTags");

    if (!searchInput || !articlesGrid) return;

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();

        if (filterTags) {
            filterTags
                .querySelectorAll(".tag-btn")
                .forEach((btn) => btn.classList.remove("active"));
            filterTags
                .querySelector('[data-tag="all"]')
                .classList.add("active");
        }

        const filtered = articlesData.filter(
            (article) =>
                article.title.toLowerCase().includes(query) ||
                article.summary.toLowerCase().includes(query) ||
                article.tag.toLowerCase().includes(query)
        );

        renderFilteredArticles(filtered);
    }

    function renderFilteredArticles(articles) {
        if (articles.length === 0) {
            articlesGrid.innerHTML = `
        <div class="no-articles">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <p>没有找到相关文章</p>
        </div>
      `;
            return;
        }

        articlesGrid.innerHTML = articles
            .map(
                (article) => `
      <article class="article-card" onclick="viewArticle(${article.id})">
        <img src="${article.image}" alt="${article.title}">
        <div class="card-content">
          <h3>${article.title}</h3>
          <p>${article.summary}</p>
          <div class="card-meta">
            <span class="tag">${article.tag}</span>
            <span class="date">${article.date}</span>
          </div>
        </div>
      </article>
    `
            )
            .join("");
    }

    if (searchBtn) searchBtn.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") performSearch();
    });
}

// 查看文章详情
function viewArticle(id) {
    localStorage.setItem("currentArticleId", id);
    window.location.href = "blog.html";
}

// 评论功能
function initComments() {
    const commentForm = document.getElementById("commentForm");
    const commentContent = document.getElementById("commentContent");
    const charCount = document.getElementById("charCount");
    const commentsList = document.getElementById("commentsList");

    if (!commentForm) return;

    // 字数统计
    if (commentContent && charCount) {
        commentContent.addEventListener("input", () => {
            charCount.textContent = commentContent.value.length;
        });
    }

    // 加载已有评论
    const savedComments = JSON.parse(
        localStorage.getItem("blogComments") || "[]"
    );
    renderComments(savedComments);

    function renderComments(comments) {
        if (!commentsList) return;

        if (comments.length === 0) {
            commentsList.innerHTML =
                '<p style="color: var(--text-tertiary); text-align: center;">暂无评论，快来发表第一条评论吧！</p>';
            return;
        }

        commentsList.innerHTML = comments
            .map(
                (comment) => `
      <div class="comment-item">
        <div class="comment-header">
          <span class="commenter-name">${escapeHtml(comment.name)}</span>
          <span class="comment-date">${comment.date}</span>
        </div>
        <p class="comment-text">${escapeHtml(comment.content)}</p>
      </div>
    `
            )
            .join("");
    }

    // 提交评论
    let isSubmitting = false;

    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        const submitBtn = document.getElementById("submitComment");
        submitBtn.disabled = true;
        submitBtn.textContent = "提交中...";

        const name = document.getElementById("commenterName").value.trim();
        const content = commentContent.value.trim();

        setTimeout(() => {
            const newComment = {
                name,
                content,
                date: new Date().toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            };

            savedComments.unshift(newComment);
            localStorage.setItem("blogComments", JSON.stringify(savedComments));

            renderComments(savedComments);
            commentForm.reset();
            charCount.textContent = "0";

            submitBtn.disabled = false;
            submitBtn.textContent = "发表评论";
            isSubmitting = false;
        }, 500);
    });
}

// 联系表单功能
function initContactForm() {
    const contactForm = document.getElementById("contactForm");
    const messageTextarea = document.getElementById("message");
    const messageCharCount = document.getElementById("messageCharCount");
    const successMessage = document.getElementById("successMessage");

    if (!contactForm) return;

    // 字数统计
    if (messageTextarea && messageCharCount) {
        messageTextarea.addEventListener("input", () => {
            messageCharCount.textContent = messageTextarea.value.length;
        });
    }

    // 表单验证
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    if (emailInput) {
        emailInput.addEventListener("blur", () => {
            if (emailInput.value && !validateEmail(emailInput.value)) {
                emailError.textContent = "请输入有效的邮箱地址";
                emailError.classList.add("show");
            } else {
                emailError.classList.remove("show");
            }
        });
    }

    // 提交表单
    let isSubmitting = false;

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        // 验证邮箱
        if (!validateEmail(emailInput.value)) {
            emailError.textContent = "请输入有效的邮箱地址";
            emailError.classList.add("show");
            emailInput.focus();
            return;
        }

        isSubmitting = true;
        const submitBtn = document.getElementById("submitContact");
        submitBtn.disabled = true;
        submitBtn.textContent = "发送中...";

        // 模拟提交
        setTimeout(() => {
            contactForm.style.display = "none";
            successMessage.classList.add("show");

            // 保存到本地存储
            const formData = {
                name: document.getElementById("name").value,
                email: emailInput.value,
                message: messageTextarea.value,
                date: new Date().toISOString(),
            };

            const messages = JSON.parse(
                localStorage.getItem("contactMessages") || "[]"
            );
            messages.push(formData);
            localStorage.setItem("contactMessages", JSON.stringify(messages));

            isSubmitting = false;
        }, 1000);
    });
}

// 联系页面表单功能
function initContactPageForm() {
    const contactForm = document.getElementById("contactPageForm");
    const messageTextarea = document.getElementById("contactMessage");
    const charCount = document.getElementById("contactCharCount");
    const successMessage = document.getElementById("contactSuccessMessage");

    if (!contactForm) return;

    // 字数统计
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener("input", () => {
            charCount.textContent = messageTextarea.value.length;
        });
    }

    // 邮箱验证
    const emailInput = document.getElementById("contactEmail");
    const emailError = document.getElementById("contactEmailError");

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    if (emailInput) {
        emailInput.addEventListener("blur", () => {
            if (emailInput.value && !validateEmail(emailInput.value)) {
                emailError.textContent = "请输入有效的邮箱地址";
                emailError.classList.add("show");
            } else {
                emailError.classList.remove("show");
            }
        });
    }

    // 姓名验证
    const nameInput = document.getElementById("contactName");
    const nameError = document.getElementById("nameError");

    if (nameInput) {
        nameInput.addEventListener("blur", () => {
            if (!nameInput.value.trim()) {
                nameError.textContent = "请输入您的姓名";
                nameError.classList.add("show");
            } else {
                nameError.classList.remove("show");
            }
        });
    }

    // 留言验证
    const messageError = document.getElementById("messageError");

    if (messageTextarea) {
        messageTextarea.addEventListener("blur", () => {
            if (!messageTextarea.value.trim()) {
                messageError.textContent = "请输入留言内容";
                messageError.classList.add("show");
            } else {
                messageError.classList.remove("show");
            }
        });
    }

    // 提交表单
    let isSubmitting = false;

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        // 验证所有必填项
        let hasError = false;

        if (!nameInput.value.trim()) {
            nameError.textContent = "请输入您的姓名";
            nameError.classList.add("show");
            hasError = true;
        }

        if (!emailInput.value.trim()) {
            emailError.textContent = "请输入您的邮箱";
            emailError.classList.add("show");
            hasError = true;
        } else if (!validateEmail(emailInput.value)) {
            emailError.textContent = "请输入有效的邮箱地址";
            emailError.classList.add("show");
            hasError = true;
        }

        if (!messageTextarea.value.trim()) {
            messageError.textContent = "请输入留言内容";
            messageError.classList.add("show");
            hasError = true;
        }

        if (hasError) return;

        isSubmitting = true;
        const submitBtn = document.getElementById("submitContactPage");
        submitBtn.disabled = true;
        submitBtn.textContent = "发送中...";

        // 模拟提交
        setTimeout(() => {
            contactForm.style.display = "none";
            successMessage.classList.add("show");

            // 保存到本地存储
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageTextarea.value.trim(),
                date: new Date().toISOString(),
            };

            const messages = JSON.parse(
                localStorage.getItem("contactMessages") || "[]"
            );
            messages.push(formData);
            localStorage.setItem("contactMessages", JSON.stringify(messages));

            isSubmitting = false;
        }, 1000);
    });
}

// 重置联系表单（用于成功后继续留言）
function resetContactForm() {
    const contactForm = document.getElementById("contactPageForm");
    const successMessage = document.getElementById("contactSuccessMessage");
    const submitBtn = document.getElementById("submitContactPage");
    const charCount = document.getElementById("contactCharCount");

    if (contactForm && successMessage) {
        contactForm.reset();
        contactForm.style.display = "block";
        successMessage.classList.remove("show");
        submitBtn.disabled = false;
        submitBtn.textContent = "发送消息";
        if (charCount) charCount.textContent = "0";
    }
}

// HTML转义函数
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
