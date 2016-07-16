import React, {PropTypes} from 'react';
import Radium from 'radium';
import Select from 'react-select';
import request from 'superagent';
import {safeGetInToJS} from 'utils/safeParse';

let styles;

export const AtomReaderContributors = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		handleJournalSubmit: PropTypes.func,
	},

	getInitialState: function() {
		return {
			value: [],
		};
	},

	componentWillReceiveProps(nextProps) {
		const currentSubmitted = safeGetInToJS(this.props.atomData, ['submittedData']) || [];
		const nextSubmitted = safeGetInToJS(nextProps.atomData, ['submittedData']) || [];
		if (currentSubmitted.length !== nextSubmitted.length) {
			this.setState({value: []});
		}
	},

	handleSelectChange: function(value) {
		this.setState({ value });
	},

	loadOptions: function(input, callback) {
		request.get('/api/autocompleteJrnls?string=' + input).end((err, response)=>{
			const responseArray = response.body || [];
			const options = responseArray.map((item)=>{
				return {
					value: item.slug,
					label: item.jrnlName,
					id: item._id,
				};
			});
			callback(null, { options: options });
		});
	},

	submitToJournals: function() {
		const journalIDs = this.state.value.map((item)=>{
			return item.id;
		});
		this.props.handleJournalSubmit(journalIDs);
	},

	render: function() {
		const submittedData = safeGetInToJS(this.props.atomData, ['submittedData']) || [];
		const featuredData = safeGetInToJS(this.props.atomData, ['featuredData']) || [];
		return (
			<div>

				<h2>Contributors</h2>
				Contributors contribute to publications, you can add

				<h3>Add C</h3>

				<Select.Async
					name="form-field-name"
					value={this.state.value}
					loadOptions={this.loadOptions}
					multi={true}
					placeholder={<span>Choose one or more journals for submission</span>}
					onChange={this.handleSelectChange} />

				<div className={'button'} style={[styles.submitButton, (this.state.value && this.state.value.length) && styles.submitButtonActive]} onClick={this.submitToJournals}>Submit To Journals</div>

				<h3>Submitted to</h3>
					{
						submittedData.sort((foo, bar)=>{
							// Sort so that most recent is first in array
							if (foo.createDate > bar.createDate) { return -1; }
							if (foo.createDate < bar.createDate) { return 1; }
							return 0;
						}).map((item, index)=>{
							return <div key={'submitted-' + index}>{item.createDate} to {item.destination && item.destination.jrnlName}</div>;
						})
					}

				<h3>Featured by</h3>
					{featuredData.map((item, index)=>{
						return <div key={'featured-' + index}>{item.jrnlName}</div>;
					})}


			</div>
		);
	}
});

export default Radium(AtomReaderContributors);

styles = {
	submitButton: {
		fontSize: '0.9em',
		margin: '1em 0em',
		pointerEvents: 'none',
		opacity: 0.5,
	},
	submitButtonActive: {
		pointerEvents: 'auto',
		opacity: 1,
	},
};
