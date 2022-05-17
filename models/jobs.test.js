"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./jobs.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);



/************************************** create */

describe("create", () => {
    test("works", async () => {
        const newJob = {
            title: "new",
            salary: 10,
            equity: "0",
            companyHandle: 'c1'
        };
        const job = await Job.create(newJob);
        expect(job).toEqual({id: expect.any(Number), ...newJob})
    })
})

/************************************** findAll */


describe("findAll", () => {
    test("works", async () => {
        const jobs = await Job.findAll();
        expect(jobs).toEqual([
            {
                id: expect.any(Number),
                title: "j1",
                salary: 10,
                equity: null,
                companyHandle: 'c1'
            },
            {
                id: expect.any(Number),
                title: "j2",
                salary: 10,
                equity: "0.3",
                companyHandle: 'c2'
            },
            {
                id: expect.any(Number),
                title: "j3",
                salary: 10,
                equity: "0",
                companyHandle: 'c3'
            }
        ])
    })
})

/************************************** get */

describe("get", () => {
    const newJob = {
        title: "new",
        salary: 10,
        equity: "0",
        companyHandle: 'c1'
    };
    test("works", async () => {
        const testJob = await Job.create(newJob);
        const job = await Job.get(testJob.id)
        expect(job).toEqual(newJob)
    })
})

/************************************** update */

describe("update", () => {
    const newJob = {
        title: "new",
        salary: 10,
        equity: "0",
        companyHandle: 'c1'
    };
    const updateData = {
        title: "Test",
        salary: 2,
        equity: "0.4"
    };
    test("works", async () => {
        const testJob = await Job.create(newJob);
        const job = await Job.update(testJob.id, updateData)
        expect(job).toEqual({
            id: testJob.id, 
            ...updateData, 
            companyHandle: testJob.companyHandle
        });
    })
    test("throw error", async () => {
        try {
            await Job.update(10000, updateData);
            fail();
        }
        catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

/************************************** remove */

describe("remove", () => {
    const newJob = {
        title: "new",
        salary: 10,
        equity: "0",
        companyHandle: 'c1'
    };
    test("works", async () => {
        const testJob = await Job.create(newJob);
        const deleted = await Job.remove(testJob.id);
        const res = await db.query(`SELECT title FROM jobs WHERE id=$1`, [testJob.id]);
        expect(res.rows.length).toEqual(0);
    })
    test("throw Error", async () => {
        try {
            await Job.remove(10000),
            fail();
        }
        catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})