const express = require('express');
const { customerWithSearch, getByIdCustomer, UniqueCityAndCustomerCount, createCustomer } = require('../contoller/customer');
const router = express.Router();

router.get('/customers',customerWithSearch);
router.get('/customers/:id',getByIdCustomer);
router.get('/customers/cities/count',UniqueCityAndCustomerCount);
router.post('/customers',createCustomer);


module.exports = router;