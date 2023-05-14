// _ draw graph
var graph_tree;
var mods;
var local_graph;

function center(id) {
  chart.center(id, null, function () {
    chart.zoom(2);
  });
}

function set_graph_to_block(id_el, block_id) {
  if (local_graph != null) {
    local_graph.center(id_el);
    return;
  }

  local_graph = new OrgChart(document.getElementById(block_id), {
    enableSearch: false,
    template: "john",
    // template: "ula",

    mouseScrool: OrgChart.action.none,
    nodeMouseClick: OrgChart.action.none,
    tags: {
      filter: {
        template: "dot",
      },
    },
    zoom: 5,
    nodeBinding: {
      name: "name",
      post: "post",
      department: "department",
      city: "city",
      img: "img",
    },
  });
  local_graph.load(nods);
  local_graph.on("init", function () {
    local_graph.center(id_el);
  });
}

function open_card(sender, args) {
  sender.center(args.node.id);
  //   c.innerHTML += "click(sender, args)<br />";
  console.log(sender);
  console.log(args.node.id);
  let i = setInterval(function () {
    if (document.querySelector(".boc-edit-form")) {
      // если нашли останавливаем таймер и вызываем алерт
      clearInterval(i);
      console.log("element found");
    }
  }, 10);

  // эмуляция асинхронного добавления, через 2 секунды добавим элемент
  setTimeout(function () {
    document.getElementsByClassName("boc-edit-form")[0].remove();
    open_account_profile();
  }, 1);
}

function start(id_el) {
  if (id_el === undefined) {
    id_el = 1;
  }
  //   document.getElementById("settings").click();
  //   changeArticle("graph");
  //JavaScript
  //   go_to_page();
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

  graph_tree = new OrgChart(document.getElementById("tree"), {
    enableSearch: false,
    template: "cool",
    toolbar: {
      zoom: true,
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

  nods = [
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

  graph_tree.load(nods);
  graph_tree.on("init", function () {
    graph_tree.center(id_el);
  });
  graph_tree.on("click", function (sender, args) {
    open_card(sender, args);
  });
  function preview() {
    OrgChart.pdfPrevUI.show(chart, {
      format: "A4",
    });
  }
}

function getInfo() {
  return "<button>hello</button>";
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
const drawProject = () =>
  anychart.onDocumentReady(function () {
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
        value: 60,
        name: "Project",
        normal: { fill: "#afb5f1 0.7" },
      },
      {
        x: "A3",
        value: 60,
        name: "Project",
        normal: { fill: "#afb5f1 0.7" },
      },
      {
        x: "C",
        value: 10,
        name: "Human",
        normal: { fill: "#c7c2bd 0.7" },
      },
      {
        x: "C1",
        value: 10,
        name: "Human",
        normal: { fill: "#c7c2bd 0.7" },
      },
      {
        x: "C2",
        value: 10,
        name: "Human",
        normal: { fill: "#c7c2bd 0.7" },
      },
      {
        x: "B",
        value: 10,
        name: "Human",
        normal: { fill: "#c7c2bd 0.7" },
      },
      {
        x: "B2",
        value: 10,
        name: "Human",
        normal: { fill: "#c7c2bd 0.7" },
      },
      {
        x: "B1",
        value: 10,
        name: "Human",
        normal: { fill: "#c7c2bd 0.7" },
      },
      {
        x: "D",
        value: 10,
        name: "Human",
        normal: { fill: "#c7c2bd 0.7" },
      },
      {
        x: "Dep",
        value: 300,
        normal: { fill: "#c7c2bd 0.7" },
      },
      {
        x: "Dep1",
        value: 300,
        normal: { fill: "#c7c2bd 0.7" },
      },
      {
        x: ["Dep", "A"],
        value: 300,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["Dep1", "A1"],
        value: 300,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["Dep1", "A3"],
        value: 100,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["Dep", "B"],
        value: 300,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["Dep1", "B1"],
        value: 300,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["Dep1", "B2"],
        value: 300,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["Dep", "C"],
        value: 300,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["Dep1", "C2"],
        value: 300,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["Dep1", "C1"],
        value: 300,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["Dep", "D"],
        value: 300,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["Dep1", "D1"],
        value: 300,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["A", "C"],
        value: 10,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["A1", "C1"],
        value: 10,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["A3", "C2"],
        value: 10,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["A", "B"],
        value: 10,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["A1", "A3", "B1"],
        value: 10,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["A3", "B2"],
        value: 10,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["A", "D"],
        value: 10,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["A1", "B1"],
        value: 10,
        normal: { fill: "#99a0df 0.7" },
      },
      {
        x: ["A3", "B1"],
        value: 10,
        normal: { fill: "#99a0df 0.7" },
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
    chart.intersections().labels().fontSize(11).fontColor("#000").format("");
    // setting the title
    chart.title().enabled(false).useHtml(false);
    chart.legend(false);
    // improving the tooltip
    chart.tooltip().format("");
    chart.tooltip().separator(false);
    // setting the container id
    chart.container("container");
    // drawing the diagram
    chart.draw();
  });
