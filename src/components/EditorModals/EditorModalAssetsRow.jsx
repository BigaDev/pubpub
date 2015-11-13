import React, {PropTypes} from 'react';
import {LoaderDeterminate} from '../';
import Radium from 'radium';

let styles = {};

const EditorModalAssetsRow = React.createClass({
	propTypes: {
		thumbnail: PropTypes.string,
		filename: PropTypes.string,
		assetType: PropTypes.string,
		date: PropTypes.string,
		author: PropTypes.string,
		url: PropTypes.string,
		isLoading: PropTypes.bool,
		percentLoaded: PropTypes.number,
		isHeader: PropTypes.bool
	},

	render: function() {
		// Set isHeader and isLoading consts for easier access
		const isHeader = this.props.isHeader;
		const isLoading = this.props.isLoading || false;
		
		return (
			<div style={[styles.assetRowContainer, isHeader && styles.headeRowContainer]}>
				
				{/* Thumbnail */}
				<div style={styles.thumbnail}>
					<div style={styles.inlineBlockHelper}></div>
					<img style={styles.thumbnailImg} src={this.props.thumbnail} />
				</div>

				{/* refName */}
				<div style={[styles.filename, isHeader && styles.isHeader, isHeader && styles.isHeaderRef]}>{this.props.filename}</div>
				
				{/* Type */}
				<div style={[styles.hideOnLoad[isLoading], styles.type, styles.typeColors[this.props.assetType], isHeader && styles.isHeader]}>{this.props.assetType}</div>
				
				{/* Create Date */}
				<div style={[styles.hideOnLoad[isLoading], styles.date, isHeader && styles.isHeader]}>{this.props.date}</div>
				
				{/* Author */}
				<div style={[styles.hideOnLoad[isLoading], styles.author, isHeader && styles.isHeader]}>{this.props.author}</div>
				
				{/* Delete Button */}
				<div style={[styles.hideOnLoad[isLoading], styles.delete, isHeader && styles.isHeaderDelete]}>delete</div>

				{/*	Loading Bar.
				 	Only shown when file is uploading */}
				<div style={[styles.showOnLoad[isLoading], styles.loadingBarWrapper]}>
					<LoaderDeterminate value={this.props.percentLoaded}/> 
				</div>

			</div>
		);
	}
});

export default Radium(EditorModalAssetsRow);

// thumbnail: 10%
// refName: 20%
// type: 15%
// date: 20%
// by 20%
// delete 15%

const rowHeight = '30px';
styles = {
	assetRowContainer: {
		height: rowHeight,
		width: 'calc(100% - 20px)',
		padding: 10,
		fontFamily: 'Courier',
		fontSize: '15px',

	},
	thumbnail: {
		height: 'calc(' + rowHeight + ' - 4px)',
		width: '26px',
		margin: '0px calc(5% - 15px)',
		padding: '2px',
		float: 'left',
		position: 'relative',
		textAlign: 'center',
	},
	thumbnailImg: {
		display: 'inline-block',
		verticalAlign: 'middle',
		maxHeight: 'calc(' + rowHeight + ' - 4px)',
		maxWidth: 'calc(' + rowHeight + ' - 4px)',
	},
	inlineBlockHelper: {
		display: 'inline-block',
		verticalAlign: 'middle',
		height: '100%',
	},
	filename: {
		width: 'calc(20% - 8%)',
		padding: '0px 4%',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: rowHeight,
		height: rowHeight,
		float: 'left',
	},
	type: {
		lineHeight: '16px',
		height: 16,
		width: 50,
		padding: '2px 5px',
		margin: '3px calc(7.5% - 30px)',
		borderRadius: 2,
		float: 'left',
		textAlign: 'center',
	},
	typeColors: {
		data: {
			backgroundColor: '#F9ACAC',
		},
		image: {
			backgroundColor: '#CAACF9',
		},
		video: {
			backgroundColor: '#ACF9B2',
		},
	},
	date: {
		width: '16%',
		padding: '0px 2%',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: rowHeight,
		height: rowHeight,
		float: 'left',
	},
	author: {
		width: '16%',
		padding: '0px 2%',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: rowHeight,
		height: rowHeight,
		float: 'left',
	},
	delete: {
		width: '11%',
		padding: '0px 2%',
		textAlign: 'center',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: rowHeight,
		height: rowHeight,
		float: 'left',
	},
	headeRowContainer: {
		padding: '25px 10px',
	},
	isHeader: {
		textAlign: 'center',
		fontSize: '25px',
		fontFamily: 'Lato',
	},
	isHeaderRef: {
		width: '20%',
		padding: 0,
	},
	isHeaderDelete: {
		opacity: 0,
		pointerEvents: 'none',
	},
	hideOnLoad: {
		true: {
			display: 'none',
		}
	},
	showOnLoad: {
		false: {
			display: 'none'
		}
	},
	loadingBarWrapper: {
		height: 15,
		width: '70%',
		float: 'left',
		overflow: 'hidden',
		marginTop: 15, 
	},


};
