const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port= 3000;

app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));

const accountData = fs.readFileSync(path.join(__dirname,'/json/accounts.json'),'utf8', (err, data) => {
     if ( err) throw err;
     return data;
 });
 const accounts = JSON.parse(accountData);
 const userData = fs.readFileSync(path.join(__dirname,'/json/users.json'), 'utf8', (err,data)=> {
   if (err) throw err;
   return data;
 });
 const users = JSON.parse(userData);

app.get('/',(req,res) =>
 {
   res.render('index', {
     title: 'Account Summary',
     accounts: accounts});
 });

app.get('/savings', (req,res)=> {
  res.render('account', {account: accounts.savings});
});
app.get('/checking', (req,res)=> {
  res.render('account', {account: accounts.checking});
});
app.get('/credit', (req,res)=> {
  res.render('account', {account: accounts.credit});
});

app.get('/profile', (req,res) => {
  res.render('profile', {user:users[0]});
});

app.get('/transfer', (req,res) => {
  res.render('transfer');
});

app.post('/transfer', (req,res) => {
  let from = req.body.from,
      to = req.body.to,
      amount = parseInt(req.body.amount);
  accounts[from].balance -= amount;
  accounts[to].balance += amount;
  const accountsJSON = JSON.stringify(accounts);

  fs.writeFileSync(path.join(__dirname,'/json/accounts.json'),accountsJSON, 'utf8');

  res.render('transfer',{message: 'Transfer Completed'});
});

app.get('/payment', (req,res) => {
  res.render('payment', { account: accounts.credit});
});

app.post('/payment', (req,res) => {
  let amount = parseInt(req.body.amount);
  console.log(`amount ${amount}`);
  console.log(`credit balance ${accounts.credit.balance}`);
  accounts.credit.balance -= amount;
  console.log(`credit balance ${accounts.credit.balance}`);
  console.log(`credit balance ${accounts.credit.available}`);
  accounts.credit.available += amount;
  console.log(`credit balance ${accounts.credit.available}`);
  const accountsJSON = JSON.stringify(accounts);

  fs.writeFileSync(path.join(__dirname,'/json/accounts.json'),accountsJSON,'utf8');

  res.render('payment', {message: 'Payment Saccessfull', account : accounts.credit});


});

app.listen(port,()=> console.log(`PS Project Running on port ${port}!`));
