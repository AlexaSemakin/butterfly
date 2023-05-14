// _ draw graph
var graph_tree;
var nods;
var local_graph;

function center(id) {
  chart.center(id, null, function () {
    chart.zoom(2);
  });
}

async function getData(s) {
  return await (await fetch(s)).text();
}
async function set_graph_to_block(id_el, block_id) {
  if (local_graph != null) {
    local_graph.center(id_el);
    return;
  }

  local_graph = new OrgChart(document.getElementById(block_id), {
    enableSearch: false,
    template: "cool",

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
    // set_graph_to_block(1, "graph_view_window");
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

async function start(id_el) {
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

  //   nods = [
  //     {
  //       id: 1,
  //       name: "John Smith",
  //       post: "CEO",
  //       department: "Application Development",
  //       city: cities[1],
  //       img: "https://balkangraph.com/js/img/1.jpg",
  //     },
  //   ];
  //   for (let i = 2; i < 50; i++) {
  //     nods.push({
  //       id: i,
  //       pid: rand(i),
  //       name: "John Smith",
  //       post: post[rand(post.length) - 2],
  //       department: department[rand(department.length) - 1],
  //       city: cities[rand(3) - 1],
  //       img: "https://cdn.balkan.app/shared/" + ((i % 18) + 1) + ".jpg",
  //     });
  //   }
  const data = await getData("http://185.246.67.74:8080/personsGraph");
  nods = JSON.parse(data);

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

function getText() {
  return JSON.parse(dots_json);
}

// function start() {
//   anychart.onDocumentReady(function () {
//     // adding data
//     let data = get_venna();
//     data.sort();
//     data.reverse();
//     // creating a venn diagram with the data
//     let chart = anychart.venn(data);
//     console.log(data);
//     // setting the labels
//     chart
//       .labels()
//       .fontSize(14)
//       .fontColor("#000")
//       .hAlign("center")
//       .vAlign("center")
//       .fontWeight("500")
//       .format("{%Name}");

//     // setting the intersection labels
//     chart.intersections().labels().fontSize(11).fontColor("#000").format("");

//     // setting the title
//     chart.title().enabled(true).useHtml(true).text("");

//     // disabling the legend
//     chart.legend(false);

//     // improving the tooltip
//     chart.tooltip().format("");
//     chart.tooltip().separator(false);

//     // setting the container id
//     chart.container("container");

//     // drawing the diagram
//     chart.draw();
//   });
// }

// function
function get_dot(name, value, val, id) {
  if (val == undefined) {
    return { x: name, value: value, name: "" };
  }
  for (const item of val) {
    if (item.id == id) {
      return { x: name, value: value, name: item.name };
    }
  }
}

async function get_venna_data() {
  const value = await getData("http://185.246.67.74:8080/personsDetail");
  let val = JSON.parse(value);
  let man = new Set();
  let projects = new Set();
  let departments = new Set();
  let subdepartments = new Set();
  for (let i = 0; i < val.length; i++) {
    man.add(val[i].id);
    for (let j = 0; j < val[i].projects.length; j++) {
      projects.add(val[i].projects[j].id);
    }
    for (let j = 0; j < val[i].subdepartments.length; j++) {
      subdepartments.add(val[i].subdepartments[j].id);
    }
    for (let j = 0; j < val[i].departments.length; j++) {
      departments.add(val[i].departments[j].id);
    }
  }
  var data = [];
  for (const item of man.keys()) {
    data.push(get_dot("M" + item, 2, val, item));
  }
  for (const item of projects.keys()) {
    data.push(get_dot("P" + item, 50, val.projects));
  }
  for (const item of subdepartments.keys()) {
    data.push(get_dot("S" + item, 300, val.subdepartments));
  }
  for (const item of departments.keys()) {
    data.push(get_dot("D" + item, 500, val.department));
  }

  let links = new Set();
  for (let i = 0; i < val.length; i++) {
    for (let j = 0; j < val[i].projects.length; j++) {
      links.add("P" + val[i].projects[j].id + "&M" + val[i].id);
    }
  }
  for (const item of links) {
    data.push(get_dot(item, 25));
  }
  links.clear();
  for (let i = 0; i < val.length; i++) {
    for (let j = 0; j < val[i].projects.length; j++) {
      for (let k = 0; k < val[i].subdepartments.length; k++) {
        links.add(
          "S" + val[i].subdepartments[k].id + "&P" + val[i].projects[j].id
        );
      }
    }
  }
  for (const item of links) {
    data.push(get_dot(item, 100));
  }

  links.clear();
  for (let i = 0; i < val.length; i++) {
    for (let j = 0; j < val[i].subdepartments.length; j++) {
      for (let k = 0; k < val[i].departments.length; k++) {
        links.add(
          "D" + val[i].departments[k].id + "&S" + val[i].subdepartments[j].id
        );
      }
    }
  }
  for (const item of links) {
    data.push(get_dot(item, 300));
  }
  console.log(data);
  return data;
}

// _ draw project
const drawProject = () =>
  anychart.onDocumentReady(async function () {
    anychart.onDocumentReady(async function () {
      // adding data
      let data = await get_venna_data();
      data.sort();
      data.reverse();
      // creating a venn diagram with the data
      let chart = anychart.venn(data);
      // console.log(data);
      // setting the labels
      chart
        .labels()
        .fontSize(14)
        .fontColor("#000")
        .hAlign("center")
        .vAlign("center")
        .fontWeight("500")
        .format("{%name}");

      // setting the intersection labels
      chart.intersections().labels().fontSize(11).fontColor("#000").format("");

      // setting the title
      chart.title().enabled(true).useHtml(true).text("");

      // disabling the legend
      chart.legend(false);

      // improving the tooltip
      chart.tooltip().format("");
      chart.tooltip().separator(false);

      // setting the container id
      chart.container("container");

      // drawing the diagram
      chart.draw();
    });
  });
