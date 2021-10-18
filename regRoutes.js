module.exports = function regRoutes(pool, factory) {
    function root(req, res) {
        res.redirect('/reg_numbers');
    }

    async function regNumbers(req, res) {
        const regEx = /(^[a-z]{2}\s\d{5}$)|(^[a-z]{2}\s\d{3}-\d{2}$)/i;

        if (req.query.addRegistration) {
            if (regEx.test(req.query.addRegistration)) {
                if (!await factory.checkForExisting(req.query.addRegistration.toUpperCase())) {
                    await factory.addRegToDB(req.query.addRegistration.toUpperCase());
                }
                const regList = await factory.filterRegList(await (await factory.selectAllReg()).rows);
                res.render('index', { regList });
            } else {
                const regList = await factory.filterRegList(await (await factory.selectAllReg()).rows);
                res.render('index', { regList, output: 'Please enter a valid registration number', class: 'red' });
            }
        } else {
            const regList = await factory.filterRegList(await (await factory.selectAllReg()).rows);
            res.render('index', { regList, output: 'Please enter a registration number' });
        }
    }

    async function regNumbersFilter(req, res) {
        const regEx = /(^[a-z]{2}\s\d{5}$)|(^[a-z]{2}\s\d{3}-\d{2}$)/i;

        if (req.query.addRegistration) {
            if (regEx.test(req.query.addRegistration)) {
                if (!await factory.checkForExisting(req.query.addRegistration.toUpperCase())) {
                    await factory.addRegToDB(req.query.addRegistration.toUpperCase());
                }
                const regList = await factory.filterRegList(await (await factory.selectAllReg()).rows);
                res.render('index', { regList });
            } else {
                const regList = await factory.filterRegList(await (await factory.selectAllReg()).rows);
                res.render('index', { regList, output: 'Please enter a valid registration number', class: 'red' });
            }
        } else {
            const regList = await factory.filterRegListWithNum(await (await factory.selectAllReg()).rows, req.params.number);
            console.log(regList);
            console.log(regList.length);
            if (regList.length > 0) {
                res.render('index', { regList });
            } else {
                res.render('index', { regList, output: 'No numbers found for that town', class: 'red' });
            }
        }
    }

    function reset(req, res) {
        factory.reset();
        res.redirect('/reg_numbers');
    }

    function show(req, res) {
        if (req.body.townFilter) {
            res.redirect('/reg_numbers/' + req.body.townFilter);
        } else {
            res.redirect('/reg_numbers');
        }
    }

    return {
        root,
        regNumbers,
        reset,
        show,
        regNumbersFilter,
    };
};
