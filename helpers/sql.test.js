const { BadRequestError } = require("../expressError");
const {sqlForPartialUpdate} = require("./sql");


describe("sqlForPartialUpdate", () => {
    test('works: returns sql data', () => {
        const sqlData = sqlForPartialUpdate({
            "first_name": "test",
            "last_name": "tester"
        },
        {
            firstName: "first_name",
            lastName: "last_name",
            isAdmin: "is_admin",
          })
        expect(sqlData).toEqual({
            setCols: "\"first_name\"=$1, \"last_name\"=$2",
            values: ["test", "tester"]
        }) 
    })
    test("Returns error", () => {
        expect( () => {
            sqlForPartialUpdate({},
                {
                    firstName: "first_name",
                    lastName: "last_name",
                    isAdmin: "is_admin",
                  })
        }).toThrow()
    })
})