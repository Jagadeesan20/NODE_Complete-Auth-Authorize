"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "roles",
      [
        {
          role_type: "ADMIN",
        },
        {
          role_type: "MANAGER",
        },
        {
          role_type: "SUPPLIER",
        },
        {
          role_type: "DELIVERY_BOY",
        },
        {
          role_type: "CUSTOMER",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
