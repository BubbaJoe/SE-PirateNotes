module.exports = function(db,fs) {

    function runFileQuery(fileName) {
        db.connect(function(err) {
            if(err) throw err;
            fs.readFile('./sql/'+filePath,
            'utf8',function(err,data) {
                if(err) throw err;
                db.query(data, function(err,result) {
                    return result;
                });
            });
        });
    }

    function runQuery(query) {
        db.connect(function(err) {
            if(err) throw err;
            db.query(data, function(err, result) {
                if(err) throw err;
                return result;
            });
        });
    }
}