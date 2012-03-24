exports.init = function initSeed() {

    // add railwayjs entry point
    if (global.railway) require('./lib/railway-tools');

    return false;
};

