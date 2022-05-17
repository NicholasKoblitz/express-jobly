"use strict";

const req = require("express/lib/request");
const request = require("supertest");

const app = require("../app");
const Job = require("../models/jobs");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);



/************************************** POST /jobs */

describe("POST /jobs", () => {
    const newJob = {
        title: "new",
        salary: 10,
        equity: "0",
        companyHandle: 'c1'
    };

    test("ok for admins", async () => {
        const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            job: {
                id: expect.any(Number),
                ...newJob
            }
        })
    })
    test("Bad request with missing data", async () => {
        const resp = await request(app)
        .post("/jobs")
        .send({title: "new"})
        .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toBe(400);
    })
    test("Bad request with invalid data", async () => {
        const resp = await request(app)
        .post("/jobs")
        .send({...newJob, title: 1})
        .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toBe(400);
    })
})


/************************************** GET /companies */

describe("GET /jobs", () => {
    test("works", async () => {
        const resp = await request(app).get("/jobs");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(
            { jobs:
                [
                    {
                        id: expect.any(Number),
                        title: "new",
                        salary: 10,
                        equity: null,
                        companyHandle: 'c1'
                    },
                    {
                        id: expect.any(Number),
                        title: "new",
                        salary: 10,
                        equity: "0.3",
                        companyHandle: 'c2'
                    },
                    {
                        id: expect.any(Number),
                        title: "new",
                        salary: 10,
                        equity: "0",
                        companyHandle: 'c3'
                    }
        ]})
    })
})

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", () => {
    const newJob = {
        title: "new",
        salary: 10,
        equity: "0",
        companyHandle: 'c1'
    };
    test("works", async () => {
        const testJob = await Job.create(newJob)
        const resp = await request(app).get(`/jobs/${testJob.id}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            job: {
                id: testJob.id,
                title: "new",
                salary: 10,
                equity: "0",
                companyHandle: 'c1'
            }
        })
    })
    
})



/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", () => {
    const newJob = {
        title: "new",
        salary: 10,
        equity: "0",
        companyHandle: 'c1'
    };
    test("works", async () => {
        const testJob = await Job.create(newJob)
        const resp = await request(app)
        .patch(`/jobs/${testJob.id}`)
        .send({
            title: "Tester"
        })
        .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            job: {
                id: testJob.id,
                title: "Tester",
                salary: 10,
                equity: "0",
                companyHandle: "c1"
            }
        })
    })
    test("Not found error", async () => {
        const resp = await request(app)
        .patch("/jobs/1")
        .send({title: "BAD"})
        .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(404);
    })

})

/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", () => {
    const newJob = {
        title: "new",
        salary: 10,
        equity: "0",
        companyHandle: 'c1'
    };
    test("works", async () => {
        const testJob = await Job.create(newJob)
        const resp = await request(app)
        .delete(`/jobs/${testJob.id}`)
        .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({deleted: String(testJob.id)})
    })
    test("unauthorized Error", async () => {
        const testJob = await Job.create(newJob)
        const resp = await request(app)
        .delete(`/jobs/${testJob.id}`)
        expect(resp.statusCode).toEqual(401);
    })
})