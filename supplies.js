module.exports = function () {
    var express = require('express');
    var router = express.Router();

    //diaplay supplies

    function getSupplies(res, mysql, context, complete) {
        mysql.pool.query("SELECT * FROM supply_table", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.supply = results;
            complete();
        });
    }

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = []; //"deleteperson.js","filterpeople.js","searchpeople.js"
        var mysql = req.app.get('mysql');
        getSupplies(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('supplies', context);
            }

        }
    });

    //add new supply
    router.post('/', function (req, res) {
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO supply_table (item, bname, cost, location, quantity) VALUES (?, ?, ?, ?, ?)";
        var inserts = [req.body.item, req.body.bname, req.body.cost, req.body.location, req.body.quantity];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
        });
    });

    //update supply quantity in stock
    //UPDATE supply_table SET quantity = :quantityInput WHERE id = :idInputFromWebpage;
    router.put('/:id', function (req, res) {
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE supply_table SET quantity=? WHERE id=?";
        var inserts = [req.body.quantity, req.params.id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                res.end();
            }
        });
    });
    return router;
}();
