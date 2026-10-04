// let numbers= [10,20,30,40,50];
// function calculateSum(arr){
//     let sum=0;
//     for (let i=0;i< arr.length;i++){
//         sum += arr[i];

//     }return sum;
// }
//     let result = calculateSum(numbers);
//     console.log (result);

const users = [
  {
    userId: 1,
    orders: [
      { id: 101, status: "delivered", amount: 150 },
      { id: 102, status: "pending", amount: 50 }
    ]
  },
  {
    userId: 2,
    orders: [
      { id: 201, status: "cancelled", amount: 30 }
    ]
  },
  {
    userId: 3,
    orders: [
      { id: 301, status: "delivered", amount: 200 },
      { id: 302, status: "delivered", amount: 100 }
    ]
  }
];

const result = users
  .filter(user => user.orders.some(order => order.status === "delivered"))
  .map(user => {
    const deliveredOrders = user.orders.filter(order => order.status === "delivered");
    return {
      userId: user.userId,
      deliveredOrders: deliveredOrders.length,
      totalDeliveredValue: deliveredOrders.reduce((sum, order) => sum + order.amount, 0)
    };
  });

console.log(result);
