import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {getJrnl, updateJrnl} from './actions';
// import {NotFound} from 'components';
import JrnlProfileAbout from './JrnlProfileAbout';
import JrnlProfileDetails from './JrnlProfileDetails';
import JrnlProfileLayout from './JrnlProfileLayout';
import JrnlProfileRecent from './JrnlProfileRecent';
import JrnlProfileHeader from './JrnlProfileHeader';
import {NavContentWrapper} from 'components';
import {safeGetInToJS} from 'utils/safeParse';

// import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles;

export const JrnlProfile = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
		slug: PropTypes.string,
		mode: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routerParams) {
			return dispatch(getJrnl(routerParams.slug, routerParams.mode));
		}
	},

	getInitialState: function() {
		return {
			logo: undefined,
			headerColor: '',
			headerMode: '',
			headerAlign: '',
			headerImage: '',
		};
	},

	handleUpdateJrnl: function(newJrnlData) {
		this.props.dispatch(updateJrnl(this.props.slug, newJrnlData));
	},

	handleHeaderUpdate: function(updateObject) {
		this.setState(updateObject);
	},

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};

		const metaData = {};
		metaData.title = jrnlData.jrnlName + ' · PubPub';

		const mobileNavButtons = [
			{ type: 'link', mobile: true, text: 'About', link: '/' + this.props.slug + '/about' },
			{ type: 'button', mobile: true, text: 'Menu', action: undefined },
		];

		const adminNav = [
			{ type: 'title', text: 'Admin'},
			{ type: 'link', text: 'Details', link: '/' + this.props.slug + '/details', active: this.props.mode === 'details' },
			{ type: 'link', text: 'Curate', link: '/' + this.props.slug + '/curate', active: this.props.mode === 'curate' },
			{ type: 'link', text: 'Layout', link: '/' + this.props.slug + '/layout', active: this.props.mode === 'layout' },
			{ type: 'link', text: 'Collections', link: '/' + this.props.slug + '/collections', active: this.props.mode === 'collections' },
			{ type: 'spacer' },
			{ type: 'title', text: 'Public'},
		];

		const navItems = [
			...adminNav,
			{ type: 'link', text: 'About', link: '/' + this.props.slug + '/about', active: this.props.mode === 'about' },
			{ type: 'link', text: 'Recent Activity', link: '/' + this.props.slug, active: !this.props.mode},
			{ type: 'spacer' },
			{ type: 'link', text: 'Category 1', link: '/' + this.props.slug + '/category1', active: this.props.mode === 'category1' },
			{ type: 'link', text: 'Category 2', link: '/' + this.props.slug + '/category2', active: this.props.mode === 'category2' },
		];

		// const customBackgroundStyle = {
		// 	backgroundColor: jrnlData.headerColor || '#13A6EF',
		// 	backgroundImage: 'url("' + jrnlData.headerImage + '")',
		// };

		return (
			<div>

				<Helmet {...metaData} />

				{/* <div style={[styles.headerBackground, customBackgroundStyle]}>
					<div style={styles.backgroundGrey}></div>
					<div className={'section'}>
						<div style={styles.headerTextWrapper}>
							<h1>{jrnlData.jrnlName}</h1>
							<p>{jrnlData.description}</p>
						</div>
					</div>
				</div> */}
				<JrnlProfileHeader 
					jrnlName={this.state.jrnlName || jrnlData.jrnlName}
					description={this.state.description || jrnlData.description}
					logo={this.state.logo || jrnlData.logo}
					headerColor={this.state.headerColor || jrnlData.headerColor} 
					headerMode={this.state.headerMode || jrnlData.headerMode}
					headerAlign={this.state.headerAlign || jrnlData.headerAlign}
					headerImage={this.state.headerImage || jrnlData.headerImage} />

				<NavContentWrapper navItems={navItems} mobileNavButtons={mobileNavButtons}>

					{(() => {
						switch (this.props.mode) {
						case 'about':
							return (
								<JrnlProfileAbout jrnlData={this.props.jrnlData}/>
							);
						case 'details':
							return (
								<JrnlProfileDetails jrnlData={this.props.jrnlData} handleUpdateJrnl={this.handleUpdateJrnl}/>
							);
						case 'layout':
							return (
								<JrnlProfileLayout jrnlData={this.props.jrnlData} handleUpdateJrnl={this.handleUpdateJrnl} handleHeaderUpdate={this.handleHeaderUpdate}/>
							);
						default:
							return (
								<JrnlProfileRecent jrnlData={this.props.jrnlData} />
							);
						}
					})()}

				</NavContentWrapper>

			</div>
		);
	}

});

export default connect( state => {
	return {
		jrnlData: state.jrnl,
		slug: state.router.params.slug,
		mode: state.router.params.mode,
	};
})( Radium(JrnlProfile) );

styles = {
		
};


