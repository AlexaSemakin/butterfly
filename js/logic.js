let active_page = "";

let show_search_bar = true;
const search_bar = document.querySelector(".menu");
to_profile();

const paramsApi = {
  url: "http://185.246.67.74:8080/",
};

async function get_fetched_text(responseUrl, query = "") {
  try {
    const response = await fetch(paramsApi.url + responseUrl + query);
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const user_data = await response.json();
    return user_data;
  } catch (err) {
    console.log(err);
  }
}

function add_search_bar() {
  if (show_search_bar == false) {
    show_search_bar = true;
    search_bar.style.display = "block";
  }
}

async function to_graph() {
  let cardId = "graph";
  if (active_page != cardId) {
    add_search_bar();
    active_page = cardId;
    await go_to_page(cardId + "/" + cardId + ".html");
    active_nav(active_page);
    start(1);
  }
}

function go_to_() {
	close_account_profile();
	to_graph();
}

async function to_project() {
  let cardId = "graph-project-viev";
  if (active_page != cardId) {
    add_search_bar();
    active_page = cardId;
    await go_to_page("project-graph-view/project-graph-view.html");
    active_nav(active_page);
    drawProject();
  }
}

async function to_profile() {
  let profileId = "settings";
  if (active_page != profileId) {
    add_search_bar();
    active_page = profileId;
    await go_to_page(profileId + "/" + profileId + ".html");
    active_nav(active_page);
    settingsGet();
    fill_personal_info();
    set_post_event();
  }
}
to_profile();

async function to_adress_book() {
  let adressId = "adress-book";
  if (active_page != adressId) {
    add_search_bar();
    active_page = adressId;
    await go_to_page(adressId + "/" + adressId + ".html");
    active_nav(active_page);
    add_notice();
    await add_notice("skldfjsldkfjs;ldkjfs;ldkfjsdfjk");
  }
}

async function to_chat() {
  let chatId = "chat";
  if (active_page != chatId) {
    search_bar.style.display = "none";
    active_page = chatId;
    await go_to_page(chatId + "/" + chatId + ".html");
    active_nav(active_page);
    close_account_profile();
  }
}

document.getElementById("chat").addEventListener("click", () => {
  if (show_search_bar === true) {
    show_search_bar = false;
    search_bar.style.display = "none";
  }
});

async function go_to_page(url) {
  if (url != undefined) {
    const text = await (await fetch(url)).text();
    document.getElementsByTagName("article")[0].innerHTML = text;
  }
}

function active_nav(elem_id) {
  document
    .getElementsByClassName("active_nav_button__image")[0]
    .classList.remove("active_nav_button__image");
  document.getElementById(elem_id).classList.add("active_nav_button__image");
}

async function changeArticle(id) {
  if (active_page != id) {
    active_page = id;
    await go_to_page(id + "/" + id + ".html");
    active_nav(id);
    // if (id == "graph") {
    //   start(10);
    // }
  }
}

document.getElementById("info_button").addEventListener("click", () => {
  open_account_profile();
});

function rand(a) {
  return parseInt(Math.floor(Math.random() * a)) + 1;
}

function go() {
  console.log("Node clicked: ");
}

function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}
async function load_graph() {
  active_page = "graph";
  await go_to_page("graph/graph.html");
  active_nav(active_page);
}

// _ draw loading
const savedId = document.getElementById("loading-brick");
let loadCount = 0;
function setLoading() {
  if (loadCount < 4) {
    const li_el = document.createElement("li");
    const div_text = document.createElement("div");
    const icon_el = document.createElement("i");
    const text = document.createTextNode("Сохранено");
    icon_el.classList.add("fa-solid", "fa-check", "fa-xl");
    icon_el.style.color = "#808000";

    div_text.appendChild(text);
    li_el.appendChild(div_text);
    li_el.appendChild(icon_el);

    div_text.appendChild(text);
    li_el.appendChild(div_text);
    li_el.appendChild(icon_el);
    loadCount++;
    savedId.appendChild(li_el);
    setTimeout((le_el) => {
      savedId.firstElementChild.remove();
      loadCount--;
    }, 3000);
  }
}

function set_post_event() {
  const buttons = document.querySelectorAll("._put_req");
  buttons.forEach((el) => {
    el.addEventListener("click", () => setLoading());
  });
}

// set settings
const generateHtml = (obj, title_text) => {
  let htmlText = "";
  let checkIt = "";
  for (let index = 0; index < obj.length; index++) {
    if (obj[index][1]) {
      checkIt = "checked";
    } else checkIt = "";

    htmlText += `
			<div id="setting_${obj[index][0]}" class="switch_setting">
			<div id="notice_${obj[index][0]}__text">
				<div id="notice_${obj[index][0]}__title">${title_text[index]}</div>
				<div id="notice_${obj[index][0]}__description">
					
				</div>
			</div>
			<div id="notice_${obj[index][0]}__input">
				<label class="switch">
					<input type="checkbox" ${checkIt}/>
					<span class="slider round"></span>
				</label>
			</div>
			</div>
		`;
  }
  document.getElementById("noti_blocks").innerHTML = htmlText;
};

async function settingsGet() {
  const title_text = [
    "Имя",
    "Фамилия",
    "Почта",
    "Должность",
    "Отчество",
    "Дата",
    "Пол",
    "Резюме",
    "Телефон",
    "Город",
    "Дата приема на работу",
    "Телеграм",
    "Язык уведолении",
    "О человеке",
    "Граф",
  ];
  const user_sett = await get_fetched_text("personsDetail");
  const user_entries = Object.entries(user_sett[0].settings);
  generateHtml(user_entries, title_text);
}

// posts settings
const postPersonalInfo = () => {
  const info_el = document.querySelectorAll("._user_info");
  info_el.forEach((el) => {
    console.log(el.value);
  });
};

// get and set values of setting

// _ change page
let is_opened = false;
function change_body_grid(rm_class, add_class) {
  document.body.classList.remove(rm_class);
  document.body.classList.add(add_class);
}

async function open_account_profile(el) {
  // TODO: parse json


  document.getElementById("account_profile").style.display = "block";
  document.getElementById("account_profile").style.gridArea = "_user";

  change_body_grid("grid_close", "grid_open");
  is_opened = true;
}
function close_account_profile() {
  change_body_grid("grid_open", "grid_close");
  document.getElementById("account_profile").style.display = "none";
  is_opened = false;
}

// search
const search_bar_el = document.getElementById("input_search");
search_bar_el.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    add_notice(search_bar_el.value);
  }
});

async function search_user(text) {
  return await get_fetched_text("search/", text);
}

async function add_notice(text) {
  let block = document.getElementById("notice__messages");
  let obj = "";
  if (text.length > 0) {
    obj = await search_user(text);
  }
  // console.log(obj, text);
  let notices = "";
  if (obj.length == 0) {
    // notices += `<div>Не найдено ${text}</div>`;
    let aObj = await get_fetched_text("persons");
    for (let i = 0; i < aObj.length; i++) {
      notices += `
			<div class="profile" id="${aObj[i].id}" onclick="open_account_profile(this)">
				  <img src="${aObj[i].image}" alt="img" class="profile_photo_image">
				  <div class="profile_info">
					  <div class="profile_info_name">${aObj[i].name} ${aObj[i].surname}</div>
					  <div class="profile_info_post">${aObj[i].post}</div>
					  <div class="profile_info_department">${aObj[i].department}</div>
				  </div>
			  </div>
			`;
    }
  } else {
    for (let i = 0; i < obj.length; i++) {
      notices += `
			<div class="profile" id="${obj[i].object.id}" onclick="open_account_profile(this)">
				  <img src="${obj[i].object.image}"  alt="img" class="profile_photo_image">
				  <div class="profile_info">
					  <div class="profile_info_name">${obj[i].object.name} ${obj[i].object.surname}</div>
					  <div class="profile_info_post">${obj[i].object.post}</div>
					  <div class="profile_info_department">${obj[i].object.department}</div>
				  </div>
			  </div>
			`;
    }
  }

  block.innerHTML = notices;
}
