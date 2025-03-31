let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector('#toy-collection');

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys();

  toyFormContainer.addEventListener('submit', event => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;
    const likes = 0;

    const newToy = { name, image, likes};

    createToy(newToy);
  });

  toyCollection.addEventListener('click', event => {
    if (event.target.classList.contains('like-btn')) {
      const toyId = event.target.id;
      const toyLikes = event.target.previousElementSibling;
      const currentLikes = parseInt(toyLikes.textContent);

      const updateLikesCount = currentLikes + 1;

      updateLikes(toyId, updateLikesCount, toyLikes);
    }
  });
});

function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy));
    })
    .catch(error => console.error("Error fetching toys:", error ));
}

function renderToy(toy) {
  const toyCollection = document.querySelector("#toy-collection");

  const card = document.createElement("div");
  card.classList.add("card");

  const name = document.createElement("h2");
  name.textContent = toy.name;

  const image = document.createElement("img");
  image.src = toy.image;
  image.classList.add("toy-avatar");

  const likes = document.createElement("p");
  likes.textContent = `${toy.likes} Likes`;

  const likeBtn = document.createElement("button");
  likeBtn.classList.add("like-btn");
  likeBtn.setAttribute("id", toy.id);
  likeBtn.textContent = "Like ❤️";

  card.appendChild(name);
  card.appendChild(image);
  card.appendChild(likes);
  card.appendChild(likeBtn);

  toyCollection.appendChild(card);
}

function createToy(toyData) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toyData)
  })
    .then(response => response.json())
    .then(newToy => renderToy(newToy))
    .catch(error => console.error("Error creating toy:", error));
}

function updateLikes(toyId, updatedLikes, toyLikesElement) {
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: {
      "Content-Type" : "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({likes: updatedLikes})
  })
    .then(response => response.json())
    .then(updatedToy => {
      toyLikesElement.textContent = `${updatedToy.likes} Likes`;
    })
    .catch(error => console.error("Error updating likes:", error));
}