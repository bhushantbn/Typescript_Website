interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
const userCard = document.getElementById("userCard") as HTMLDivElement;
const userList = document.getElementById("userList") as HTMLDivElement;

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
function createUserCard(user: GitHubUser): string {
  return `
        <div class="user-card" onclick="displayUser('${user.login}')">
            <img src="${user.avatar_url}" alt="${user.login}">
            <h2>${user.name || user.login}</h2>
            <p>@${user.login}</p>
            <p>Repos: ${user.public_repos} | Followers: ${user.followers}</p>
            <a href="${user.html_url}" target="_blank" style="color: #0000EE; font-weight: bold;">View Profile</a>
        </div>
    `;
}

// Fetch GitHub user data
async function fetchUser(username: string): Promise<GitHubUser | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      const errorData = await response.json();

      // Handle API Rate Limit Error
      if (errorData.message.includes("API rate limit exceeded")) {
        showToast("GitHub API rate limit exceeded. Try again later!");
        return null;
      }

      if (response.status === 404) {
        showToast("User not found!");
        return null;
      }

      throw new Error("Failed to fetch user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

const userModal = document.getElementById("userModal") as HTMLDivElement;
const modalUserDetails = document.getElementById("modalUserDetails") as HTMLDivElement;
const closeModalBtn = document.querySelector(".close-modal") as HTMLSpanElement;

// Show user details in a modal
async function displayUser(username: string): Promise<void> {
  const user = await fetchUser(username);

  if (user) {
    modalUserDetails.innerHTML = `
      <div class="user-card">
          <img src="${user.avatar_url}" alt="${user.login}">
          <h2>${user.name || user.login}</h2>
          <p>@${user.login}</p>
          <p>Repos: ${user.public_repos} | Followers: ${user.followers}</p>
          <a href="${user.html_url}" target="_blank" style="color: #0000EE; font-weight: bold;">View Profile</a>
      </div>
    `;
    userModal.style.display = "flex";

    // Scroll to modal smoothly
    setTimeout(() => {
      userModal.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }
}

// Close Modal Event
closeModalBtn.addEventListener("click", () => {
  userModal.style.display = "none";
});

// Close Modal on Click Outside
window.addEventListener("click", (event) => {
  if (event.target === userModal) {
    userModal.style.display = "none";
  }
});

// Load default users
async function loadDefaultUsers(): Promise<void> {
  userList.innerHTML = "";
  const userPromises = defaultUsers.map(fetchUser);
  const users = await Promise.all(userPromises);

  userList.innerHTML = users
    .filter((user): user is GitHubUser => user !== null)
    .map(createUserCard)
    .join("");
}

// Handle search button click
async function handleSearch(): Promise<void> {
  const username = searchInput?.value.trim();
  if (!username) {
    showToast("Please enter a username!");
    return;
  }

  userCard.style.display = "none"; // Hide the card initially
  const user = await fetchUser(username);

  if (user) {
    displayUser(username);
  } else {
    showToast("User not found!");
  }
}

// Event Listeners
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e: KeyboardEvent) => {
  if (e.key === "Enter") handleSearch();
});

// Load default users on page load
document.addEventListener("DOMContentLoaded", loadDefaultUsers);

// Show Toast Notification (Centered at the Top)
function showToast(message: string) {
  const toast = document.getElementById("toast") as HTMLDivElement;
  if (!toast) return;

  toast.textContent = message;
  toast.style.display = "block";
  toast.style.top = "20px"; // Center at the top

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
