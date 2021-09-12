const BASE_URL = 'http://localhost:3000/monsters';
const limit = 5000;       // limit the number of monsters returned
let page = 1;         // page number

const init = () => {

  // grab all necessary html elements
  const createMonsterDiv = document.querySelector('#create-monster');
  const monstersContainerDiv = document.querySelector('#monster-container');
  const backBtn = document.querySelector('#back');
  const forwardBtn = document.querySelector('#forward');

  // form to create a new monster
  createMonsterDiv.innerHTML = `<form id="create-monster-form">
                                    <input type="text" placeholder="name..." id="create-monster-name">
                                    <input type="text" placeholder="age..." id="create-monster-age">
                                    <input type="text" placeholder="description..." id="create-monster-description">
                                    <input type="submit" value="Create" id="create-monster-submit">
                                 </form>`;

  // grab the form element after it is created
  const createMonsterForm = document.querySelector('#create-monster-form');

  // function to render a single monster onto the DOM
  const renderSingleMonster = monsterJsonObj => {
    // create html tags for a single monster container, name, age, and description
    const singleMonsterDiv = document.createElement('div');
    const monsterNameTag = document.createElement('h2');
    const monsterAgeTag = document.createElement('h4');
    const monsterDescriptionTag = document.createElement('p');

    // set inner text to name, age, and description
    monsterNameTag.innerText = monsterJsonObj.name;
    monsterAgeTag.innerText = monsterJsonObj.age;
    monsterDescriptionTag.innerText = monsterJsonObj.description;

    // append monster container, name, age, and description tags to DOM
    singleMonsterDiv.appendChild(monsterNameTag);
    singleMonsterDiv.appendChild(monsterAgeTag);
    singleMonsterDiv.appendChild(monsterDescriptionTag);
    monstersContainerDiv.appendChild(singleMonsterDiv);
  };

  // function to get a list of monsters
  const getListOfMonsters = () => {
    if (page < 1) {
      alert('NO MORE MONSTERS!!!');
    }

    fetch(`${BASE_URL}/?_limit=${limit}&_page=${page}`)
      .then(response => response.json())
      .then(json => {
        json.forEach(renderSingleMonster);
      });
  };

  // function invoked when page loads for first time
  getListOfMonsters();


  // just one single function to handle both back and forward button clicks
  const backOrForwardPageHandler = (event) => {
    // remove current list of monsters from DOM first
    Array.from(monstersContainerDiv.children).forEach((singleDiv) => singleDiv.remove());

    // is it back or forward button clicked?
    const backOrForward = event.target.id;

    // decrement page number if back button is clicked, increment page number if forward button is clicked
    backOrForward === 'back' ? page-- : page++;

    // invoke this function to get another list of monsters
    getListOfMonsters();
  };

  // add event listeners on back and forward buttons
  backBtn.addEventListener('click', backOrForwardPageHandler);
  forwardBtn.addEventListener('click', backOrForwardPageHandler);

  // function to add and save new monster to API
  const addMonsterToAPI = (event) => {
    event.preventDefault();

    // grab user inputs
    const newMonsterName = event.target.children[0].value;
    const newMonsterAge = event.target.children[1].value;
    const newMonsterDescription = event.target.children[2].value;

    // data payload
    const formData = {
      name: newMonsterName,
      age: newMonsterAge,
      description: newMonsterDescription
    };

    // 2nd argument passing into fetch method
    const configObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(formData)
    };

    // POST /monsters
    fetch(BASE_URL, configObj)
      .then(response => response.json())
      .then((json) => console.log(json));

    createMonsterForm.reset();
  };

  // add event listener to create monster button
  createMonsterForm.addEventListener('submit', addMonsterToAPI);

};

document.addEventListener('DOMContentLoaded', init);