// *************** search functions ***********************

let searchForm = document.getElementById("searchForm");
let searchResults = document.getElementById("searchResults");

searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  let searchValue = searchForm.elements.searchInput.value.toLowerCase().trim();
  try {
    let responseData = await fetch(
      `https://api.github.com/search/users?q=${searchValue}`
    );

    if (!responseData.ok)
      throw new Error(responseData.status, "Submit event Error");

    let data = await responseData.json();

    if (!data.items.length)
      searchResults.innerHTML =
        "<p style='color:rgba(255, 72, 72, 0.78);'>User not found. Please check the true username.</p>";

    getUserToHTML(searchResults, data.items);
  } catch ({ message }) {
    searchResults.innerHTML = `<p style="color:red;"> ${
      message == 422
        ? "Please enter a valid search query."
        : message == 404
        ? "User not found. Please check the username."
        : message == 422
        ? "Search input is invalid. Try a valid username."
        : message == 403
        ? "Too many requests. Please wait or use a token."
        : message == 401 && "Authentication required. Please provide a token."
    }</p>`;
  }
});

async function getUserFromItems(items) {
  let userLogin = items[0].login;

  try {
    let response = await fetch(`https://api.github.com/users/${userLogin}`);
    if (!response.ok)
      throw new Error("getUserFromItems function error: ", response.status);
    let data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getUserToHTML(UserList, items) {
  let {
    login,
    id,
    avatar_url,
    html_url,
    followers,
    following,
    bio,
    location,
    name,
    public_repos,
  } = await getUserFromItems(items);

  let template = document.createElement("template");
  template.innerHTML = `
  <li class="card">
    <div class="card--header">
      <img src="${avatar_url}" alt="${login}" />
      <h2>${name || login}</h2>
    </div>
   <div class="card--info">
    <p><strong>name:</strong> ${login}</p>
    <p><strong>Bio:</strong> ${bio || "No bio provided"}</p>
    <p><strong>Location:</strong> ${location || "Not specified"}</p>
    <p><strong>Followers:</strong> ${followers}</p>
    <p><strong>Following:</strong> ${following}</p>
    <p><strong>Repos:</strong> ${public_repos}</p>
   </div>
    <a href="${html_url}" target="_blank">View Profile</a>
    <span>Exit</span>
  </li>
  `;

  UserList.innerHTML = "";
  UserList.append(template.content.firstElementChild);
  let deleteBtn = document.querySelector(".card span");

  deleteBtn.addEventListener("click", () => {
    document.querySelector(".card").style.display = "none";
  });
}

// ***************** search end ***********************

// ***************** pagination functions ***********************

// let 

