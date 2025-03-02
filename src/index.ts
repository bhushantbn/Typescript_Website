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
async function fetchUser(username: string): Promise<GitHubUser | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      const errorData = await response.json();

      // Handle API Rate Limit Error
      if (errorData.message.includes("API rate limit exceeded")) {
        showToast("GitHub API rate limit exceeded. Try again later!");
        throw new Error("API rate limit exceeded");
      }

      if (response.status === 404) throw new Error("User not found");
      throw new Error("Failed to fetch user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Display searched user details
async function displayUser(username: string): Promise<void> {
  userCard.innerHTML = `<p>Loading...</p>`;
  const user = await fetchUser(username);

  if (user) {
    userCard.innerHTML = createUserCard(user);
    userCard.classList.add("active");

    // Show the user card container
    const userCardContainer = document.querySelector(
      ".user-card-container"
    ) as HTMLDivElement;
    userCardContainer.style.display = "block";
  } else {
    userCard.innerHTML = `<p>User not found</p>`;

    // Hide the user card container if no user is found
    const userCardContainer = document.querySelector(
      ".user-card-container"
    ) as HTMLDivElement;
    userCardContainer.style.display = "none";
  }
}

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

  // Hide the user card initially
  userCard.style.display = "none";

  const user = await fetchUser(username);

  if (user) {
    displayUser(username);

    // Show the user card and scroll to it
    userCard.style.display = "block";
    setTimeout(() => {
      userCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300); // Delay to ensure visibility before scrolling
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
function showToast(message: string) {
  const toast = document.getElementById("toast") as HTMLDivElement;
  if (!toast) return;

  toast.textContent = message;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
