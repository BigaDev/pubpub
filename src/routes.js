import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {App, AtomReader, AtomEditor, Editor, EmailVerification, GroupCreate, GroupProfile, JournalCreate, JournalProfile, JrnlCreate, JrnlProfile, Landing, Login, PubCreate, PubReader, ResetPassword, SignUp, UserProfile, UserSettings} from 'containers';
import {About, AboutJournals, AboutPubs, AboutReviews, NotFound} from 'components';

export default () => {

	return (
		<Route path="/" component={App}>

			{ /* Home (main) route */ }
			<IndexRoute component={Landing}/>

			{ /* Routes */ }
			<Route path="/about" component={About}/>

			<Route path="/a/:slug" component={AtomReader}/>
			<Route path="/a/:slug/edit" component={AtomEditor}/>
			<Route path="/a/:slug/:meta" component={AtomReader}/>

			<Route path="/group/:groupSlug" component={GroupProfile}/>
			<Route path="/group/:groupSlug/:mode" component={GroupProfile}/>
			<Route path="/groups/create" component={GroupCreate}/>

			<Route path="/journals" component={AboutJournals}/>
			<Route path="/journals/create" component={JournalCreate}/>

			<Route path="/jrnls/create" component={JrnlCreate}/>


			<Route path="/login" component={Login}/>

			<Route path="/pub/:slug" component={PubReader}/> {/* /pub/designandscience?journal=jods or /pub/designandscience?journal=impacts&version=8 */}
			<Route path="/pub/:slug/draft" component={Editor}/> {/* /pub/designandscience/draft */}
			<Route path="/pub/:slug/:meta" component={PubReader}/> {/* /pub/designandscience/history or /pub/designandscience/source?version=8 */}
			<Route path="/pubs" component={AboutPubs}/>
			<Route path="/pubs/create" component={PubCreate}/>

			<Route path="/resetpassword" component={ResetPassword}/>
			<Route path="/resetpassword/:hash/:username" component={ResetPassword}/>

			<Route path="/reviews" component={AboutReviews}/>

			<Route path="/settings" component={UserSettings}/> {/* /settings */}
			<Route path="/settings/:mode" component={UserSettings}/> {/* /settings/password */}

			<Route path="/user/:username" component={UserProfile}/> {/* /user/kate?filter=unpublished */}
			<Route path="/user/:username/:mode" component={UserProfile}/> {/* /user/kate/discussions?page=4 or /user/kate/settings */}
			
			<Route path="/signup" component={SignUp}/>

			<Route path="/verify/:hash" component={EmailVerification}/>

			<Route path="/:slug" component={JrnlProfile}/> {/* /jods or /jods?collection=fall2015 */}
			<Route path="/:slug/:mode" component={JrnlProfile}/> {/* /jods/about or /jods/settings */}

			{ /* Catch all route */ }
			<Route path="*" component={NotFound} status={404} />

		</Route>
	);

};
