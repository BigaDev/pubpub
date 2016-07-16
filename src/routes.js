import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {App, AtomReader, AtomEditor, Editor, EmailVerification, GroupCreate, GroupProfile, JournalCreate, JournalProfile, JrnlCreate, JrnlProfile, Landing, Login, PubCreate, PubReader, ResetPassword, SignUp, UserProfile, UserSettings} from 'containers';
import {About, AboutJournals, AboutPubs, AboutReviews, NotFound} from 'components';

function loadComponent(component) {
	if (__CLIENT__) return (location, cb) => component(module => cb(null, module.default || module));
	else if (__SERVER__) return (location, cb) => cb(null, component.default || component);
	
	// If we didn't hit one of the above return statements, something strange has happened.
	console.error('Uh oh. Something strange happened in src/routes.js');
}

export default () => {

	return (
		<Route path="/" component={App}>

			{ /* Home (main) route */ }
			<IndexRoute component={Landing}/>

			{ /* Routes */ }
			<Route path="/about" component={About}/>

			<Route path="/a/:slug" getComponent={loadComponent(AtomReader)}/>
			<Route path="/a/:slug/edit" getComponent={loadComponent(AtomEditor)}/>
			<Route path="/a/:slug/:meta" getComponent={loadComponent(AtomReader)}/>

			<Route path="/group/:groupSlug" getComponent={loadComponent(GroupProfile)}/>
			<Route path="/group/:groupSlug/:mode" getComponent={loadComponent(GroupProfile)}/>
			<Route path="/groups/create" getComponent={loadComponent(GroupCreate)}/>

			<Route path="/journals" getComponent={loadComponent(AboutJournals)}/>
			<Route path="/journals/create" getComponent={loadComponent(JournalCreate)}/>

			<Route path="/jrnls/create" getComponent={loadComponent(JrnlCreate)}/>

			<Route path="/group/:groupSlug" component={GroupProfile}/>
			<Route path="/group/:groupSlug/:mode" component={GroupProfile}/>
			<Route path="/groups/create" component={GroupCreate}/>

			<Route path="/login" getComponent={loadComponent(Login)}/>

			<Route path="/pub/:slug" getComponent={loadComponent(PubReader)}/> {/* /pub/designandscience?journal=jods or /pub/designandscience?journal=impacts&version=8 */}
			<Route path="/pub/:slug/draft" getComponent={loadComponent(Editor)}/> {/* /pub/designandscience/draft */}
			<Route path="/pub/:slug/:meta" getComponent={loadComponent(PubReader)}/> {/* /pub/designandscience/history or /pub/designandscience/source?version=8 */}
			<Route path="/pubs" getComponent={loadComponent(AboutPubs)}/>
			<Route path="/pubs/create" getComponent={loadComponent(PubCreate)}/>

			<Route path="/resetpassword" getComponent={loadComponent(ResetPassword)}/>
			<Route path="/resetpassword/:hash/:username" getComponent={loadComponent(ResetPassword)}/>

			<Route path="/reviews" getComponent={loadComponent(AboutReviews)}/>

			<Route path="/settings" getComponent={loadComponent(UserSettings)}/> {/* /settings */}
			<Route path="/settings/:mode" getComponent={loadComponent(UserSettings)}/> {/* /settings/password */}

			<Route path="/user/:username" getComponent={loadComponent(UserProfile)}/> {/* /user/kate?filter=unpublished */}
			<Route path="/user/:username/:mode" getComponent={loadComponent(UserProfile)}/> {/* /user/kate/discussions?page=4 or /user/kate/settings */}
			
			<Route path="/signup" getComponent={loadComponent(SignUp)}/>

			<Route path="/verify/:hash" getComponent={loadComponent(EmailVerification)}/>

			<Route path="/:slug" getComponent={loadComponent(JrnlProfile)}/> {/* /jods or /jods?collection=fall2015 */}
			<Route path="/:slug/:mode" getComponent={loadComponent(JrnlProfile)}/> {/* /jods/about or /jods/settings */}

			{ /* Catch all route */ }
			<Route path="*" component={NotFound} status={404} />

		</Route>
	);

};
