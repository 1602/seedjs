var Seed = require('./seed');

module.exports = function (compound) {

    compound.tools.seed = function (compound, args) {
        var action = args.shift() || 'plant';
        var seed = new Seed(compound);
        seed.on('complete', function () {
            process.exit();
        });
        var seedsDir = compound.app.get('seeds') || compound.root + '/db/seeds/';
        var seedPath = seedsDir + compound.app.get('env');

        switch (action) {
            default:
            case 'plant':
            case 'read':
            seed.plant(compound, seedPath);
            break;
            case 'harvest':
            case 'write':
            seed.harvest(compound, seedPath, 'coffee');
            break;
        }
    };

    compound.seed = function(dir, done) {
        if (typeof dir === 'function') {
            done = dir;
            var seedsDir = compound.app.get('seeds') || compound.root + '/db/seeds/';
            dir = seedsDir + compound.app.get('env');
        }
        var seed = new Seed(compound);
        seed.once('complete', done);
        seed.plant(compound, dir);
    };

    compound.tools.seed.help = {
        shortcut: 'sd',
        usage: 'seed plant|harvest',
        description: 'Populate database with seed data'
    };

};
