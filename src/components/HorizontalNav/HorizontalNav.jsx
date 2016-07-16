import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);

let styles = {};

export const HorizontalNav = React.createClass({
	propTypes: {
		navItems: PropTypes.array,
	},

	render: function() {
		const navItems = this.props.navItems || [];
		const leftNavItems = navItems.filter((item)=>{ return item.rightAlign !== true; });
		const rightNavItems = navItems.filter((item)=>{ return item.rightAlign === true; });

		return (
			<div className={'horizontal-nav'} style={styles.pubSectionNav}>
				
				{/* Need some indicator to show if this version is public or not */}
				{leftNavItems.map((item, index)=>{
					return <Link to={item.link} style={[styles.pubNavButton, item.active && styles.pubNavButtonActive]} key={'leftNav-' + index} className={'horizontalNavHover'}>{item.text}</Link>;
				})}
				
				<div style={styles.pubNavButtonsRight}>
					{rightNavItems.map((item, index)=>{
						if (item.link) {
							return <Link to={item.link} style={[styles.pubNavButton, item.active && styles.pubNavButtonActive]} key={'rightNav-' + index} className={'horizontalNavHover'}>{item.text}</Link>;
						}
						if (item.action) {
							return <div onClick={item.action} style={[styles.pubNavButton, item.active && styles.pubNavButtonActive]} key={'rightNav-' + index} className={'horizontalNavHover'}>{item.text}</div>;
						}
						
					})}	
				</div>
				
			</div>
		);
	}
});

export default Radium(HorizontalNav);

styles = {
	pubSectionNav: {
		borderBottom: '1px solid #F3F3F4',
		fontSize: '0.85em',
		color: '#808284',
		margin: '0 auto',
	},
	pubNavButtonsRight: {
		float: 'right',
	},
	pubNavButton: {
		display: 'inline-block',
		padding: '10px',
		color: 'inherit',
		textDecoration: 'none',
		userSelect: 'none',
		cursor: 'pointer',
	},
	pubNavButtonActive: {
		borderBottom: '2px solid #2C2A2B',
		padding: '10px 10px 8px 10px',
	},

};
