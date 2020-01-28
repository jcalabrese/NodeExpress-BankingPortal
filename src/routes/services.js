const express = require('express');
const router = express.Router();
const { accounts,  writeJSON } = require('../data.js');



router.get('/transfer', (req,res) => {
  res.render('transfer');
});

router.post('/transfer', (req,res) => {
  let from = req.body.from,
      to = req.body.to,
      amount = parseInt(req.body.amount);
  accounts[from].balance -= amount;
  accounts[to].balance += amount;
  writeJSON();
  res.render('transfer',{message: 'Transfer Completed'});
});

router.get('/payment', (req,res) => {
  res.render('payment', { account: accounts.credit});
});

router.post('/payment', (req,res) => {
  let amount = parseInt(req.body.amount);
  accounts.credit.balance -= amount;
  accounts.credit.available += amount;
  writeJSON();
  res.render('payment', {message: 'Payment Saccessfull', account : accounts.credit});
});

module.exports = router;
