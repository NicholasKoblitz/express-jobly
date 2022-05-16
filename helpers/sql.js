const { BadRequestError } = require("../expressError");

/*
 * Takes data to be updated and table columns to be changed to sql format
 * and returns an object conatining the information 
 * 
 *    {"first_name": "example", "last_name": "EX"}, 
 *         {firstName: "first_name", lastName: "last_name", isAdmin: "is_admin",} =>
 *    {
 *      setCols: "first_name=$1, last_name=$2",
 *      values: ["example", "EX"]
 *    }
*/

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
