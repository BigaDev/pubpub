import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {MarkdownViewer, ImageViewer, JupyterViewer} from 'components/AtomTypes' ;
import AtomTypes from 'components/AtomTypes';
import {safeGetInToJS} from 'utils/safeParse';

export const AtomViewerPane = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	render: function() {
		const type = safeGetInToJS(this.props.atomData, ['atomData', 'type']);
		if (AtomTypes.hasOwnProperty(type)) {
			return React.createElement(AtomTypes[type].viewer, {atomData: this.props.atomData});
		} else {
			return <div>Unknown Type</div>;
		}
		// switch (type) {
		// case 'markdown':
		// 	return <MarkdownViewer atomData={this.props.atomData} />;
		// case 'image':
		// 	return <ImageViewer atomData={this.props.atomData} />;
		// case 'jupyter':
		// 	return <JupyterViewer atomData={this.props.atomData} />;
		// default:
		// 	return <div>Unknown Type</div>;
		// }
	}
});

export default Radium(AtomViewerPane);
