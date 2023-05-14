function fill_personal_info() {
	let htmlText = "";
	const parentEl = document.getElementById("person_info_");
	// get Json

	const obj = {
		"name": "Александр",
		"surname": "Семакин",
		"email": "bakyt.worker@gmail.com",
		"post": "Генеральный директор",
		"patronymic": "Александрович",
		"birth_date": "2000-09-27",
		"gender": true,
		"summary": "https://clck.ru/F4Xfk",
		"phone": "+7(917)-465-20-17",
		"city": "Томск",
		"employment_date": "2023-05-12",
		"telegram": "AlexSemakin",
		"notification_lang": "Русский",
		"about": "Также как семантический разбор внешних противодействий позволяет оценить значение своевременного выполнения сверхзадачи. Для современного мира разбавленное изрядной долей эмпатии, рациональное мышление, в своём классическом представлении, допускает внедрение поэтапного и последовательного развития общества. В рамках спецификации современных стандартов, ключевые особенности структуры проекта, превозмогая сложившуюся непростую экономическую ситуацию, функционально разнесены на независимые элементы."
	}

	const fieldArr = ["name", "surname", "patronymic", "email",
		"birth_date", "gender", "phone", "city", "telegram", "notification_lang"];
	const fieldArrRus = ["Имя", "Фамилия", "Отчество", "Почта",
		"Дата рождения", "Пол", "Телефон", "Город", "Телеграм", "Язык уведолении"];

	for (let i = 0; i < fieldArr.length; i++) {
		htmlText += `
		<div id="person_data" class="person_input_flex">
			<div class="person_data_">
				<label for="_${fieldArr[i]}" class="">${fieldArrRus[i]}</label>
				<input readonly class="person_data_read _switch" id="_${fieldArr[i]}" name="__${fieldArr[i]}" type="text" value="${obj[fieldArr[i]]}" autocomplete="off">
			</div>
		</div>
	`
	}
	parentEl.innerHTML = htmlText;
}

let is_read = true;
function swith_mode() {
	const inputArr = document.querySelectorAll("._switch");
	if(is_read) {
		inputArr.forEach(el => {
			el.classList.remove("person_data_read");
			el.classList.add("person_data_write");
			el.removeAttribute("readonly");
			is_read = false;
		});
	} else {
		inputArr.forEach(el => {
			el.classList.remove("person_data_write");
			el.classList.add("person_data_read");
			el.setAttribute("readonly", true);
			is_read = true;
		});
	}
}









