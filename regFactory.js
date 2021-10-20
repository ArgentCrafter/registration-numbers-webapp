module.exports = function regFactory(pool) {
    async function addRegToDB(registration) {
        await pool.query('INSERT INTO registration(registration_number) VALUES ($1)', [registration]);
    }

    async function selectAllReg() {
        return pool.query('SELECT * FROM registration');
    }

    async function reset() {
        await pool.query('TRUNCATE TABLE registration');
    }

    async function filterRegList(list) {
        const regList = [];
        for (let i = 0; i < list.length; i += 1) {
            regList.push(list[i].registration_number);
        }

        return regList;
    }

    async function filterRegListWithNum(list, num) {
        const regList = [];
        for (let i = 0; i < list.length; i += 1) {
            const currItem = list[i];
            if (currItem.registration_number.startsWith(num)) {
                regList.push(currItem.registration_number);
            }
        }

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
    };
};
