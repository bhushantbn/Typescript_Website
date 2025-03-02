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
  "mjackson",
  "rauchg",
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
      if (response.status === 404) throw new Error("User not found");
      throw new Error("Failed to fetch user");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
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
  } else {
    userCard.innerHTML = `<p>User not found</p>`;
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

  // Clear previous search result
  if (userCard) {
    userCard.innerHTML = "";
    userCard.classList.remove("active");
  }

  const user = (await fetchUser(username)) as any;

  if (user) {
    displayUser(user);
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
  }, 3000); // Hide after 3 seconds
}
