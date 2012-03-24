var Seed = require('./seed');

railway.tools.seed = function () {
    var action = args.shift() || 'plant';
    var seed = new Seed;
    seed.on('complete', process.exit);
    var seedPath = app.root + '/db/seeds/' + app.set('env');

    switch (action) {
        default:
        case 'plant':
        case 'read':
        seed.plant(seedPath);
        break;
        case 'harvest':
        case 'write':
        seed.harvest(seedPath, 'coffee');
        break;
    }
};

railway.tools.seed.help = {
    shortcut: 'sd',
    usage: 'seed',
    description: 'Populate database with seed data'
};

