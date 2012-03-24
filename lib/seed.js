var juggling = require('jugglingdb');
var path = require('path');
var fs = require('fs');

function Seed() {
    var seed = this;
    var queue = [];

    juggling.AbstractClass.seed = function (seed) {
        if (queue.length === 0) process.nextTick(next);
        queue.push({Model: this, seed: seed});
    };

    function next() {
        var task = queue.shift();
        if (!task) return seed.emit('complete');

        var Model = task.Model;
        Model.schema.log = console.log;
        var data = task.seed();
        if (Model.schema.connected) {
            console.log('Seed %s: %s', Model.modelName, JSON.stringify(data).substr(0, 80));
            Model.upsert(data, next);
        } else {
            Model.schema.on('connected', function () {
                Model.upsert(data, next);
            });
        }
    }
}

module.exports = Seed;

require('util').inherits(Seed, require('events').EventEmitter);

Seed.prototype.plant = function (path) {
    fs.readdirSync(path).forEach(function (file) {
        if (file.match(/(coffee|js)$/)) require(path + '/' + file);
    });
};

Seed.prototype.harvest = function (file, type) {
    Object.keys(app.models).forEach(function (modelName) {
        var Model = app.models[modelName];
        var text = '';
        Model.all(function (err, data) {
            if (err) throw err;
            data.forEach(function (d) {
                text += codify(modelName, d, type);
            });
            fs.writeFileSync(file + '/' + modelName + '.' + type, text);
        });
    });

    function codify(modelName, d, type) {
        var str = modelName + '.seed ->\n'
        Object.keys(d).forEach(function (f) {
            str += '    ' + escape(f) + ': ' + quote(d[f]) + '\n';
        });
        return str + '\n';
    };

    function escape(f) {
        return f.match(/[^_a-z]/i) ? "'" + f + "'" : f;
    };

    function quote(v) {
        if (typeof v === 'string') {
            if (v.match(/\n/)) {
                return '"""\n        ' +
                v.replace(/#\{/g, '\\#{').replace(/\n/g, '\n        ') +
                '\n    """';
            } else {
                return "'" + v.replace(/'/g, '\\\'') + "'";
            }
        }
        if (v && typeof v === 'object' && v.constructor.name === 'Date') {
            return "'" + v.toString().split(' GMT')[0] + "'";
        }
        return v;
    }
};

