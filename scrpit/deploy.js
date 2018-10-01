const rsync = require('rsyncwrapper');
const path = require('path');

rsync(
  {
    src: path.join(__dirname, '..', 'public/*'),
    dest: 'xuexin@192.168.50.66:www',
    recursive: true,
    ssh: true,
    deleteAll: true
  },
  function(error, stdout, stderr, cmd) {
    if (error) {
      console.log(error.message);
    } else {
      console.log('success');
    }
  }
);
