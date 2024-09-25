const transaction=require("../model/transactionmodel")

const axios = require('axios');

const Intialize=async(req,res)=>{
    try{
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await transaction.insertMany(transactions);
        res.status(200).json({ message: 'Database initialized successfully!' });

    }
    catch(error){
        res.status(500).json({ error: 'Error initializing database.' });
    }
}

const Transactions = async (req, res) => {
    const { page = 1, per_page = 10, search = '' } = req.query;
  
    let query = {};
  
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { price: { $eq: parseFloat(search) } }
        ]
      };
    }
  
    try {
      const transactions = await transaction.find(query)
        .skip((page - 1) * per_page)
        .limit(per_page);
        console.log(transactions)
      const totalTransactions = await transaction.countDocuments(query);
  
      if (!transactions) {
        return res.status(404).json({ error: 'No matching transaction found.' });
      }
  
      res.status(200).json({
        transactions,
        pagination: {
          page,
          per_page,
          total: totalTransactions
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error fetching transaction.' });
    }
  }

// Fetch the data from MongoDB
const fetchData = async () => {
  try {
    const data = await transaction.find().exec();
    return data;
  } catch (error) {
    console.log(error);
  }
};
// Use the fetched data in your monthTotal function
const monthTotal = async (req, res) => {
  try {
    const data = await fetchData();
    const month = req.query.month;
    const year = req.query.year;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    let totalSaleAmount = 0;
    let totalSoldItems = 0;
    let totalNotSoldItems = 0;

    data.forEach(item => {
      const dateOfSale = new Date(item.dateOfSale);
      if (dateOfSale.getFullYear() === parseInt(year) && dateOfSale.getMonth() + 1 === parseInt(month)) {
        if (item.sold) {
          totalSaleAmount += item.price;
          totalSoldItems++;
        } else {
          totalNotSoldItems++;
        }
      }
    })

    res.json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error in total counting' });
  }
}


const barChart = async (req, res) => {
  try {
    const data = await fetchData();
    const month = req.query.month;

    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }

    const priceRanges = [
      { range: '0-100', count: 0 },
      { range: '101-200', count: 0 },
      { range: '201-300', count: 0 },
      { range: '301-400', count: 0 },
      { range: '401-500', count: 0 },
      { range: '501-600', count: 0 },
      { range: '601-700', count: 0 },
      { range: '701-800', count: 0 },
      { range: '801-900', count: 0 },
      { range: '901-above', count: 0 }
    ];

    data.forEach(item => {
      const dateOfSale = new Date(item.dateOfSale);
      if (dateOfSale.getMonth() + 1 === parseInt(month)) {
        const price = item.price;
        if (price <= 100) {
          priceRanges[0].count++;
        } else if (price <= 200) {
          priceRanges[1].count++;
        } else if (price <= 300) {
          priceRanges[2].count++;
        } else if (price <= 400) {
          priceRanges[3].count++;
        } else if (price <= 500) {
          priceRanges[4].count++;
        } else if (price <= 600) {
          priceRanges[5].count++;
        } else if (price <= 700) {
          priceRanges[6].count++;
        } else if (price <= 800) {
          priceRanges[7].count++;
        } else if (price <= 900) {
          priceRanges[8].count++;
        } else {
          priceRanges[9].count++;
        }
      }
    });

    res.json({ priceRanges });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error in bar chart data' });
  }
};

const pieChart = async (req, res) => {
  try {
    const data = await fetchData();
    const month = req.query.month;

    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }

    const categories = {};

    data.forEach(item => {
      const dateOfSale = new Date(item.dateOfSale);
      if (dateOfSale.getMonth() + 1 === parseInt(month)) {
        const category = item.category;
        if (!categories[category]) {
          categories[category] = 0;
        }
        categories[category]++;
      }
    });

    const categoriesArray = Object.keys(categories).map(category => ({
      category,
      count: categories[category]
    }));

    res.json({ categories: categoriesArray });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error in pie chart data' });
  }
};

module.exports={Intialize,Transactions,monthTotal,barChart,pieChart};