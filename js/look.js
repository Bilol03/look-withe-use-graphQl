const hostName = 'http://localhost:4000/graphql'
const customersList = document.querySelector('.customers-list')
const ordersList = document.querySelector('.orders-list')
const clientId = document.querySelector('#clientId')
const userHeader = document.querySelector('#userHeader')
const userAddForm = document.querySelector('#userAdd')
const inputName = document.querySelector('#usernameInput')
const inputPhone = document.querySelector('#telephoneInput')
const foodsSelect = document.querySelector('#foodsSelect')
const foodsCount = document.querySelector('#foodsCount')
const foodsForm = document.querySelector('#foodsForm')


function createElements (...array) {
	return array.map( el => {
		return document.createElement(el)
	} )
}

async function renderUsers () {
	async function request(query) {
		let response = await fetch(hostName, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query
			})
		})
	
		return await response.json()
	}
	
	async function getUsers(){
		let result = await request(users)
		customersList.innerHTML = null
		for(let user of result.data.users) {
			const [li, span, a] = createElements('li', 'span', 'a')
			
			li.className = 'customer-item'
			span.className = 'customer-name'
			a.className = 'customer-phone'
	
			span.textContent = user.username
			a.textContent = '+' + user.contact
	
			a.setAttribute('href', 'tel:+' + user.contact)
	
			li.append(span, a)
			customersList.append(li)
	
			li.onclick = () => {
				renderOrders({userId: user.userId})
				clientId.textContent = user.userId
				userHeader.textContent = user.username
			}
		}
	}
	getUsers()

	
}


async function renderOrders (variables) {
	
	async function request(query) {
		let response = await fetch(hostName, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query,
				variables
			})
		})
	
		return await response.json()
	}

	async function getOrders(){
		let result = await request(getOrder)
		result = result? result: []
		ordersList.innerHTML = null

		for(let order of result.data.orders) {
			const [li, img, div, foodName, foodCount] = createElements('li', 'img', 'div', 'span', 'span')
			
			li.className = 'order-item'
			foodName.className = 'order-name'
			foodCount.className = 'order-count'

			img.src = "http://localhost:4000" + order.food.foodImg.replace('./', '/')

			foodName.textContent = order.food.foodName
			foodCount.textContent = order.count

			div.append(foodName, foodCount)
			li.append(img, div)
			ordersList.append(li)
		}

	}
	getOrders()

	

}


async function renderFoods () {

	async function request(query) {
		let response = await fetch(hostName, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query
			})
		})
	
		return await response.json()
	}

	async function getFoods(){
		let result = await request(foods)
		for (let food of result.data.foods){
				let [option] = createElements('option')
		
				option.value = food.foodId
				option.textContent = food.foodName
				renderOrders()
				foodsSelect.append(option)	
		}

		

	}
	getFoods()
	
	

}
renderFoods()





userAddForm.onsubmit = async event => {
	event.preventDefault()

	if(!inputName.value || !inputPhone.value) return

	async function request(query, variables = {}) {
		variables = {
			username: inputName.value,
			contact: inputPhone.value
		}
		console.log(variables)
		let response = await fetch(hostName, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query,
				variables
			})
		})
		inputName.value = null
		inputPhone.value = null

		return await response.json()
	}


	async function addUser(){
		let result = await request(addUsers)
		console.log(result)
		
		// renderUsers()
	}
	addUser()
	

}


renderFoods()



foodsForm.onsubmit = async event => {
	event.preventDefault()
	async function request(query, variables) {
		variables = {
			foodId: +foodsSelect.value,
			userId: +clientId.textContent,
			count: +foodsCount.value
		}
		let response = await fetch(hostName, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query,
				variables
			})
		})
		

		return await response.json()
	}

	async function addOrder(){
		let result = await request(addOrders)
		
		renderOrders({userId:clientId.textContent})

		foodsSelect.value = 1
		foodsCount.value = null
	}
	addOrder()


}
renderFoods()
renderUsers()