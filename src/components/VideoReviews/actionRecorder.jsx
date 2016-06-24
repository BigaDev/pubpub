import React, {PropTypes} from 'react';
import Radium from 'radium';
import lodash from 'lodash';
import Portal from '../../utils/portal';
import hhmmss from 'hhmmss';

let styles = {};
let Rangy = null;
let Marklib = null;

const VideoReviews = React.createClass({
	propTypes: {
		onSave: PropTypes.func
	},
	getInitialState: function() {
		this.actions = [];
		this.selected = lodash.debounce(this._selected, 25);
		this.lastPaint = null;

		return {
			recording: false,
			seconds: 0
		};
	},
	componentDidMount: function() {
		Marklib = require('marklib');
		Rangy = require('rangy');
		require('rangy/lib/rangy-textrange.js');
		require('rangy/lib/rangy-serializer.js');
		require('rangy/lib/rangy-selectionsaverestore.js');
		window.rangy = Rangy;
		window.Marklib = Marklib;
		this.Marklib = Marklib;
		Rangy.init();
		//	const renderer = new Marklib.Rendering(document, {className: 'tempHighlight'}, document.getElementById('pubBodyContent'));
		//	const result = renderer.renderWithRange(this.state.range);
	},


	getActions: function() {
		return this.actions;
	},

	mouse: function(evt) {
		const mouse = {};

		const boundingRect = document.getElementById('pubContent').getBoundingClientRect();

		const leftOffset = boundingRect.left;
		const topOffset = boundingRect.top;

		const docWidth = boundingRect.width;
		const docHeight = boundingRect.height;

		const percentX = (evt.pageX - leftOffset) / docWidth;
		const percentY = (evt.pageY - topOffset) / docHeight;

		// console.log('Got scrolling!', percentX, percentY);

		mouse.pos = {x: percentX, y: percentY};
		mouse.type = 'mouse';

		const mouseX = (percentX * docWidth) + leftOffset;
		const mouseY = (percentY * docHeight) + topOffset;

		this.mouseElem.style.left = (mouseX ) + 'px';
		this.mouseElem.style.top = (mouseY) + 'px';

		// this.mouseElem.style.left = (evt.pageX ) + 'px';
		// this.mouseElem.style.top = (evt.pageY) + 'px';

		mouse.time = new Date().getTime() - this.startRecordingDate;
		this.actions.push(mouse);
	},

	pressMouse: function(evt) {
		return;
		const paint = {};

		const boundingRect = document.getElementById('pubContent').getBoundingClientRect();

		const leftOffset = boundingRect.left;
		const topOffset = boundingRect.top;

		const docWidth = boundingRect.width;
		const docHeight = boundingRect.height;

		const percentX = (evt.pageX - leftOffset) / docWidth;
		const percentY = (evt.pageY - topOffset) / docHeight;

		// console.log('Got scrolling!', percentX, percentY);

		paint.pos = {x: percentX, y: percentY};
		paint.type = 'paint';

		const paintX = (percentX * docWidth) + leftOffset;
		const paintY = (percentY * docHeight) + topOffset;

		const startPos = (this.lastPaint) ? this.lastPaint : paint;
		const startX = (startPos.x * docWidth) + leftOffset;
		const startY = (startPos.y * docHeight) + topOffset;

		/*
		var c = document.getElementById("drawCanvas");
		var ctx = c.getContext("2d");
		ctx.beginPath();
		ctx.moveTo(startX,startY);
		ctx.lineTo(paintX,paintY);
		ctx.stroke();

		this.lastPaint = paint;
		*/
		// this.mouseElem.style.left = (evt.pageX ) + 'px';
		// this.mouseElem.style.top = (evt.pageY) + 'px';

		paint.time = new Date().getTime() - this.startRecordingDate;
		this.actions.push(paint);
	},

	scroll: function(evt) {
		const scroll = {};
		scroll.pos = document.body.scrollTop;
		scroll.type = 'scroll';
		scroll.time = new Date().getTime() - this.startRecordingDate;
		this.actions.push(scroll);
	},

	_selected: function(evt) {
		const selectionStr = window.getSelection().toString().trim();

		if (selectionStr !== this.lastStr) {

			const selection = document.getSelection();
			let serializedRange;

			if (selectionStr !== '') {
				const mark = new this.Marklib.Rendering(document, {className: 'tempHighlight'}, document.getElementById('pubBodyContent'));
				const range = mark.renderWithRange(selection.getRangeAt(0));
				serializedRange = range.serialize();
				mark.destroy();
			} else {
				serializedRange = '';
			}

			const action = {
				type: 'select',
				time: new Date().getTime() - this.startRecordingDate
			};

			action.range = serializedRange;
			this.actions.push(action);
			this.lastStr = selectionStr;

			// const serializeSel = Rangy.serializeSelection(rawSel);
			// console.log(serializeSel);

			/*
			const rawSel = Rangy.saveSelection();
			const sel = JSON.parse(JSON.stringify(rawSel));
			sel.time = new Date().getTime() - this.startRecordingDate;
			sel.type = 'select';
			this.actions.push(sel);
			this.lastStr = window.getSelection().toString();
			*/
		}
	},

	componentWillUnmount: function() {
		if (this.state.recording === true) {
			document.removeEventListener('selectionchange', this.selected);
			window.removeEventListener('scroll', this.scroll);
			document.getElementById('pubContent').removeEventListener('mousemove', this.mouse);
			document.getElementById('pubContent').removeEventListener('mousedown', this.pressMouse);

			if (this.counterInterval) clearInterval(this.counterInterval);
		}
	},

	play: function() {
		const self = this;
		self.setState({recording: true, seconds: 0});
		document.addEventListener('selectionchange', self.selected);
		window.addEventListener('scroll', self.scroll);
		document.getElementById('pubContent').addEventListener('mousemove', self.mouse);
		document.getElementById('pubContent').addEventListener('mousedown', self.pressMouse);

		self.startRecordingDate = new Date().getTime();
		self.actions = [];
		self.scroll();
		this.counterInterval = setInterval(this.counter, 1000);
	},

	counter: function() {
		this.setState({seconds: this.state.seconds + 1});
	},

	pause: function() {
		/* Need to implement! */
	},


	stop: function() {
		// this.cameraPreview.stop();
		if (this.counterInterval) clearInterval(this.counterInterval);
		this.setState({recording: false});
		document.removeEventListener('selectionchange', this.selected);
		window.removeEventListener('scroll', this.scroll);
		document.getElementById('pubContent').removeEventListener('mousemove', this.mouse);
	},


	close: function() {
		this.props.onSave(null);
	},

	render: function() {

		return (

			<div>
			{/*
			<canvas style={styles.canvas} id="drawCanvas">
				Your browser does not support the HTML5 canvas tag.
			</canvas>
			*/}

			<Portal portalId="actionRecorderPointer">
				<div ref={(ref) => this.mouseElem = ref} style={[styles.mouse, styles.show(this.state.recording)]}>
					<span style={styles.mouseTriangle}/>
					<span style={styles.mouseTooltip}>{`Recording (${hhmmss(this.state.seconds)})`}</span>
				</div>
			</Portal>
			</div>
		);
	}
});

styles = {
	show: function(recording) {
		const cameraStyle = {};
		if (recording) {
			cameraStyle.display = 'block';
		} else {
			cameraStyle.display = 'none';
		}
		return cameraStyle;
	},
	canvas: {
		position: 'absolute',
		top: '0px',
		left: '0px',
		width: '100vw',
		height: '100vh',
	},
	mouse: {
		position: 'absolute',
		top: '50px',
		left: '50px',
		height: '20px',
		zIndex: '1000000000',
		pointerEvents: 'none'
	},
	mouseTriangle: {
		width: 0,
		height: 0,
		borderLeft: '5px solid transparent',
		borderRight: '5px solid transparent',
		borderTop: '5px solid rgba(187, 40, 40, 0.59)',
		fontSize: 0,
		lineHeight: 0,
		position: 'absolute',
		left: '6px',
		top: '-5px',
		zIndex: '1000000',
	},
	mouseTooltip: {
		fontSize: '0.75em',
		position: 'relative',
		top: '-25px',
		left: '0px',
		backgroundColor: 'rgba(187, 40, 40, 0.59)',
		color: 'white',
		padding: '3px 5px',
		borderRadius: '1px',
		fontWeight: '300',
	}
};

export default Radium(VideoReviews);
