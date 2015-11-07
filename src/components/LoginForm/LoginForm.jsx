import React, { PropTypes } from 'react';
import {reduxForm} from 'redux-form';
import Radium from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const LoginForm = React.createClass({
	propTypes: {
		fields: PropTypes.object.isRequired,
		handleSubmit: PropTypes.func.isRequired,
	},

	mixins: [PureRenderMixin],

	render: function() {
		const {
			fields: {email, password},
			handleSubmit
		} = this.props;

		return (
			<form onSubmit={handleSubmit}>
				<div>
					<label style={styles.label}>Email</label>
					<input key="loginEmail" style={styles.input} type="text" placeholder="Email" {...email}/>
				</div>
				<div>
					<label style={styles.label}>Password</label>
					<input key="loginPassword" style={styles.input} type="password" placeholder="Password" {...password}/>
				</div>
				<div key="loginSubmit" style={styles.submit} onClick={handleSubmit}>Submit</div>
			</form>
		);
	}
});

export default reduxForm({
	form: 'loginForm',
	fields: ['email', 'password']
})(Radium(LoginForm));

styles = {
	submit: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: 160,
		height: 20,
		// backgroundColor: 'rgba(50,100,190,1)',
		color: globalStyles.headerText,
		textAlign: 'right',
		padding: 20,
		fontSize: '20px',
		cursor: 'pointer',
		':hover': {
			color: globalStyles.headerHover
		}
	},
	label: {
		opacity: 0,
		position: 'absolute',
	},
	input: {
		borderWidth: '0px 0px 1px 0px',
		borderColor: globalStyles.headerText,
		backgroundColor: 'transparent',
		margin: '40px 30px 0px 30px',
		fontSize: '14px',
		color: globalStyles.headerText,
		':focus': {
			borderWidth: '0px 0px 1px 0px',
			borderColor: globalStyles.headerHover,
			outline: 'none',
		},
	}

};