module.exports = function regRoutes(pool, factory) {
    function root(req, res) {
        res.redirect('/reg_numbers');
    }

    async function regNumbers(req, res) {
        const regEx = /(^[a-z]{2}\s\d{5}$)|(^[a-z]{2}\s\d{3}-\d{2}$)/i;
        const regNum = req.query.addRegistration;

        if (regNum) {
            if (regEx.test(regNum)) {
                if (await factory.isValidID(regNum)) {
                    if (!await factory.checkForExisting(regNum.toUpperCase())) {
                        await factory.addRegToDB(regNum.toUpperCase());

                        const regList = await factory.filterRegList();
                        res.render('index', { regList, output: 'Registration number successfully added!', class: 'green' });
                    } else {
                        const regList = await factory.filterRegList();
                        res.render('index', { regList, output: 'This Registration Number has already been entered', class: 'red' });
                    }
                } else {
                    const regList = await factory.filterRegList();
                    res.render('index', { regList, output: 'That Registration Number ID does not belong to a Town', class: 'red' });
                }
            } else {
                const regList = await factory.filterRegList();
                res.render('index', { regList, output: 'Please enter a valid registration number', class: 'red' });
            }
        } else {
            const regList = await factory.filterRegList();
            const flash = req.flash('output');
            if (!flash[0]) {
                const err = req.flash('err');
                if (!err[0]) {
                    res.render('index', { regList, output: 'Please enter a registration number' });
                } else {
                    res.render('index', { regList, output: err, class: 'red' });
                }
            } else {
                res.render('index', { regList, output: flash, class: 'green' });
            }
        }
    }

    async function regNumbersFilter(req, res) {
        const regEx = /(^[a-z]{2}\s\d{5}$)|(^[a-z]{2}\s\d{3}-\d{2}$)/i;
        const regNum = req.query.addRegistration;

        if (regNum) {
            if (regEx.test(regNum)) {
                if (await factory.isValidID(regNum)) {
                    if (!await factory.checkForExisting(regNum.toUpperCase())) {
                        await factory.addRegToDB(regNum.toUpperCase());

                        const regList = await factory.filterRegList();
                        res.render('index', { regList, output: 'Registration number successfully added!', class: 'green' });
                    } else {
                        const regList = await factory.filterRegList();
                        res.render('index', { regList, output: 'This Registration Number has already been entered', class: 'red' });
                    }
                } else {
                    const regList = await factory.filterRegList();
                    res.render('index', { regList, output: 'That Registration Number ID does not belong to a Town', class: 'red' });
                }
            } else {
                const regList = await factory.filterRegList();
                res.render('index', { regList, output: 'Please enter a valid registration number', class: 'red' });
            }
        } else {
            const regList = await factory.filterRegListWithNum(req.params.number);
            if (regList.length > 0) {
                res.render('index', { regList });
            } else {
                res.render('index', { regList, output: 'No numbers found for that town', class: 'red' });
            }
        }
    }

    async function reset(req, res) {
        await factory.reset();

        req.flash('output', 'Database reset successful!');
        res.redirect('/reg_numbers');
    }

    function show(req, res) {
        if (!req.body.townFilter) {
            req.flash('err', 'Please select a town');
            res.redirect('/reg_numbers');
        } else {
            res.redirect('/reg_numbers/' + req.body.townFilter);
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
