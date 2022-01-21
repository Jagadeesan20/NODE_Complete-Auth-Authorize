const QueryGenerator = require("../generators/query.generator");
// const QueryGenerator=require('../genertors/query.generator')
// const { query } = require("../utils/database")
const database = require("../utils/database");

const userModel = {
  async addUser({
    role_id,
    first_name,
    last_name,
    phone_no,
    user_email,
    password,
  }) {
    let query = QueryGenerator.insert("user", {
      role_id,
      first_name,
      last_name,
      phone_no,
      user_email,
      password,
    });
    return await database.promise().query(query);
  },
  async getMembers() {
    console.log("success");
    return await database
      .promise()
      .query("select * from user ORDER BY first_name");
  },
  //   async getUserById(id) {
  //     return await database.promise().query(`select * from user where id=${id}`);
  //   },
  //   async updateUserById(
  //     id,
  //     {
  //       name,
  //       age,
  //       phone_no,
  //       email,
  //       profile_img,
  //       user_name,
  //       password,
  //       blood_group,
  //       address,
  //     }
  //   ) {
  //     let query = QueryGenerator.update(
  //       "user",
  //       {
  //         name,
  //         age,
  //         phone_no,
  //         email,
  //         profile_img,
  //         user_name,
  //         password,
  //         blood_group,
  //         address,
  //       },
  //       { id: id }
  //     );
  //     return await database.promise().query(query);
  //   },
  //   async deleteUserById(id) {
  //     console.log(id);
  //     return await database.promise().query(`delete from user where id=${id}`);
  //   },
  async findUser({ user_email, password }) {
    return await database
      .promise()
      .query(
        `select * from user where user_email='${user_email}' AND password='${password}'`
      );
  },
  // async userFilterByName(user_name){
  //     console.log('Model Testing');
  //     console.log("NAME----->",user_name)
  //     return await database.promise().query(`select * from user where name like '${user_name}%'`)
  // }
};

module.exports = userModel;
