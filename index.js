document.addEventListener("DOMContentLoaded", () => {
  //Implement Your Code Here
  const burgerMenuDiv = document.getElementById('burger-menu');
  const orderButton = document.getElementById('order-button');
  const orderListContainer = document.querySelector('#order-list');
  const customFormId = document.querySelector('#custom-burger')

  function fetchAllBurgers(){
    fetch('http://localhost:3000/burgers')
    .then(response => response.json())
    .then(burgers => renderAll(burgers))
  }

  function renderAll(burgers) {
    burgerMenuDiv.innerHTML = ''
    burgers.forEach(function(burger) {
      burgerMenuDiv.innerHTML += `
      <div class="burger">
        <h3 class="burger_title"> ${burger.name}</h3>
          <img src= ${burger.image}>
          <p class="burger_description">
            ${burger.description}
          </p>
          <button class="button" id='add-btn' data-id = ${burger.id}>Add to Order</button>
          <button class="button" id='delete-btn' data-id = ${burger.id}>Delete to Order</button>
          <button class="button" id='edit-btn' data-id = ${burger.id}>Edit to Order</button>
      </div>
      `
    })
  }

  function getOneBurger(burgerId) {
    return fetch(`http://localhost:3000/burgers/${burgerId}`)
    .then(res => res.json())
  }


  function createBurgerLi(burger) {
    return `<li>${burger.name}</li>`
  }


  burgerMenuDiv.addEventListener('click', function(e) {
    if(e.target.id === 'add-btn') {
      const burgerId = e.target.dataset.id;
      getOneBurger(burgerId)
      .then(burger => orderListContainer.innerHTML += createBurgerLi(burger))
    } else if (e.target.id === 'delete-btn') {
      const burgerId = e.target.dataset.id;
      deleteOneBurger(burgerId)
    } else if (e.target.id === 'edit-btn') {
      const burgerId = e.target.dataset.id;
      getOneBurger(burgerId)
      .then(burger => editOneBurger(burger))
    }
  })

  function editOneBurger(burger) {
      console.log(burger);
      let burgerName1 = document.querySelector('#burger-name');
      let burgerDescription1 = document.querySelector('#burger-description');
      let burgerImage1 = document.querySelector('#burger-image');
      burgerName1.value = burger.name;
      burgerDescription1.value = burger.description;
      burgerImage1.value = burger.image;

    // let burgerName = document.querySelector('#burger-name').value;
    // let burgerDescription = document.querySelector('#burger-description').value;
    // let burgerImage = document.querySelector('#burger-image').value;

    console.log(burgerName, burgerDescription, burgerImage);

    return fetch(`http://localhost:3000/burgers/${burger.id}`, {
      method: "PATCH",
      headers: {
        "Content-type":"application:json"
      },
      body: JSON.stringify({name: burgerName1, description: burgerDescription1, image: burgerImage1})
    })
    .then(res => res.json())
    .then(fetchAllBurgers)
  }

  function deleteOneBurger(burgerId) {
    return fetch(`http://localhost:3000/burgers/${burgerId}`, {
      method: 'DELETE'
    })
    .then(fetchAllBurgers)
  }

  orderButton.addEventListener('click', function(e) {
    e.preventDefault()
    let customBurgerName = document.querySelector('#burger-name').value;
    let customBurgerDescription = document.querySelector('#burger-description').value;
    let customBurgerImage = document.querySelector('#burger-image').value;

    fetch('http://localhost:3000/burgers', {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({name: customBurgerName, description: customBurgerDescription, image: customBurgerImage})
    })
    .then(res => res.json())
    .then(burger => orderListContainer.innerHTML += createBurgerLi(burger))

  })


  fetchAllBurgers();

})
