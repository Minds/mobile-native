//@ts-nocheck
import React, {
  Component
} from 'react';

import ActionSheet from 'react-native-actionsheet';
import i18n from '../common/services/i18n.service';
import { FLAG_EDIT_COMMENT, FLAG_DELETE_COMMENT, FLAG_CREATE_COMMENT } from '../common/Permissions';
import featuresService from '../common/services/features.service';
import sessionService from '../common/services/session.service';

/**
 * Comment Component
 */
export default class CommentActionSheet extends Component {

  state = {
    options: [],
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  /**
   * Show actions
   */
  showActions = () => {
    this.setState({
      options: this.getOptions()
    }, () => {
      this.ref.current && this.ref.current.show();
    });
  }

  handleSelection = (i) => {
    const action = this.state.options[i];
    this.props.onSelection && this.props.onSelection(action);
  }

  /**
   * Get actionsheet options
   */
  getOptions = () => {
    let actions = [i18n.t('cancel')];

    const comment = this.props.comment;

    // TODO: clean up permissions feature flag
    if (featuresService.has('permissions')) {
      if (comment.can(FLAG_EDIT_COMMENT)) {
        actions.push( i18n.t('edit') );
        if (!comment.mature) {
          actions.push( i18n.t('setExplicit') );
        } else {
          actions.push( i18n.t('removeExplicit') );
        }
      }

      if (comment.can(FLAG_DELETE_COMMENT)) {
        actions.push( i18n.t('delete') );
      }

      if (!comment.isOwner()) {
        actions.push( i18n.t('report') );
      }

      actions.push( i18n.t('copy') );

      if (comment.parent_guid_l2 == 0 && comment.can(FLAG_CREATE_COMMENT)) {
        actions.push( i18n.t('reply') );
      }

    } else {
      if (comment.isOwner()) {
        actions.push( i18n.t('edit') );
        actions.push( i18n.t('delete') );

        if (!comment.mature) {
          actions.push( i18n.t('setExplicit') );
        } else {
          actions.push( i18n.t('removeExplicit') );
        }
      } else {
        if (sessionService.getUser().isAdmin()) {
          actions.push( i18n.t('delete') );

          if (!comment.mature) {
            actions.push( i18n.t('setExplicit') );
          } else {
            actions.push( i18n.t('removeExplicit') )
          }
        } else if (this.props.entity.isOwner()) {
          actions.push( i18n.t('delete') );
        }

        actions.push( i18n.t('report') );
        actions.push( i18n.t('copy') );
      }
      if (comment.parent_guid_l2 == 0) {
        actions.push( i18n.t('reply') );
      }
    }

    return actions;
  }

  /**
   * Render
   */
  render() {
    return (
      <ActionSheet
        ref={this.ref}
        options={this.state.options}
        onPress={this.handleSelection}
        cancelButtonIndex={0}
      />
    )
  }
}