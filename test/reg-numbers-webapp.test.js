const assert = require('assert');
const { Pool } = require('pg');
const Factory = require('../regFactory');

const connectionString = 'postgres://muzzaujaysjazq:69196cbdb92a6efe12591b4da277cf9e2f185639fac870a60509cb6db5bfe4e4@ec2-34-249-247-7.eu-west-1.compute.amazonaws.com:5432/ded39ads80c6bl';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

const factory = Factory(pool);

describe('Tests:', () => {
    describe('Database tests:', () => {
        beforeEach(async () => {
            await factory.reset();
        });

        it('Should be able to insert a new entry with addRegToDB function', async () => {
            await factory.addRegToDB('CY 12345');
            assert.equal(await (await pool.query('SELECT * FROM registration')).rowCount, 1);
        });

        after(async () => {
            await factory.reset();
        });
    });

    describe('Factory Function tests:', () => {
        it('checkForExisting function should find existing entry for registration "CY 12345"', async () => {
            await factory.addRegToDB('CY 12345');
            assert.equal(await factory.checkForExisting('CY 12345'), true);
        });

        it('checkForExisting function should not find an existing entry for registration "CA 54321"', async () => {
            assert.equal(await factory.checkForExisting('CA 54321'), false);
        });

        it('filterRegList function should only display CY reg numbers', async () => {
            await factory.addRegToDB('CA 54321');
            await factory.addRegToDB('CK 12543');

            const list = await factory.selectAllReg();
            assert.deepEqual(await factory.filterRegListWithNum(list.rows, 'CY'), ['CY 12345']);
        });

        it('filterRegList function should only display CA reg numbers', async () => {
            const list = await factory.selectAllReg();
            assert.deepEqual(await factory.filterRegListWithNum(list.rows, 'CA'), ['CA 54321']);
        });

        it('filterRegList function should only display CK reg numbers', async () => {
            const list = await factory.selectAllReg();
            assert.deepEqual(await factory.filterRegListWithNum(list.rows, 'CK'), ['CK 12543']);
        });

        it('filterRegList should return registration numbers "CY 12345", "CA 54321" and "CK 12543"', async () => {
            const list = await factory.selectAllReg();
            assert.deepEqual(await factory.filterRegList(list.rows), ['CY 12345', 'CA 54321', 'CK 12543']);
        });
    });
});
after(() => {
    pool.end();
});
