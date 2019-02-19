const moment = require('moment');
const uuidv4 = require('uuid/v4');
const db = require('../db');

class urls_controller {
  static async create( url ) {

    const text = `INSERT INTO 
      urls (id, url, created_date, modified_date)
      VALUES ($1, $2, $3, $4)
      returning *`;

    const values = [
      uuidv4(),
      url,
      moment(new Date()),
      moment(new Date())
    ];

    await db.query(text, values);
    
  }

  static async exist( url ) {

    const text = `SELECT EXISTS( SELECT 1 FROM urls WHERE url= $1 )`;

    const values = [
      url,
    ];
    
    const res = await db.query(text, values);
    return res.rows[0].exists
    
  }
}

module.exports = urls_controller;