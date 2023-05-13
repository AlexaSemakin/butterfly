async function get_json_notices() {
	return (await await fetch("/json/adress-book.json")).text();
}



async function add_notice() {
	let block = document.getElementById("notice__messages");
	const json = await get_json_notices();
	let obj = JSON.parse(json);
	var notices = "";
	for (let i = 0; i < obj.length; i++) {
	  notices += `
	  <div class="profile">
			<img src="${obj[i].img}" class="profile_photo_image">
			<div class="profile_info">
				<div class="profile_info_name">${obj[i].name}</div>
				<div class="profile_info_post">${obj[i].post}</div>
				<div class="profile_info_department">${obj[i].department}</div>
			</div>
		</div>
		
	  `;
	}
	block.innerHTML = notices;
  }