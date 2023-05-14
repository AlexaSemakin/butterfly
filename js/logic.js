let active_page = "";
let show_search_bar = true;
const search_bar = document.querySelector('.menu');
const paramsApi = {
	url: "http://185.246.67.74:8080/"
}

function add_search_bar() {
	if (show_search_bar == false) {
		show_search_bar = true;
		search_bar.style.display = "block"
	}
}

async function to_graph() {
	let cardId = "graph"
	if (active_page != cardId) {
		add_search_bar();
		active_page = cardId;
		await go_to_page(cardId + "/" + cardId + ".html");
		active_nav(active_page);
		start();
	}
}
async function to_project() {
	let cardId = "graph-project-viev"
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
	}
}

async function to_adress_book() {
	let adressId = "adress-book";
	if (active_page != adressId) {
		add_search_bar();
		active_page = adressId;
		await go_to_page(adressId + "/" + adressId + ".html");
		active_nav(active_page);
		add_notice();
	}
}

async function to_chat() {
	let chatId = "chat"
	if (active_page != chatId) {
		search_bar.style.display = "none"
		active_page = chatId;
		await go_to_page(chatId + "/" + chatId + ".html");
		active_nav(active_page);
	}
}

document.getElementById('chat').addEventListener("click", () => {
	if (show_search_bar === true) {
		show_search_bar = false;
		search_bar.style.display = "none";
	}
});

async function go_to_page(url) {
	if (url != undefined) {
		const text = (await await fetch(url)).text();
		document.getElementsByTagName("article")[0].innerHTML = await text;
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
		if (id == "graph") {
			start();
		}
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

// draw loading
const savedId = document.getElementById('loading-brick');
let loadCount = 0;
function setLoading() {
	if (loadCount < 4) {
		console.log(1);
		const li_el = document.createElement('li');
		const div_text = document.createElement('div');
		const icon_el = document.createElement('i');
		const text = document.createTextNode("Сохранено");
		icon_el.classList.add("fa-solid", "fa-check", "fa-xl");
		icon_el.style.color = "#808000";


		div_text.appendChild(text);
		li_el.appendChild(div_text);
		li_el.appendChild(icon_el);

		savedId.appendChild(li_el);
		setTimeout((le_el) => {
			savedId.firstElementChild.remove();
			index--;
		}, 3000);
	}
}

// _ draw graph
function start() {
	changeArticle("graph");
	//JavaScript
	OrgChart.templates.cool = Object.assign({}, OrgChart.templates.ana);
	OrgChart.templates.cool.defs =
		'<filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="cool-shadow"><feOffset dx="0" dy="4" in="SourceAlpha" result="shadowOffsetOuter1" /><feGaussianBlur stdDeviation="10" in="shadowOffsetOuter1" result="shadowBlurOuter1" /><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.1 0" in="shadowBlurOuter1" type="matrix" result="shadowMatrixOuter1" /><feMerge><feMergeNode in="shadowMatrixOuter1" /><feMergeNode in="SourceGraphic" /></feMerge></filter>';

	OrgChart.templates.cool.size = [310, 120];
	OrgChart.templates.cool.node = `
	<rect filter="url(#cool-shadow)"  x="0" y="0" height="120" width="310" fill="#ffffff" stroke-width="1" stroke="#eeeeee" rx="10" ry="10"></rect>
	  <rect stroke="#aaaaaa" stroke-width="1" fill="#ffffff" x="100" y="10" width="200" height="100" rx="10" ry="10" "></rect>
	  `;

	OrgChart.templates.cool.img =
		'<clipPath id="{randId}"><rect  fill="#ffffff" stroke="#039BE5" stroke-width="5" x="10" y="10" rx="10" ry="10" width="80" height="100"></rect></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="10"  width="80" height="100"></image><rect fill="none" stroke="#F57C00" stroke-width="2" x="10" y="10" rx="10" ry="10" width="80" height="100"></rect>';

	OrgChart.templates.cool.name =
		'<text  style="font-size: 18px;" fill="#555555" x="110" y="30">{val}</text>';
	OrgChart.templates.cool.post =
		'<text  style="font-size: 14px;" fill="#F57C00" x="110" y="80">{val}</text>';
	OrgChart.templates.cool.department =
		'<text style="font-size: 14px;" fill="#777777" x="110" y="100">{val}</text>';
	OrgChart.templates.cool.points =
		'<text style="font-size: 24px;" fill="#F57C00" x="270" y="165" text-anchor="middle">{val}</text>';
	// OrgChart.templates.anaOrange.editFormHeaderColor = '#FFCA28';

	let cities = ["Tomsk", "Moscow", "St Petersburg"];
	let post = ["Manager", "frontent developer", "backend developer"];
	let department = [
		"Market Research",
		"Product Distribution",
		"Product Decisions",
		"Price Decisions",
		"Promotion Decisions",
	];
	let name_filter = ["Должность", "Депортамент", "Город"];
	var chart = new OrgChart(document.getElementById("tree"), {
		enableSearch: false,
		template: "cool",
		editForm: {
			buttons: {
				edit: null,
				pdf: null,
				share: null,
			},
		},
		tags: {
			filter: {
				template: "dot",
			},
		},
		filterBy: {
			post: {},
			department: {},
			city: {
				Tomsk: { checked: true },
				Moscow: { checked: true },
				"St Petersburg": { checked: true },
			},
		},
		menu: {
			pdfPreview: {
				text: "PDF Preview",
				icon: OrgChart.icon.pdf(24, 24, "#7A7A7A"),
				onClick: preview,
			},
			pdf: { text: "Export PDF" },
			png: { text: "Export PNG" },
			svg: { text: "Export SVG" },
			csv: { text: "Export CSV" },
		},

		nodeBinding: {
			name: "name",
			post: "post",
			department: "department",
			city: "city",
			img: "img",
		},
	});

	let nods = [
		{
			id: 1,
			name: "John Smith",
			post: "CEO",
			department: "Application Development",
			city: cities[1],
			img: "https://balkangraph.com/js/img/1.jpg",
		},
	];
	for (let i = 2; i < 50; i++) {
		nods.push({
			id: i,
			pid: rand(i),
			name: "John Smith",
			post: post[rand(post.length) - 2],
			department: department[rand(department.length) - 1],
			city: cities[rand(3) - 1],
			img: "https://cdn.balkan.app/shared/" + ((i % 18) + 1) + ".jpg",
		});
	}

	// chart.load(JSON.parse(dots_json));
	chart.load(nods);
	//   chart.onload(change_filters())
	function preview() {
		OrgChart.pdfPrevUI.show(chart, {
			format: "A4",
		});
	}
}

// function change_filters(){
//     let elements = getElementByXpath(
//         '//*[@id="tree"]/div[2]/div[1]'
//       ).getElementsByTagName("div");
//       for (let i = 0; i < elements.length; i++) {
//         const element = array[i];
//         element.innerHTML = name_filter[i];
//       }
// }


// _ draw project
const drawProject = () => anychart.onDocumentReady(function () {
	// adding data  
	let data = [
		{
			x: "A",
			value: 60,
			name: "Project",
			normal: { fill: "#afb5f1 0.7" },
		},
		{
			x: "A1",
			value: 60, name: "Project",
			normal: { fill: "#afb5f1 0.7" }
		},
		{
			x: "A3", value: 60,
			name: "Project", normal: { fill: "#afb5f1 0.7" }
		},
		{
			x: "C", value: 10,
			name: "Human", normal: { fill: "#c7c2bd 0.7" }
		},
		{
			x: "C1", value: 10,
			name: "Human", normal: { fill: "#c7c2bd 0.7" }
		},
		{
			x: "C2",
			value: 10, name: "Human",
			normal: { fill: "#c7c2bd 0.7" }
		},
		{
			x: "B", value: 10,
			name: "Human",
			normal: { fill: "#c7c2bd 0.7" }
		},
		{
			x: "B2", value: 10,
			name: "Human", normal: { fill: "#c7c2bd 0.7" }
		},
		{
			x: "B1",
			value: 10, name: "Human",
			normal: { fill: "#c7c2bd 0.7" }
		},
		{
			x: "D", value: 10,
			name: "Human", normal: { fill: "#c7c2bd 0.7" }
		},
		{
			x: "Dep",
			value: 300, normal: { fill: "#c7c2bd 0.7" }
		},
		{
			x: "Dep1",
			value: 300, normal: { fill: "#c7c2bd 0.7" }
		},
		{
			x: ["Dep", "A"],
			value: 300, normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["Dep1", "A1"],
			value: 300, normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["Dep1", "A3"],
			value: 100,
			normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["Dep", "B"], value: 300,
			normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["Dep1", "B1"],
			value: 300, normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["Dep1", "B2"],
			value: 300, normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["Dep", "C"],
			value: 300, normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["Dep1", "C2"],
			value: 300, normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["Dep1", "C1"],
			value: 300, normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["Dep", "D"], value: 300,
			normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["Dep1", "D1"], value: 300,
			normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["A", "C"], value: 10,
			normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["A1", "C1"],
			value: 10, normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["A3", "C2"],
			value: 10, normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["A", "B"],
			value: 10, normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["A1", "A3", "B1"],
			value: 10, normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["A3", "B2"],
			value: 10, normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["A", "D"],
			value: 10, normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["A1", "B1"],
			value: 10, normal: { fill: "#99a0df 0.7" }
		},
		{
			x: ["A3", "B1"],
			value: 10, normal: { fill: "#99a0df 0.7" }
		},

	];

	// creating a venn diagram with the data
	let chart = anychart.venn(data);
	// setting the labels  
	chart
		.labels()
		.fontSize(14)
		.fontColor("#000")
		.hAlign("center")
		.vAlign("center")
		.fontWeight("500");
	// setting the intersection labels
	chart.intersections()
		.labels()
		.fontSize(11)
		.fontColor("#000")
		.format("");
	// setting the title
	chart
		.title()
		.enabled(false)
		.useHtml(false);
	chart.legend(false);
	// improving the tooltip
	chart.tooltip().format(""); chart.tooltip().separator(false);
	// setting the container id
	chart.container("container");
	// drawing the diagram  
	chart.draw();
});




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
		`
	}
	document.getElementById("noti_blocks").innerHTML = htmlText;
}

async function settingsGet() {
	const title_text = ["Имя", "Фамилия", "Почта", "Должность", "Отчество",
		"Дата", "Пол", "Резюме", "Телефон", "Город", "Дата приема на работу", "Телеграм", "Язык уведолении", "О человеке", "Граф"];
	const userPersonalSettings = await (await fetch(paramsApi.url + "personsDetail")).text();
	const user_sett = JSON.parse(userPersonalSettings);
	const user_entries = Object.entries(user_sett[0].settings);
	console.log(settings);
	generateHtml(user_entries, title_text);
}

// posts settings
const postPersonalInfo = () => {
	const info_el = document.querySelectorAll('._user_info');
	info_el.forEach(el => {
		console.log(el.value);
	});
}

// get and set values of setting

// _ change page
let is_opened = false;
function change_body_grid(rm_class, add_class) {
	document.body.classList.remove(rm_class);
	document.body.classList.add(add_class);
}

function open_account_profile() {

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
