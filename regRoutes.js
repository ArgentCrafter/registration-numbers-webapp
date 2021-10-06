module.exports = function regRoutes(pool, factory) {

    function root(req, res) {
        res.redirect('/registration_numbers');
    }

    function regNumbers(req, res) {
        res.render('index');
    }

    return {
        root,
        regNumbers
    }
}