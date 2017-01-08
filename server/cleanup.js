const cron = require('node-cron');
const globals = require('./globals');

function noOp() {};
module.exports = {
  prepForServerShutdown: (callback) => {

    // attach user callback to the process event emitter
    // if no callback, it will still exit gracefully on Ctrl-C
    callback = callback || noOp;
    process.on('cleanup', callback);

    // do app specific cleaning before exiting
    process.on('exit', function () {
      process.emit('cleanup');
    });

    // catch ctrl+c event and exit normally
    process.on('SIGINT', function () {
      console.log('Ctrl-C...');
      process.exit(2);
    });

    //catch uncaught exceptions, trace, then exit normally
    process.on('uncaughtException', function(e) {
      console.log('Uncaught Exception...');
      console.log(e.stack);
      process.exit(99);
    });
  },

  scheduleFileCleanup: () => {
    cron.schedule(globals.fileCleanupInterval, () => {
      // fs."rm -rf" globals.shareLinkDir
      // fs.create globals.shareLinkDir
    });
  }
}