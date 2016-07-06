import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {UserSettings} from './UserSettings.jsx'

describe('Components', () => {
	describe('UserSettings.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(UserSettings, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});
