/* global Firebase Firepad CodeMirror */
import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';

import ReactFireMixin from 'reactfire';

import MarkdownWidgets from 'components/Markdown/MarkdownWidgets/MarkdownWidgets';
import FirepadUserList from 'containers/Editor/utils/editorFirepadUserlist';
import {codeMirrorStyles, codeMirrorStyleClasses} from 'containers/Editor/utils/codeMirrorStyles';
import {FireBaseURL} from 'config';
import {Markdown} from 'components';


let styles = {};
const cmOptions = {
	lineNumbers: false,
	lineWrapping: true,
	autofocus: true,
	mode: 'spell-checker',
	backdrop: 'pubpubmarkdown',
	extraKeys: {'Ctrl-Space': 'autocomplete'},
	dragDrop: false,
};

export const MarkdownEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
		loginData: PropTypes.object,
	},

	mixins: [ReactFireMixin],

	getInitialState() {
		return {
			markdown: '',
		};
	},

	componentDidMount() {
		// const prosemirror = require('prosemirror');
		// const schema = require('prosemirror/dist/schema-basic').schema;
		// const editor = new prosemirror.ProseMirror({
		// 	place: document.getElementById('codemirror-wrapper'),
		// 	schema: schema
		// });

		// Load Firebase and bind using ReactFireMixin. For assets, references, etc.
		const ref = new Firebase(FireBaseURL + this.props.atomEditData.getIn(['atomData', 'slug']) + '/editorData' );
		const token = this.props.atomEditData.getIn(['atomData', 'token']);
		const username = this.props.loginData.getIn(['userData', 'username']);
		const name = this.props.loginData.getIn(['userData', 'name']);
		const image = this.props.loginData.getIn(['userData', 'image']);
		ref.authWithCustomToken(token, (error, authData)=> {
			if (error) { console.log('Authentication Failed!', error); return; } 

			this.bindAsObject(ref, 'firepadData');
			// Load Firebase ref that is used for firepad
			const firepadRef = new Firebase(FireBaseURL + this.props.atomEditData.getIn(['atomData', 'slug']) + '/firepad');
			// Load codemirror
			const codeMirror = CodeMirror(document.getElementById('codemirror-wrapper'), cmOptions); 

			// Initialize Firepad using codemirror and the ref defined above.
			Firepad.fromCodeMirror(firepadRef, codeMirror, {userId: username, defaultText: '# Introduction'});

			new Firebase(FireBaseURL + '.info/connected').on('value', (connectedSnap)=> {
				if (connectedSnap.val() === true) { /* we're connected! */
					this.setState({editorSaveStatus: 'saved'});
				} else { /* we're disconnected! */
					this.setState({editorSaveStatus: 'disconnected'});
				}
			});

			FirepadUserList.fromDiv(firepadRef.child('users'), document.getElementById('active-collaborators'), username, name, image);

			codeMirror.on('change', this.onEditorChange);
		});
	},

	onEditorChange: function(cm, change) {
		this.setState({ markdown: cm.getValue() });
	},

	getSaveVersionContent: function() {
		return {
			markdown: this.state.markdown,
		};
	},

	render: function() {
		return (
			<div style={styles.container}>
				<Style rules={{
					...codeMirrorStyles(),
					...codeMirrorStyleClasses
				}} />

				<div id={'active-collaborators'} style={styles.collaborators}></div>
				<div id={'codemirror-wrapper'} style={[styles.block, styles.codeBlock]}></div>
				<div id={'atom-reader'} style={[styles.block, styles.previewBlock]}> 
					<Markdown markdown={this.state.markdown}/>
				</div>
				
			</div>
		);
	}
});

export default Radium(MarkdownEditor);

styles = {
	container: {
		display: 'table',
		width: '100%',
	},
	collaborators: {
		position: 'absolute',
	},
	block: {
		display: 'table-cell',
		verticalAlign: 'top',
		width: '50%',
	},
	codeBlock: {
		backgroundColor: '#F3F3F4',
	},
	previewBlock: {
		boxShadow: '0px 2px 2px #aaa',
	},
};
