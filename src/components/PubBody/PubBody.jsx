import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {globalStyles} from 'utils/styleConstants';
import {Markdown, SelectionPopup, Reference, License} from 'components';
import ResizingText from 'utils/ResizingText';

import {globalMessages} from 'utils/globalMessages';
import {parsePluginString} from 'utils/parsePlugins';

import {FormattedMessage} from 'react-intl';

let styles = {};

const PubBody = React.createClass({
	propTypes: {
		status: PropTypes.string,
		isPublished: PropTypes.bool,
		isPage: PropTypes.bool,
		markdown: PropTypes.string,
		pubURL: PropTypes.string,
		addSelectionHandler: PropTypes.func,
		styleScoped: PropTypes.string,
		showPubHighlights: PropTypes.bool,
		isFeatured: PropTypes.bool,
		errorView: PropTypes.bool,
		minFont: PropTypes.number,
		maxFont: PropTypes.number,
		showPubHighlightsComments: PropTypes.bool,
		disableResize: PropTypes.bool,
	},
	getDefaultProps: function() {
		return {
		};
	},

	getInitialState() {
		return {
		};
	},

	componentDidMount() {
		document.getElementById('dynamicStyle').innerHTML = this.props.styleScoped;
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.styleScoped !== nextProps.styleScoped) {
			document.getElementById('dynamicStyle').innerHTML = nextProps.styleScoped;
		}
		if (!nextProps.styleScoped) {
			document.getElementById('dynamicStyle').innerHTML = '';
		}
	},

	compileStyleRules: function() {


		return ({
			// ...defaultContentRules,
			// ...pubContentRules,
			'.marking': {
				backgroundColor: 'rgba(124, 235, 124, 0.7)',
			},
			'.tempHighlight': {
				backgroundColor: 'rgba(200,200,200, 0.7)',
			},
			'.selection': {
				backgroundColor: this.props.showPubHighlights ? 'rgba(195, 245, 185, 0.3)' : 'rgba(195, 245, 185, 0.0)',
				cursor: this.props.showPubHighlights ? 'pointer' : 'text',
			},
			'.selection-editor': {
				backgroundColor: this.props.showPubHighlightsComments ? 'rgba(195, 185, 245, 0.6)' : 'rgba(195, 245, 185, 0.0)',
				cursor: this.props.showPubHighlightsComments ? 'pointer' : 'text',
			},
			'.selection-active': {
				backgroundColor: 'rgba(78, 164, 61, 0.4)',
			},
			'.selection-editor.selection-active': {
				backgroundColor: 'rgba(78, 61, 164, 0.6)',
			},
		});
	},

	render: function() {

		return (
			<ResizingText
				fontRatio={45}
				mobileFontRatio={25}
				minFont={this.props.minFont}
				maxFont={this.props.maxFont}
				disable={this.props.isPage || this.props.disableResize}>

			<div style={styles.container} onClick={this.clicked}>

				<Style rules={this.compileStyleRules()}/>

				<div id={this.props.isPage ? 'pageContent' : 'pubContent'} style={[styles.contentContainer, globalStyles[this.props.status]]} >
					<div id="pub-wrapper">
						{!this.props.isFeatured && !this.props.errorView && !this.props.isPage
							? <div style={styles.submittedNotification}>This Pub has been submitted to - but is not yet featured in - this journal.</div>
							: null
						}

						{
							/* this.props.firstPublishedDate !== this.props.lastPublishedDate
							? <div id={'pub-dates'}>
								<span><FormattedMessage {...globalMessages.firstPublished}/> </span>
								{dateFormat(this.props.firstPublishedDate, 'mmm dd, yyyy')}
								<span style={styles.dateSeparator}>|</span>
								<span><FormattedMessage {...globalMessages.lastPublished}/> </span>
								{dateFormat(this.props.lastPublishedDate, 'mmm dd, yyyy')}
							</div>
							: <div id={'pub-dates'} style={[this.props.firstPublishedDate === undefined && {display: 'none'}]}>
								<span><FormattedMessage {...globalMessages.publishedOn}/> </span>
								{dateFormat(this.props.firstPublishedDate, 'mmm dd, yyyy')}
							</div>
						*/}

						<div id="pubBodyContent"> {/* Highlights are dependent on the id 'pubBodyContent' */}

							{this.props.pubURL ?
								<div className="onlineURL">This publication can be found online at {this.props.pubURL}. </div>
							: null}

							<Markdown mode="html" markdownChange={this.props.markdownChange} markdown={this.props.markdown} isPage={this.props.isPage}/>

							{this.props.addSelectionHandler
								? <SelectionPopup addSelectionHandler={this.props.addSelectionHandler}/>
								: null
							}

						</div>

						{this.props.isFeatured && !this.props.errorView && this.props.isPublished && !this.props.isPage
							? <div id="pub-license"><License /></div>
							: null
						}
					</div>


				</div>

			</div>
			</ResizingText>
		);
	}
});


styles = {
	container: {
		width: '100%',
		// overflow: 'hidden',
		borderRadius: 1,
		// minHeight: 'calc(100vh - 2 * ' + globalStyles.headerHeight + ' + 2px)',
	},
	contentContainer: {
		// transition: '.3s linear opacity .25s',
		// padding: '0px 4em 50px',
		// fontFamily: globalStyles.headerFont,
		// lineHeight: '1.58',
		// textRendering: 'optimizeLegibility',
		// WebkitFontSmoothing: 'antialiased',
		// '@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
		// 	padding: '0px 1em 50px',
		// },
	},
	loading: {
		opacity: 0,
	},
	loaded: {
		opacity: 1
	},
	dateSeparator: {
		padding: '0px 10px',
	},
	// referenceNumber: {
	// 	color: '#222',
	// 	paddingRight: '10px',
	// 	fontSize: '1em',
	// },
	submittedNotification: {
		backgroundColor: '#373737',
		textAlign: 'center',
		fontSize: '18px',
		padding: '15px',
		margin: '5px',
		color: 'white',
	},

};

export default Radium(PubBody);
