module.exports = function regFactory(pool) {
    async function addRegToDB(registration) {
        const townCodeID = await (await pool.query('SELECT id FROM towns WHERE town_code=$1', [registration.slice(0, 2)])).rows[0].id;
        await pool.query('INSERT INTO registration(registration_number, town_code_id) VALUES ($1, $2)', [registration, townCodeID]);
    }

    async function selectAllReg() {
        return pool.query('SELECT * FROM registration');
    }

    async function reset() {
        await pool.query('TRUNCATE TABLE registration');
    }

    async function isValidID(input) {
        const regNum = input.toUpperCase();
        if ((regNum.startsWith('CA')) || (regNum.startsWith('CY')) || (regNum.startsWith('CK'))) {
            return true;
        }
        return false;
    }

    async function filterRegList() {
        const regList = [];
        await (await pool.query('SELECT * FROM registration')).rows.forEach((item) => {
            regList.push(item.registration_number);
        });

        return regList;
    }

    async function filterRegListWithNum(num) {
        const regList = [];
        const townCodeID = await (await pool.query('SELECT id FROM towns WHERE town_code=$1', [num])).rows[0].id;
        await (await pool.query('SELECT * FROM registration WHERE town_code_id=$1', [townCodeID])).rows.forEach((item) => {
            regList.push(item.registration_number);
        });

        return regList;
    }

    async function checkForExisting(regNum) {
        if (await (await pool.query('SELECT * FROM registration WHERE registration_number=$1', [regNum])).rows[0]) {
            return true;
        }
        return false;
    }

    return {
        addRegToDB,
        selectAllReg,
        reset,
        filterRegList,
        filterRegListWithNum,
        checkForExisting,
        isValidID,
    };
};
