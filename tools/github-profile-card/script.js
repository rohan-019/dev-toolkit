document.getElementById("fetch-btn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const card = document.getElementById("profile-card");

  if (!username) {
    card.innerHTML = "<p>Please enter a username.</p>";
    card.classList.remove("hidden");
    return;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    const data = await res.json();

    if (data.message === "Not Found") {
      card.innerHTML = "<p>User not found. Try again!</p>";
      card.classList.remove("hidden");
      return;
    }

    card.innerHTML = `
      <img src="${data.avatar_url}" alt="${data.login}" class="avatar"/>
      <h2>${data.name || data.login}</h2>
      <p class="bio">${data.bio || "No bio available."}</p>
      <div class="stats">
        <span>👥 ${data.followers} Followers</span>
        <span>📦 ${data.public_repos} Repos</span>
      </div>
      <a href="${data.html_url}" target="_blank" class="profile-link">View Profile →</a>
    `;
    card.classList.remove("hidden");
  } catch (error) {
    card.innerHTML = "<p>Something went wrong. Try again later!</p>";
    card.classList.remove("hidden");
  }
});
