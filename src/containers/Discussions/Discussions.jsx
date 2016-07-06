import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import {globalStyles} from 'utils/styleConstants';
// import {rightBarStyles} from 'containers/PubReader/rightBarStyles';
import DiscussionsItem from './DiscussionsItem';
import DiscussionsInput from './DiscussionsInput';
import {SimpleSelect} from 'react-selectize';

// import Portal from 'react-portal';
import {MediaLibrary} from 'containers';

import {toggleVisibility} from 'containers/Login/actions';
import {waitForUpload} from 'containers/Editor/actions';
import {addDiscussion, discussionVoteSubmit, archiveDiscussion} from './actions';

import {redditHot as hotScore} from 'decay';


// import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};
const Discussions = React.createClass({
	propTypes: {
		metaID: PropTypes.string,

		discussionsData: PropTypes.object,
		pubData: PropTypes.object,
		// editorData: PropTypes.object,
		loginData: PropTypes.object,
		appData: PropTypes.object,

		slug: PropTypes.string,
		pathname: PropTypes.string,
		query: PropTypes.object,

		dispatch: PropTypes.func,

	},
	getInitialState() {
		return {
			showMediaLibrary: false,
			assetLibraryCodeMirrorID: undefined,
            sortBy:'hotness',
            sortedDiscussions:'empty'
		};
	},

	componentWillReceiveProps(nextProps) {
		const hasHighlight = (this.props.loginData.get('addedHighlight') === undefined && nextProps.loginData.get('addedHighlight'));

		if (this.props.loginData.get('addedHighlight') === undefined && nextProps.loginData.get('addedHighlight')) {
			const assetObject = nextProps.loginData.get('addedHighlight').toJS();

			const cmInstances = document.querySelectorAll('.CodeMirror');
			for (const instance of cmInstances) {
				const cm = instance.CodeMirror;
				const currentSelection = cm.getCursor();
				const inlineObject = {pluginType: 'highlight', source: {...assetObject.assetData, ...{_id: assetObject._id} }};
				cm.replaceRange('[[' + JSON.stringify(inlineObject) + ']] ', {line: currentSelection.line, ch: currentSelection.ch});
			}
		}
	},

	addDiscussion: function(discussionObject, activeSaveID) {
		if (!this.props.loginData.get('loggedIn')) {
			return this.props.dispatch(toggleVisibility());
		}

		if (!discussionObject.markdown) { return null; }

		const pathname = this.props.pathname;
		if (pathname.substring(pathname.length - 6, pathname.length) === '/draft') {
			// We are commenting from the draft, so mark it so.
			discussionObject.version = 0;
		} else {
			discussionObject.version = this.props.query.version !== undefined && this.props.query.version > 0 && this.props.query.version < (this.props.pubData.getIn(['pubData', 'history']).size - 1) ? this.props.query.version : this.props.pubData.getIn(['pubData', 'history']).size;
		}
		discussionObject.pub = this.props.pubData.getIn(['pubData', '_id']);
		discussionObject.sourceJournal = this.props.appData.getIn(['journalData', '_id']);
		this.props.dispatch(addDiscussion(discussionObject, activeSaveID));
	},

	discussionVoteSubmit: function(type, discussionID, userYay, userNay) {
		if (!this.props.loginData.get('loggedIn')) {
			return this.props.dispatch(toggleVisibility());
		}
		this.props.dispatch(discussionVoteSubmit(type, discussionID, userYay, userNay));
	},

	filterDiscussions: function(discussionsData) {
		function findDiscussionRoot(discussions, searchID) {
			for (let index = 0; index < discussions.length; index++) {
				if (discussions[index]._id === searchID) {
					return discussions[index];
				} else if (discussions[index].children && discussions[index].children.length) {
					const foundChild = findDiscussionRoot(discussions[index].children, searchID);
					if (foundChild) {
						return foundChild;
					}
				}
			}
		}

		const output = [findDiscussionRoot(discussionsData, this.props.metaID)];
		return output;
	},

	archiveDiscussion: function(objectID) {
		this.props.dispatch(archiveDiscussion(objectID));
	},

	getHotness: function(discussion) {
		const yays = (discussion.yays) ? discussion.yays : 0;
		const nays = (discussion.nays) ? discussion.nays : 0;
		const timestamp = (discussion.postDate) ? new Date(discussion.postDate) : new Date(0);
		return hotScore(yays, nays, timestamp);
	},

	toggleMediaLibrary: function(codeMirrorID) {
		return ()=>{
			if (!this.props.loginData.get('loggedIn')) {
				return this.props.dispatch(toggleVisibility());
			}
			this.setState({
				showMediaLibrary: !this.state.showMediaLibrary,
				assetLibraryCodeMirrorID: codeMirrorID
			});
		};

	},
        
	closeMediaLibrary: function() {
		this.setState({
			showMediaLibrary: false,
			assetLibraryCodeMirrorID: undefined,
		});
	},

	requestAssetUpload: function(assetType) {
		return this.props.dispatch(waitForUpload(assetType));
	},
        
        
    dropdownChange: function(option){

        if (option.value == 'hotness'){
            const newState={
                sortBy: 'hotness'
            }

            this.setState(newState)
            
         } else if (option.value == 'upvotes'){
            const newState={
                sortBy: 'upvotes'
            }

            this.setState(newState)
            
         } else if (option.value == 'replyAmount'){
            const newState={
                sortBy: 'replyAmount'
            }

            this.setState(newState)
         }
       

    },
        

	render: function() {

		let discussionsData = this.props.discussionsData.get('discussions') && this.props.discussionsData.get('discussions').toJS ? this.props.discussionsData.get('discussions').toJS() : [];
		discussionsData = this.props.metaID ? this.filterDiscussions(discussionsData) : discussionsData;

		const addDiscussionStatus = this.props.discussionsData.get('addDiscussionStatus');
		// const newDiscussionData = this.props.discussionsData.get('newDiscussionData');
		const activeSaveID = this.props.discussionsData.get('activeSaveID');
		const isPubAuthor = this.props.pubData.getIn(['pubData', 'isAuthor']);
		const isPublished = this.props.pubData.getIn(['pubData', 'isPublished']);
        const isParent = true;
		const userAssets = this.props.loginData.getIn(['userData', 'assets']) ? this.props.loginData.getIn(['userData', 'assets']).toJS() : [];
        const authors = this.props.authors.toJS();
        
       console.log('before entering the if statement for comment list sort');
        
        if(this.state.sortBy=='hotness'){
            
            console.log('it entered the if statement for hotness');
            
            this.state.sortedDiscussions = discussionsData.sort(function(aIndex, bIndex) {
			const aScore = this.getHotness(aIndex);
			const bScore = this.getHotness(bIndex);
			if (aScore < bScore) {
				return -1;
			} else if (aScore > bScore) {
				return 1;
			}
			return 0;
		}.bind(this));
            
            
        } else if (this.state.sortBy=='upvotes'){
        
         console.log('it entered the else statement for upvotes');
        
        this.state.sortedDiscussions = discussionsData.sort(function(aIndex, bIndex){
                      
          const aUpvotes = aIndex.yays-aIndex.nays+1
          const bUpvotes = bIndex.yays-bIndex.nays+1
          
          if (aUpvotes < bUpvotes) {
				return 1;
			} else if (aUpvotes > bUpvotes) {
				return -1;
			}
			    return 0;
           
       }.bind(this));
        } else if (this.state.sortBy=='replyAmount'){
        
         console.log('it entered the else statement for replies');
            
        this.state.sortedDiscussions = discussionsData.sort(function(aIndex, bIndex){
                                  
          const aReplies = aIndex.children.length
          const bReplies = bIndex.children.length
          
          if (aReplies < bReplies) {
				return 1;
			} else if (aReplies > bReplies) {
				return -1;
			}
			    return 0;
           
       });
 }       
        
        
        console.log(this.props.loginData.getIn(['userData']))
        
		return (
			<div style={styles.container}>

				<Style rules={{
					'.pub-discussions-wrapper .p-block': {
						padding: '0.5em 0em',
					},
                    '.sortSelect .react-selectize.default.root-node .react-selectize-control': {
						borderBottom: '0px',
						padding: '0px 52px 0px 0px'
					},
					'.sortSelect .react-selectize.default.root-node .react-selectize-control .react-selectize-placeholder': {
						// padding: '8px 0px 8px 0px'
						lineHeight: 'normal',
					},
					'.sortSelect .react-selectize.root-node .react-selectize-control .react-selectize-toggle-button-container': {
						display: 'none',
					},
					'.sortSelect .react-selectize.root-node .react-selectize-control .react-selectize-reset-button-container': {
						display: 'none',
					},
					'.sortSelect .react-selectize.root-node .react-selectize-control .react-selectize-search-field-and-selected-values .resizable-input': {
						...globalStyles.h1,
						padding: '0px',
						margin: '0px 2px',
					},
					'.sortSelect .simple-select.react-selectize.root-node .simple-value': {
						margin: '0px 2px',
					},
					'.sortSelect .react-selectize.dropdown-menu.default': {
						fontSize: '0.6em',
					}
				}} />

				<div>
					<div className="modal-splash" onClick={this.closeMediaLibrary} style={[styles.modalSplash, this.state.showMediaLibrary && styles.modalSplashActive]}></div>
					<div style={[styles.assetLibraryWrapper, this.state.showMediaLibrary && styles.assetLibraryWrapperActive]}>
						{this.state.showMediaLibrary
							? <MediaLibrary
								closeLibrary={this.closeMediaLibrary}
								codeMirrorInstance={document.getElementById(this.state.assetLibraryCodeMirrorID).childNodes[0].CodeMirror} />
							: null
						}
					</div>
				</div>
                    

				<div id="pub-discussions-wrapper" className="pub-discussions-wrapper" style={styles.sectionWrapper}> {/* The classname pub-discussions-wrapper is used by selectionPlugin*/}
					{this.props.pubData.getIn(['pubData', 'referrer', 'name'])
						? <div>{this.props.pubData.getIn(['pubData', 'referrer', 'name'])} invites you to comment!</div>
						: null
					}

					{this.props.metaID
						? null
						: <DiscussionsInput
							addDiscussionHandler={this.addDiscussion}
							addDiscussionStatus={addDiscussionStatus}
							userThumbnail={this.props.loginData.getIn(['userData', 'thumbnail'])}
                            userName={this.props.loginData.getIn(['userData', 'name'])}
							activeSaveID={activeSaveID}
							saveID={'root'}
							isCollaborator={this.props.pubData.getIn(['pubData', 'isCollaborator'])}
							parentIsPrivate={false}
							isReply={false}
							codeMirrorID={'rootCommentInput'}
							isPublished={isPublished}
							userAssets={userAssets}
							toggleMediaLibrary={this.toggleMediaLibrary}
							requestAssetUpload={this.requestAssetUpload}
							/>
					}
                
                {/*default option??? editable??? */}
                    
                <div className="sortSelect">   
                <SimpleSelect transitionEnter={true} transitionLeave={true} onValueChange={this.dropdownChange}>
                    <option value = 'hotness' >Hottest Discussions</option>
                    <option value = 'replyAmount'>Longest Discussions</option>
                    <option value = 'upvotes'>Most Upvoted Discussions</option>
                </SimpleSelect>
                </div> 
                
					{
						this.state.sortedDiscussions.map((discussion)=>{
							// console.log(discussion);
							return (discussion
								? <DiscussionsItem
									key={discussion._id}
									slug={this.props.slug}
									discussionItem={discussion}
									isPubAuthor={isPubAuthor}
                                    isParent={isParent}
                                    pubAuthors={authors}

									isCollaborator={this.props.pubData.getIn(['pubData', 'isCollaborator'])}
									activeSaveID={activeSaveID}
									addDiscussionHandler={this.addDiscussion}
									addDiscussionStatus={addDiscussionStatus}
									userThumbnail={this.props.loginData.getIn(['userData', 'thumbnail'])}
									handleVoteSubmit={this.discussionVoteSubmit}
									handleArchive={this.archiveDiscussion}
									isPublished={isPublished}
									toggleMediaLibrary={this.toggleMediaLibrary}/>

								: <div style={styles.emptyContainer}>No Discussions Found</div>
							);
						})
					}

					{/* (discussionsData.length === 0) ?
						<div style={styles.emptyComments}>
							<div><FormattedMessage id="discussion.blank1" defaultMessage="There are no comments here yet."/></div>
							<div><FormattedMessage id="discussion.blank2" defaultMessage="Be the first to start the discussion!"/></div>
						</div>
					: null */}

				</div>

			</div>
		);
	}
});

//what is this for??? --> connects to the redux

export default connect( state => {
	return {
		appData: state.app,
		pubData: state.pub,
		loginData: state.login,
		discussionsData: state.discussions,
        authors: state.pub.getIn(['pubData','authors']),
		slug: state.router.params.slug,
		pathname: state.router.location.pathname,
		query: state.router.location.query,
	};
})( Radium(Discussions) );

styles = {
	container: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '0px 10px',
		},
	},
    sort:{
        paddingBottom: '10px',
        },
	emptyComments: {
		margin: '40% 6% 0px 3%',
		fontSize: '1.2em',
		textAlign: 'center',
		height: '40vh',
	},
    sortButton: {
        padding: '.45em .9em .6em .9em',
        borderRadius: '.1rem',
        color:'white',
    },
	emptyContainer: {
		margin: '10px auto',
		fontFamily: 'Courier',
		textAlign: 'center',
	},
	sectionWrapper: {
		transition: '.5s ease-in-out transform',
		margin: '10px 0px 30px 0px',
	},
	modalSplash: {
		opacity: 0,
		pointerEvents: 'none',
		width: '100vw',
		height: '100vh',
		position: 'fixed',
		top: 0,
		left: 0,
		backgroundColor: 'rgba(255,255,255,0.7)',
		transition: '.1s linear opacity',
		zIndex: 100,
	},
	modalSplashActive: {
		opacity: 1,
		pointerEvents: 'auto',
	},
	assetLibraryWrapper: {
		...globalStyles.largeModal,
		zIndex: 150,
		fontFamily: 'Lato',

		opacity: 0,
		pointerEvents: 'none',
		transform: 'scale(0.9)',
		transition: '.1s linear opacity, .1s linear transform',
	},
	assetLibraryWrapperActive: {
		opacity: 1,
		pointerEvents: 'auto',
		transform: 'scale(1.0)',
	},
};
