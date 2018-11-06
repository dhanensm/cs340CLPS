//HOMEPAGE???
module.exports = function () {
    var express = require('express');
    var router = express.Router();

    function getAisles(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, contains FROM aisle_table", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.aisle = results;
            complete();
        });
    }

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = []; //"deleteperson.js","filterpeople.js","searchpeople.js"
        var mysql = req.app.get('mysql');
        getAisles(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('homepage', context);
            }

        }
    });

    /*adds an animal???*/
    router.post('/', function (req, res) {
        console.log(req.body.location)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO animal_table (name, type, age, color, location, Ftype, cost) VALUES (?, ?, ?, ?, ?, ?, ?)";
        var inserts = [req.body.name, req.body.type, req.body.age, req.body.color, req.body.location, req.body.Ftype, req.body.cost];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
        });
    });

    //adds an aisle???
    //INSERT INTO aisle_table (contains)
    //VALUES (:containsInput);
    router.post('/', function (req, res) {
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO aisle_table (contains) VALUES (?)";
        var inserts = [req.body.contains];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
        });
    });


    return router;
}();
