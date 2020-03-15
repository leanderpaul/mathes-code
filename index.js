const mysql = require('mysql');
const faker = require('faker');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'test-user',
  password: 'password',
  database: 'dummyDB'
});

connection.connect();

const hospitalCount = 100;
const userCount = 100;
let phoneNumber = 9000000000;
const surgeries = ['Heart', 'Liver', 'Brain'];
const locations = require('./locations.json');

connection.query(
  'create table all_users(user_id varchar(30), hospital_id varchar(30), surgery_part varchar(30), success varchar(5), cost int(10), user_rating int(1), contact double)'
);

connection.query(
  'create table all_hospitals(hospital_id varchar(30), hospital_name varchar(50), contact double, town varchar(30), district varchar(30), state varchar(30), latitude double, longitude double)'
);

const insertHospital = 'insert into all_hospitals values(?,?,?,?,?,?,?,?);';
const insertUser = 'insert into all_users values(?,?,?,?,?,?,?)';

async function generateHospital() {
  for (let i = 0; i < hospitalCount; i++) {
    let insertArray = [];
    const hospitalID = i;
    insertArray.push(hospitalID);
    const hospitalName = faker.company.companyName();
    insertArray.push(hospitalName);
    insertArray.push(phoneNumber++);
    const town = faker.address.streetName();
    insertArray.push(town);
    const location = faker.random.arrayElement(locations);
    const pos = faker.random.number(1000) / 500;
    const neg = faker.random.number(1000) / 500;
    const district = location.district;
    insertArray.push(district);
    const state = 'Tamil Nadu';
    insertArray.push(state);
    const latitude = location.lat + pos - neg;
    insertArray.push(latitude);
    const longitude = location.long - pos + neg;
    insertArray.push(longitude);
    connection.query(insertHospital, insertArray);
  }
  generateUser();
}

async function generateUser() {
  for (let i = 0; i < userCount; i++) {
    let insertArray = [];
    const userID = i;
    insertArray.push(userID);
    const hospitalID = faker.random.number(hospitalCount);
    insertArray.push(hospitalID);
    const surgery = faker.random.arrayElement(surgeries);
    insertArray.push(surgery);
    const success = faker.random.boolean() ? 'yes' : 'no';
    insertArray.push(success);
    const cost = faker.random.number(100000);
    insertArray.push(cost);
    const userRating = faker.random.number(5);
    insertArray.push(userRating);
    const contact = phoneNumber++;
    insertArray.push(phoneNumber);
    connection.query(insertUser, insertArray);
  }
}

generateHospital();
