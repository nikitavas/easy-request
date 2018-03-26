import 'reflect-metadata';
import * as chai from 'chai';
import { request, expect } from 'chai';
import { bearerToken } from '../token';
import * as server from '../../app/bootstrap';
// import * as chaiHttp from 'chai-http';
const chaiHttp = require('chai-http');
import { container } from '../../app/config/ioc-config';

chai.should();
chai.use(chaiHttp);

describe('Values', () => {
    describe('/GET Values', () => {
        it('it should Sum 2 values', (done) => {
            request(server).get('/api/values')
                .query({ val1: 1, val2: 2 })
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.be.an.instanceof(Object);
                    expect(res.body.sum).to.be.equals(3);
                    done();
                });
        });
    });
    describe('/POST Values', () => {
        it('it should return 201', (done) => {
            request(server).post('/api/values/ae0a4c38-5be6-4504-909d-85eb3221af17')
                .set('Authorization', bearerToken)
                .send({ id: 'ae0a4c38-5be6-4504-909d-85eb3221af17', msg: 'hi test' })
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
    });
});
