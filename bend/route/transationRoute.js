let express=require("express")
const {Intialize,Transactions, monthTotal, barChart, pieChart} = require("../controller/TransactionController")

let route=new express.Router()

route.get('/init',Intialize)

route.get('/transactions',Transactions)

route.get('/month-total',monthTotal)

route.get('/bar-chart',barChart)

route.get('/pie-chart',pieChart)

module.exports=route