"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const userCard = document.getElementById("userCard");
const userList = document.getElementById("userList");
// Default GitHub users
const defaultUsers = [
    "torvalds",
    "gaearon",
    "addyosmani",
    "mojombo",
    "tj",
    "sindresorhus",
    "kentcdodds",
    "yyx990803",
];
// Function to create user card
function createUserCard(user) {
    return `
        <div class="user-card">
            <img src="${user.avatar_url}" alt="${user.login}">
            <h2>${user.name || user.login}</h2>
            <p>@${user.login}</p>
            <p>Repos: ${user.public_repos} | Followers: ${user.followers}</p>
            <a href="${user.html_url}" target="_blank">View Profile</a>
        </div>
    `;
}
// Fetch GitHub user data
function fetchUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) {
                const errorData = yield response.json();
                // Handle API Rate Limit Error
                if (errorData.message.includes("API rate limit exceeded")) {
                    showToast("GitHub API rate limit exceeded. Try again later!");
                    throw new Error("API rate limit exceeded");
                }
                if (response.status === 404)
                    throw new Error("User not found");
                throw new Error("Failed to fetch user");
            }
            return yield response.json();
        }
        catch (error) {
            console.error("Error fetching user:", error);
            return null;
        }
    });
}
// Display searched user details
function displayUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        userCard.innerHTML = `<p>Loading...</p>`;
        const user = yield fetchUser(username);
        if (user) {
            userCard.innerHTML = createUserCard(user);
            userCard.classList.add("active");
            // Show the user card container
            const userCardContainer = document.querySelector(".user-card-container");
            userCardContainer.style.display = "block";
        }
        else {
            userCard.innerHTML = `<p>User not found</p>`;
            // Hide the user card container if no user is found
            const userCardContainer = document.querySelector(".user-card-container");
            userCardContainer.style.display = "none";
        }
    });
}
// Load default users
function loadDefaultUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        userList.innerHTML = "";
        const userPromises = defaultUsers.map(fetchUser);
        const users = yield Promise.all(userPromises);
        userList.innerHTML = users
            .filter((user) => user !== null)
            .map(createUserCard)
            .join("");
    });
}
// Handle search button click
function handleSearch() {
    return __awaiter(this, void 0, void 0, function* () {
        const username = searchInput === null || searchInput === void 0 ? void 0 : searchInput.value.trim();
        if (!username) {
            showToast("Please enter a username!");
            return;
        }
        // Hide the user card initially
        userCard.style.display = "none";
        const user = yield fetchUser(username);
        if (user) {
            displayUser(username);
            // Show the user card and scroll to it
            userCard.style.display = "block";
            setTimeout(() => {
                userCard.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300); // Delay to ensure visibility before scrolling
        }
        else {
            showToast("User not found!");
        }
    });
}
// Event Listeners
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter")
        handleSearch();
});
// Load default users on page load
document.addEventListener("DOMContentLoaded", loadDefaultUsers);
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast)
        return;
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}
