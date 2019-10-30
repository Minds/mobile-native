import React, {
  Component
} from 'react';

import Accordion from 'react-native-collapsible/Accordion';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { FlatList } from 'react-native-gesture-handler';
import i18n from '../../common/services/i18n.service';
import AuthService from '../../auth/AuthService';
import { StackActions, NavigationActions } from 'react-navigation';
import ShareService from '../../share/ShareService';

export default class CustomDrawerItems extends Component {

  state = {
    activeSections: [],
    pressedItem: null,
  };

  sections;

  sectionsButtons = [
    {
      isButton: true,
      key: 'invite',
      headerText: i18n.t('moreScreen.invite'),
      onPress: () => {
        ShareService.invite(this.props.user.me.guid);
      }
    },
    {
      isButton: true,
      key: 'logout',
      headerText: i18n.t('settings.logout'),
      onPress: () => {
        AuthService.logout();
        const loginAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Login' })
          ]
        })
        this.props.navigation.dispatch(loginAction);
      }
    },
  ]

  navigateTo = pressedItem => {
    this.setState({ pressedItem });
    this.props.navigation.navigate(pressedItem);
  }

  /**
   * This is used for cases where section.options.title isn't present
   */
  getHeaderText = (key) => {
    if (key.includes('&')) {
      return key.replace(/([a-z0-9])(\&)([A-Z])/g, '$1 $2 $3');
    }
    return key.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  }

  /**
   * Check if the section is active
   */
  isActive = (section) => {
    if (this.state.activeSections.length && this.state.activeSections.length > 0) {
      const activeSection = this.sections[this.state.activeSections[0]];
      return activeSection.key == section.key;
    }
    return false;
  }

  isPressed = (item) => {
    if (this.state.pressedItem) {
      return item == this.state.pressedItem;
    }
    return false;
  }

  /**
   * Set the array from where we build items
   */
  _setSections = () => {
    this.sections = [...Object.values(this.props.descriptors), ...this.sectionsButtons];
  }

  /**
   * Get the title of the section and render an Icon if has childs items 
   */
  _renderHeader = section => {
    return section.isButton ? this.renderButtonHeader(section) : this.renderScreenHeader(section);
  };

  renderScreenHeader = section => {
    const headerText = section.options.title || this.getHeaderText(section.key);
    const headerTextStyle = [styles.headerText];
    const icon = this.isActive(section) ? "ios-arrow-up" : "ios-arrow-down";

    if (this.isPressed(section.key)) {
      headerTextStyle.push(styles.itemPressed);
    }
    
    let header = (
      <View style={styles.header}>
        <Text style={headerTextStyle}>{headerText}</Text>
        <IonIcon name={icon} size={ 14 } />
      </View>
    );

    if (!section.navigation.router) {
      header = (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.navigateTo(section.key)}>
            <Text style={headerTextStyle}>{headerText}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return header;
  }

  renderButtonHeader = section => {
    const headerText = section.headerText;
    const headerTextStyle = [styles.headerText];

    if (this.isPressed(section.key)) {
      headerTextStyle.push(styles.itemPressed);
    }

    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={section.onPress}>
          <Text style={headerTextStyle}>{headerText}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  /**
   * Render a FlatList for sections with childs items
   */
  _renderContent = section => {
    if (!section.navigation || !section.navigation.router) return null;

    const items = Object.keys(section.navigation.router.childRouters);
    return (
      <View style={styles.content}>
        <FlatList 
          data={items}
          renderItem={this.renderItemContent}
        />
      </View>
    );
  };

  /**
   * Render the child item of a section
   */
  renderItemContent = ({item, index}) => {
    const childTextStyles = [styles.childText];
    if (this.isPressed(item)) {
      childTextStyles.push(styles.itemPressed);
    }
    return (
      <View style={styles.itemChild}>
        <TouchableOpacity onPress={() => this.navigateTo(item)}>
          <Text style={childTextStyles}> {item} </Text>
        </TouchableOpacity>
      </View>
    )
  }

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  render() {
    this._setSections();
    const props = this.props;
    return (
      <Accordion
        sections={this.sections}
        activeSections={this.state.activeSections}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
      />
    );
  }

}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerText: {
    color: '#4A4A4A',
    fontFamily: 'Roboto',
  },
  itemChild: {
    padding: 10,
    paddingLeft: 15,
    marginLeft: 15,
  },
  childText: {
    color: '#9B9B9B',
    fontFamily: 'Roboto',
  },
  itemPressed: {
    color: '#4A90E2',
  }
})