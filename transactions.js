module.exports = function () {
    var express = require('express');
    var router = express.Router();
    var searched = false;
    // function getTransactions(res, mysql, context, complete) {
    //     mysql.pool.query("SELECT * FROM transaction_table", function (error, results, fields) {
    //         if (error) {
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         context.trasnsactions = results;
    //         complete();
    //     });
    // }
    function getAllTransactionshopefully(res, mysql, context, complete){
       mysql.pool.query("(SELECT tr.id AS 'ID', tr.cname AS 'Name', an.type AS 'Item' FROM transaction_table tr INNER JOIN adoption_table ad ON tr.id = ad.tid INNER JOIN animal_table an ON ad.aid = an.id ) UNION ALL (SELECT tr2.id AS 'ID', tr2.cname AS 'Name', su.item AS 'Item' FROM transaction_table tr2 INNER JOIN purchase_table pr ON tr2.id = pr.tid INNER JOIN supply_table su ON pr.sid=su.id )", function (error, results, fields) {
           if (error) {
               res.write(JSON.stringify(error));
               res.end();
           }
           context.transactions = results;
           complete();
       });
     }
     function getTransactionsByCname(req, res, mysql, context, complete){
        var query = "(SELECT tr.id AS 'ID', tr.cname AS 'Name', an.type AS 'Item' FROM transaction_table tr INNER JOIN adoption_table ad ON tr.id = ad.tid INNER JOIN animal_table an ON ad.aid = an.id WHERE cname = " + mysql.pool.escape(req.params.s) + ") UNION ALL (SELECT tr2.id AS 'ID', tr2.cname AS 'Name', su.item AS 'Item' FROM transaction_table tr2 INNER JOIN purchase_table pr ON tr2.id = pr.tid INNER JOIN supply_table su ON pr.sid=su.id WHERE cname = " +  mysql.pool.escape(req.params.s) + ")";
        mysql.pool.query(query, function(error, results, fields){
          if(error){
            res.write(JSON.stringify(error));
            res.end();
          }
          context.transactions = results;
          complete();
        });
      }


    /*add new animal transaction*/

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchtransactions.js"]; //"deleteperson.js","filterpeople.js","searchpeople.js"
        var mysql = req.app.get('mysql');
        getAllTransactionshopefully(res, mysql, context, complete);
        //getTransactionSuppliesByCname(res, mysql, context, complete);
        //getTransactionAnimalsByCname(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('transactions', context);
            }
        }
    });

    router.get('/transactions/returnsupply', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchtransactions.js"];
        var mysql = req.app.get('mysql');
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "(SELECT tr.id AS 'ID', tr.cname AS 'Name', an.type AS 'Item' FROM transaction_table tr INNER JOIN adoption_table ad ON tr.id = ad.tid INNER JOIN animal_table an ON ad.aid = an.id WHERE cname=?) UNION ALL (SELECT tr2.id AS 'ID', tr2.cname AS 'Name', su.item AS 'Item' FROM transaction_table tr2 INNER JOIN purchase_table pr ON tr2.id = pr.tid INNER JOIN supply_table su ON pr.sid=su.id WHERE cname=?) ";
        var inserts = [req.body.cname, req.body.cname];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
            context.transactions = results;
            complete();
        });
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('transactions', context);
            }
        }
    });
    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search_transactions/:s', function(req, res){
      console.log("search fn")
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchtransactions.js"];
        var mysql = req.app.get('mysql');
        getTransactionsByCname(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('transactions', context);
            }
        }
    });

    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    // router.get('/search/:s', function(req, res){
    //     var callbackCount = 0;
    //     var context = {};
    //     context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
    //     var mysql = req.app.get('mysql');
    //     getPeopleWithNameLike(req, res, mysql, context, complete);
    //     getPlanets(res, mysql, context, complete);
    //     function complete(){
    //         callbackCount++;
    //         if(callbackCount >= 2){
    //             res.render('people', context);
    //         }
    //     }
    // });
    router.post('/addtrans', function (req, res) {
        console.log("made it in my fn");
        console.log(req.body);
        console.log(req.body.type)
        if(req.body.type == "animal"){
          console.log("inserting animal");

          var mysql = req.app.get('mysql');
          var sql = "INSERT INTO `transaction_table` (`cname`) VALUES (?);";
          var inserts = [req.body.cname];
          sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
              if (error) {
                  console.log(JSON.stringify(error))
                  res.write(JSON.stringify(error));
                  res.end();
              }else {
                var temp = results.insertId;
                sql = "INSERT INTO `adoption_table` (`tid`, `aid`) VALUES (?, ?);";
                inserts = [temp, req.body.item];
                sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
                    if (error) {
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    }
                    res.redirect('/transactions');
                });
              }
          });
        }
        if(req.body.type == "supply"){
          console.log("inserting supply");

          var mysql = req.app.get('mysql');
          var sql = "INSERT INTO `transaction_table` (`cname`) VALUES (?);";
          var inserts = [req.body.cname];
          sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
              if (error) {
                  console.log(JSON.stringify(error))
                  res.write(JSON.stringify(error));
                  res.end();
              }else {
                var temp = results.insertId;
                sql = "INSERT INTO `purchase_table` (`tid`, `sid`) VALUES (?, ?);";
                inserts = [temp, req.body.item];
                sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
                    if (error) {
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    }
                    res.redirect('/transactions');
                });
              }
          });
        }
    });

    //addnew supply transaction
    router.post('/addtrans', function (req, res) {
        //console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO transaction_table (cname) VALUES (?); INSERT INTO adoption_table (tid, sid) VALUES (LAST_INSERT_ID(), ?) ";
        var inserts = [req.cname, req.sid];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }res.redirect('/transactions');
        });
    });
    // router.get('/search_transactions/', function (req, res) {
    //     console.log("search button function thingy yay")
    //     //console.log(req.body.homeworld)
    //     console.log(req.body)
    //     var mysql = req.app.get('mysql');
    //     var sql = "(SELECT tr.id AS 'ID', tr.cname AS 'Name', an.type AS 'Item' FROM transaction_table tr INNER JOIN adoption_table ad ON tr.id = ad.tid INNER JOIN animal_table an ON ad.aid = an.id WHERE cname = ?) UNION ALL (SELECT tr2.id AS 'ID', tr2.cname AS 'Name', su.item AS 'Item' FROM transaction_table tr2 INNER JOIN purchase_table pr ON tr2.id = pr.tid INNER JOIN supply_table su ON pr.sid=su.id WHERE cname = ?)";
    //     var inserts = [req.cname, req.cname];
    //     sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
    //         if (error) {
    //             console.log(JSON.stringify(error))
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         res.redirect('/transactions');
    //     });
    // });



    router.post('/returnsupply', function (req, res) {
        //console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM purchase_table WHERE tid=?";
        var inserts = [req.body.transaction_id];

        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {

            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }

            else {
              sql = "DELETE FROM transaction_table WHERE id=?";
              inserts = [req.body.transaction_id];
              sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
                  if (error) {
                      console.log(JSON.stringify(error))
                      res.write(JSON.stringify(error));
                      res.end();
                  }
                  res.redirect('/transactions');
              });
            }
        });
    });

    //delete transaction
    /*-- customer is returning an item (deleting item that was purchased)
    -- given tid cname bname
    DELETE FROM purchase_table
    WHERE tid= :tidfrominput
    AND sid=(
      SELECT supply_table.id
      FROM supply_table
      WHERE supply_table.bname LIKE %:supplybnamefrominput%);*/


    return router;
}();
