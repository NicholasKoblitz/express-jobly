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

    static async findAll(filters) {
        const {title, minSalary, hasEquity} = filters;

        if(!title && !minSalary && !hasEquity) {
            const results = await db.query(
                `SELECT id, title, salary, equity, company_handle AS "companyHandle"
                FROM jobs
                ORDER BY title`
            );
            return results.rows;
        }
        else if(title && minSalary && hasEquity) {
            const results = await db.query(
                `SELECT id, title, salary, equity, company_handle AS "companyHandle"
                FROM jobs
                WHERE title ILIKE '%'||$1||'%' AND salary >= $2 AND NOT equity=0`,
                [title, minSalary] 
            )
            return results.rows;
        }
        else if(title && minSalary) {
            const results = await db.query(
                `SELECT id, title, salary, equity, company_handle AS "companyHandle"
                FROM jobs
                WHERE title ILIKE '%'||$1||'%' AND salary >= $2`,
                [title, minSalary] 
            )
            return results.rows;
        }
        else if(title && hasEquity) {
            const results = await db.query(
                `SELECT id, title, salary, equity, company_handle AS "companyHandle"
                FROM jobs
                WHERE title ILIKE '%'||$1||'%' AND NOT equity=0`,
                [title] 
            )
            return results.rows;
        }
        else if(minSalary && hasEquity) {
            const results = await db.query(
                `SELECT id, title, salary, equity, company_handle AS "companyHandle"
                FROM jobs
                WHERE salary >= $1 AND NOT equity=0`,
                [minSalary] 
            )
            return results.rows;
        }
        else if(title) {
            const results = await db.query(
                `SELECT id, title, salary, equity, company_handle AS "companyHandle"
                FROM jobs
                WHERE title ILIKE '%'||$1||'%'`,
                [title] 
            )
            return results.rows;
        }
        else if(minSalary) {
            const results = await db.query(
                `SELECT id, title, salary, equity, company_handle AS "companyHandle"
                FROM jobs
                WHERE salary >= $1`,
                [minSalary] 
            )
            return results.rows;
        }
        else if(hasEquity) {
            const results = await db.query(
                `SELECT id, title, salary, equity, company_handle AS "companyHandle"
                FROM jobs
                WHERE NOT equity=0`
            )
            return results.rows;
        }

        

        
    }

    static async get(id) {
        const result = await db.query(
            `SELECT id, title, salary, equity, company_handle AS "companyHandle"
            FROM jobs
            WHERE id = $1`,
            [id]
        );
        
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