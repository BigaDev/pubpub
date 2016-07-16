const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const linkSchema = new Schema({
	type: { type: String },
	source: { type: ObjectId },
	destination: { type: ObjectId },

	createBy: { type: ObjectId, ref: 'User'},
	createDate: { type: Date },

	metadata: { type: Schema.Types.Mixed },

	inactive: { type: Boolean }, 
	inactiveBy: { type: ObjectId, ref: 'User'},
	inactiveDate: { type: Date },
	inactiveNote: { type: String },
	
});

linkSchema.statics.createLink = function(type, source, destination, createBy, createDate) {
	const newLink = new this({
		type: type,
		source: source,
		destination: destination,
		createBy: createBy,
		createDate: createDate || new Date().getTime(),
	});
	return newLink.save();
};

linkSchema.statics.setLinkInactive = function(type, source, destination, inactiveBy, inactiveDate, inactiveNote) {
	// Beacuse upsert is false, this will not create a new document if no match is found.
	return this.findOne({type: type, source: source, destination: destination }).exec()
	.then(function(linkResult) {
		linkResult.inactive = true;
		linkResult.inactiveBy = inactiveBy;
		linkResult.inactiveDate = inactiveDate || new Date().getTime();
		linkResult.inactiveNote = inactiveNote;
		return linkResult.save();
	});
	
};

module.exports = mongoose.model('Link', linkSchema);

// -------
// Types
// -------
// 
// USER -> PUB
// author
// follower
// editor
// reader

// PUB -> PUB
// reply
// clone
// lens
// cite
// embed
// source

// PUB -> JOURNAL
// submitted

// JOURNAL -> PUB
// featured
