const FEATURED_API =
  "http://college-finder-52c0.onrender.com/api/featured-colleges";

const COLLEGES_API =
  "http://college-finder-52c0.onrender.com/api/colleges";
let currentPage = 1;

const collegesPerPage = 12;

let allColleges = [];

/* ================= FETCH COLLEGES ================= */

async function fetchColleges() {

  try {

    const isCollegesPage =
      window.location.pathname
      .includes("colleges.html");

    const response =
      await fetch(
        isCollegesPage
          ? COLLEGES_API
          : FEATURED_API
      );

    const colleges =
      await response.json();

    allColleges = colleges;

    displayPaginatedColleges();

  } catch (error) {

    console.error(
      "Error fetching colleges:",
      error
    );

  }

}
/* ================= DISPLAY PAGINATED ================= */

function displayPaginatedColleges() {

  const start =
    (currentPage - 1) *
    collegesPerPage;

  const end =
    start + collegesPerPage;

  const paginatedItems =
    allColleges.slice(start, end);

  displayColleges(
    paginatedItems
  );

  setupPagination();

}

/* ================= DISPLAY COLLEGES ================= */

function displayColleges(colleges) {

  const container =
    document.getElementById(
      "collegeContainer"
    );

  if (!container) return;

  container.innerHTML = "";

  const isCollegesPage =
    window.location.pathname
    .includes("colleges.html");

  colleges.forEach((college) => {

    const card =
      document.createElement("div");

    /* ================= COLLEGES PAGE ================= */

    if (isCollegesPage) {

      card.classList.add(
        "college-list-card"
      );

      card.innerHTML = `

        <h3>${college.name}</h3>

        <div class="college-list-info">

          <p>
            <strong>📍 City:</strong>
            ${college.city}
          </p>

          <p>
            <strong>🏛 Category:</strong>
            ${college.category}
          </p>

          <p>
            <strong>⭐ Rating:</strong>
            ${college.rating}
          </p>

          <p>
            <strong>💰 Fees:</strong>
            ${college.fees}
          </p>

          <p>
            <strong>📞 Phone:</strong>
            ${college.phone}
          </p>

          <p>
            <strong>✉ Email:</strong>
            ${college.email}
          </p>

        </div>

        <div class="college-list-actions">

          <a
            href="${college.website}"
            target="_blank"
          >
            Visit Website
          </a>

        </div>

      `;

    }

    /* ================= HOMEPAGE ================= */

    else {

      card.classList.add(
        "college-card"
      );

      card.innerHTML = `

        <div class="college-image">

          <img
            src="${college.image}"
            alt="${college.name}"
          >

        </div>

        <div class="college-basic">

          <div class="basic-top">

            <span class="college-category">
              ${college.category}
            </span>

            <span class="college-rating">
              ⭐ ${college.rating}
            </span>

          </div>

          <h3>${college.name}</h3>

        </div>

        <div class="college-overlay">

          <div class="overlay-content">

            <h2>${college.name}</h2>

            <p>
              <strong>City:</strong>
              ${college.city}
            </p>

            <p>
              <strong>State:</strong>
              ${college.state}
            </p>

            <p>
              <strong>Category:</strong>
              ${college.category}
            </p>

            <p>
              <strong>Fees:</strong>
              ${college.fees}
            </p>

          </div>

        </div>

      `;

    }

    container.appendChild(card);

  });

}
/* ================= PAGINATION ================= */

function setupPagination() {

  const pagination =
    document.getElementById(
      "pagination"
    );

  if (!pagination) return;

  pagination.innerHTML = "";

  const pageCount =
    Math.ceil(
      allColleges.length /
      collegesPerPage
    );

  /* HIDE PAGINATION IF ONLY 1 PAGE */

  if (pageCount <= 1) {

    pagination.style.display =
      "none";

    return;

  }

  pagination.style.display =
    "flex";

  for (
    let i = 1;
    i <= pageCount;
    i++
  ) {

    const button =
      document.createElement(
        "button"
      );

    button.innerText = i;

    button.classList.add(
      "pagination-btn"
    );

    if (i === currentPage) {

      button.classList.add(
        "active"
      );

    }

    button.addEventListener(
      "click",
      () => {

        currentPage = i;

        displayPaginatedColleges();

        window.scrollTo({

          top: 650,

          behavior: "smooth"

        });

      }
    );

    pagination.appendChild(
      button
    );

  }

}

/* ================= COLLEGE SEARCH ================= */

const searchBtn =
  document.getElementById(
    "searchBtn"
  );

if (searchBtn) {

  searchBtn.addEventListener(
    "click",
    async () => {

      const course =
        document.getElementById(
          "courseFilter"
        ).value;

      const state =
        document.getElementById(
          "stateFilter"
        ).value;

      const college =
        document.getElementById(
          "collegeSearch"
        ).value;

      try {

        const response =
          await fetch(
`http://college-finder-52c0.onrender.com/api/colleges/search?course=${encodeURIComponent(course)}&state=${encodeURIComponent(state)}&college=${encodeURIComponent(college)}`
          );

        const data =
          await response.json();

        allColleges = data;

        currentPage = 1;

        displayPaginatedColleges();

        window.scrollTo({
          top: 650,
          behavior: "smooth"
        });

      } catch (error) {

        console.error(
          "Search Error:",
          error
        );

      }

    }
  );

}
/* ================= ENTER KEY SEARCH ================= */

document.addEventListener(
  "keydown",
  (e) => {

    if (e.key === "Enter") {

      const active =
        document.activeElement;

      if (
        active.id === "collegeSearch" ||
        active.id === "courseFilter" ||
        active.id === "stateFilter"
      ) {

        searchBtn.click();

      }

    }

  }
);

/* ================= NAVBAR SHADOW ================= */

window.addEventListener(
  "scroll",
  () => {

    const navbar =
      document.querySelector(
        ".navbar"
      );

    if (
      window.scrollY > 20
    ) {

      navbar.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.08)";

    } else {

      navbar.style.boxShadow =
        "0 2px 15px rgba(0,0,0,0.05)";

    }

  }
);

/* ================= PAGE LOAD ================= */

window.addEventListener(
  "load",
  () => {

    document.body.style.opacity =
      "1";

  }
);

/* ================= INITIAL LOAD ================= */

if (
  document.getElementById(
    "collegeContainer"
  )
) {

  fetchColleges();

}
// PAGE LOAD (safe fade-in)
window.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "1";
});


// PAGE EXIT TRANSITION
document.addEventListener("click", (e) => {
  const link = e.target.closest("a");

  if (!link) return;

  const href = link.getAttribute("href");

  if (!href || href.startsWith("#")) return;
  if (href.startsWith("http")) return;

  e.preventDefault();

  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = href;
  }, 300);
});
/* ================= COURSES PAGE FILTER ================= */

const streamSearchBtn =
  document.getElementById(
    "streamSearchBtn"
  );

if (streamSearchBtn) {

  streamSearchBtn.addEventListener(
    "click",
    () => {

      const selectedStream =
        document
          .getElementById(
            "streamFilter"
          )
          .value;

      const sections =
        document.querySelectorAll(
          ".course-section"
        );

      sections.forEach((section) => {

        const type =
          section.getAttribute(
            "data-type"
          );

        /* SHOW ALL */

        if (
          selectedStream === "all"
        ) {

          section.style.display =
            "block";

        }

        /* SHOW MATCHING */

        else if (
          type === selectedStream
        ) {

          section.style.display =
            "block";

        }

        /* HIDE OTHERS */

        else {

          section.style.display =
            "none";

        }

      });

      /* SMOOTH SCROLL */

      window.scrollTo({

        top: 500,

        behavior: "smooth"

      });

    }
  );

}
/* ================= SIGNUP ================= */

const signupForm =
  document.getElementById(
    "signupForm"
  );

if (signupForm) {

  signupForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const name =
        document.getElementById(
          "signupName"
        ).value;

      const email =
        document.getElementById(
          "signupEmail"
        ).value;

      const password =
        document.getElementById(
          "signupPassword"
        ).value;

      const confirmPassword =
        document.getElementById(
          "confirmPassword"
        ).value;

      /* PASSWORD CHECK */

      if (
        password !==
        confirmPassword
      ) {

        alert(
          "Passwords do not match"
        );

        return;

      }

      try {

        const response =
          await fetch(

"http://college-finder-52c0.onrender.com/api/signup",

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json"

              },

              body: JSON.stringify({

                name,
                email,
                password

              })

            }

          );

        const data =
          await response.json();

        /* SUCCESS */

        if (
          data.message ===
          "Signup successful"
        ) {

          alert(
            "Account created successfully"
          );

          window.location.href =
            "login.html";

        }

        /* ERROR */

        else {

          alert(
            data.error
          );

        }

      } catch (error) {

        console.error(error);

        alert(
          "Signup failed"
        );

      }

    }
  );

}
/* ================= LOGIN ================= */

const loginForm =
  document.getElementById(
    "loginForm"
  );

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const email =
        document.getElementById(
          "loginEmail"
        ).value;

      const password =
        document.getElementById(
          "loginPassword"
        ).value;

      try {

        const response =
          await fetch(

"http://college-finder-52c0.onrender.com/api/login",

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json"

              },

              body: JSON.stringify({

                email,
                password

              })

            }

          );

        const data =
          await response.json();

        alert(data.message);

        if (
  data.message ===
  "Login successful"
) {

  /* STORE LOGIN */

  localStorage.setItem(
    "isLoggedIn",
    "true"
  );

  localStorage.setItem(
    "userEmail",
    email
  );

  /* REDIRECT */

  window.location.href =
    "index.html";

}

      } catch (error) {

        console.error(error);

      }

    }
  );

}
/* ================= LOGIN STATUS ================= */

window.addEventListener(
  "DOMContentLoaded",
  () => {

    const loginBtn =
      document.querySelector(
        ".login-btn"
      );

    const isLoggedIn =
      localStorage.getItem(
        "isLoggedIn"
      );

    if (
      loginBtn &&
      isLoggedIn === "true"
    ) {

      loginBtn.innerText =
        "Logout";

      loginBtn.addEventListener(
        "click",
        () => {

          localStorage.removeItem(
            "isLoggedIn"
          );

          localStorage.removeItem(
            "userEmail"
          );

          window.location.href =
            "login.html";

        }
      );

    }

  }
);
/* ================= LOGIN / LOGOUT UI ================= */

window.addEventListener(
  "DOMContentLoaded",
  () => {

    const loginBtn =
      document.querySelector(
        ".login-btn"
      );

    if (!loginBtn) return;

    const isLoggedIn =
      localStorage.getItem(
        "isLoggedIn"
      );

    /* USER LOGGED IN */

    if (
      isLoggedIn === "true"
    ) {

      loginBtn.innerText =
        "Logout";

      loginBtn.addEventListener(
        "click",
        () => {

          /* CLEAR STORAGE */

          localStorage.removeItem(
            "isLoggedIn"
          );

          localStorage.removeItem(
            "userEmail"
          );

          /* GO LOGIN PAGE */

          window.location.href =
            "login.html";

        }
      );

    }

    /* USER NOT LOGGED IN */

    else {

      loginBtn.addEventListener(
        "click",
        () => {

          window.location.href =
            "login.html";

        }
      );

    }

  }
);

/* ================= SITE AUTH GUARD ================= */

document.addEventListener(
  "click",
  (e) => {

    const link =
      e.target.closest("a");

    if (!link) return;

    const isLoggedIn =
      localStorage.getItem(
        "isLoggedIn"
      );

    if (
      isLoggedIn !== "true"
    ) {

      const href =
        link.getAttribute("href");

      if (
        href &&
        href !== "login.html" &&
        href !== "signup.html"
      ) {

        e.preventDefault();

        alert(
          "Please login first to continue."
        );

        window.location.href =
          "login.html";

      }

    }

  }
);