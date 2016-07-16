module.exports = {};

// The following are used in the static functions of other models.
// They thus then need to be declared first. This is a bit wonky. We probably
// just shouldn't be relying on cross dependencies in model static functions.. duh
module.exports.Asset = require('./models/asset-model');

module.exports.Atom = require('./models/atom-model');
module.exports.Link = require('./models/link-model');
module.exports.Version = require('./models/version-model');

module.exports.Discussion = require('./models/discussion-model');
module.exports.Group = require('./models/group-model');
module.exports.Journal = require('./models/journal-model');
module.exports.Jrnl = require('./models/jrnl-model');
module.exports.Notification = require('./models/notification-model');
module.exports.Pub = require('./models/pub-model');
module.exports.Tag = require('./models/tag-model');
module.exports.User = require('./models/user-model');
