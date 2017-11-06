module.exports = function(hbs) {
    
    hbs.registerHelper('repeat', function(options) {
        return options.fn(this)
    });

    hbs.registerHelper('i', function(options) {
        return options.fn(this)
    });

    hbs.registerHelper('j', function(options) {
        return options.fn(this)
    });

    hbs.registerHelper('a', function(options) {
        return options.fn(this)
    });
}