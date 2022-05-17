"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


class Job {


    static async create({title, salary, equity, companyHandle}) {
      const result = await db.query(
          `INSERT INTO jobs
          (title, salary, equity, company_handle)
          VALUES ($1, $2, $3, $4)
          RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
          [title, salary, equity, companyHandle]
      );
      const job = result.rows[0];

      return job;
    }

    static async findAll() {
        const results = await db.query(
            `SELECT id, title, salary, equity, company_handle AS "companyHandle"
            FROM jobs
            ORDER BY title`
        );

        return results.rows;
    }

    static async get(id) {
        const result = await db.query(
            `SELECT title, salary, equity, company_handle AS "companyHandle"
            FROM jobs
            WHERE id=$1`,
            [id]
        )
        
        return result.rows[0];
    }

    static async update(id, data) {
        const {setCols, values} = sqlForPartialUpdate(
            data, 
            {
                companyHandle: "company_handle"
            });
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE jobs
                            SET ${setCols}
                            WHERE id=${idVarIdx}
                            RETURNING id,
                                      title,
                                      salary,
                                      equity,
                                      company_handle AS
                                      "companyHandle"`;
        const results = await db.query(querySql, [...values, id]);
        const job = results.rows[0];

        if(!job) throw new NotFoundError(`No Job with id: ${id}`);

        return job;
    }

    static async remove(id) {
        const result = await db.query(
        `DELETE
        FROM jobs
        WHERE id=$1
        RETURNING title`,
        [id]);

        const job = result.rows[0]

        if (!job) throw new NotFoundError(`No job with id: ${id}`);
    }

}


module.exports = Job;