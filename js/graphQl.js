const users = `
query{
    users{
     userId
     username
     contact
   } 
} `

const getOrder = `
query GET_ORDERS ($userId: ID) {
    orders(userId: $userId) {
      orderId,
      food{
        foodId
        foodName
        foodImg
      }
      count
    }
}`

const foods = `
query {
    foods {
      foodId,
          foodName
    }
  }`


const addUsers = `
mutation ADD_USERS ($username: String! $contact: String!){
    addUser (username: $username contact:$contact){
      status
      message
      data
    }
}`

const addOrders = `
mutation ADD_ORDERS($foodId:Int! $userId:Int! $count: Int!) {
    addOrder(foodId:$foodId userId:$userId count:$count){
      status
      message
      data
    }
  }`