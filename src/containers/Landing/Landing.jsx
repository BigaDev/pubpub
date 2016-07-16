import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
// import {globalStyles} from 'utils/styleConstants';
import {PreviewCard} from 'components';
import {About} from 'components';
// import { Link } from 'react-router';
import {s3Upload} from 'utils/uploadFile';
import {createAtom} from 'containers/AtomEditor/actions';

// import Select from 'react-select';
// import request from 'superagent';
// import {push} from 'redux-router';

let styles = {};

const Landing = React.createClass({
	propTypes: {
		landingData: PropTypes.object,
		loginData: PropTypes.object,
		dispatch: PropTypes.func
	},

	getInitialState() {
		return {
			// value: undefined,
		};
	},

	handleFileSelect: function(evt) {
		if (evt.target.files.length) {
			s3Upload(evt.target.files[0], ()=>{}, this.onFileFinish, 0);
		}
	},

	onFileFinish: function(evt, index, type, filename) {

		let atomType = undefined;
		const extension = filename.split('.').pop();
		switch (extension) {
		case 'jpg':
		case 'png':
		case 'jpeg':
		case 'tiff':
		case 'gif':
			atomType = 'image'; break;
		case 'pdf':
			atomType = 'pdf'; break;
		case 'ipynb':
			atomType = 'jupyter'; break;
		case 'mp4':
		case 'ogg':
		case 'webm':
			atomType = 'video'; break;
		default:
			break;
		}
		
		const versionContent = {
			url: 'https://assets.pubpub.org/' + filename
		};
		this.props.dispatch(createAtom(atomType, versionContent));
	},

	// handleSelectChange: function(value) {
	// 	console.log(value);
	// 	this.setState({ value });
	// 	// this.props.dispatch(push('/' + value.value));
	// },

	// loadOptions: function(input, callback) {
	// 	request.get('/api/autocompleteJrnls?string=' + input).end((err, response)=>{
	// 		const responseArray = response.body || [];
	// 		const options = responseArray.map((item)=>{
	// 			return {
	// 				value: item.slug,
	// 				label: item.jrnlName,
	// 				id: item._id,
	// 			};
	// 		});
	// 		callback(null, { options: options });
	// 	});
	// },

	render: function() {
		const metaData = {
			title: 'PubPub',
		};
		const loggedIn = this.props.loginData && this.props.loginData.get('loggedIn');

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				{/* If not loggedIn, display the About PubPub content*/}
				{!loggedIn &&
					<About />
				}

				<div className={'lightest-bg'}>
					<div className={'section'}>

						<input type="file" accept="*" onChange={this.handleFileSelect} />

						<h2>Recent Activity</h2>

						{/* <Select.Async
							name="form-field-name"
							value={this.state.value}
							loadOptions={this.loadOptions}
							placeholder={<span>Search</span>}
							multi={true}
							onChange={this.handleSelectChange} /> */}

						{/* If no activity, display - follow these suggested accounts*/}

						<PreviewCard 
							image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
							title={'Thariq Shihipar'}
							description={'Intent on eating every bagel on earth until I burst.'} />
						<PreviewCard 
							image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
							title={'Thariq Shihipar'}
							description={'Intent on eating every bagel on earth until I burst.'} />
						<PreviewCard 
							image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
							title={'Thariq Shihipar'}
							description={'Intent on eating every bagel on earth until I burst.'} />
						<PreviewCard 
							image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
							title={'Thariq Shihipar'}
							description={'Intent on eating every bagel on earth until I burst.'} />
						<PreviewCard 
							image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
							title={'Thariq Shihipar'}
							description={'Intent on eating every bagel on earth until I burst.'} />
					</div>
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		loginData: state.login,
		landingData: state.landing,
	};
})( Radium(Landing) );

styles = {

};
